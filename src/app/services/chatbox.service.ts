import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, catchError, first, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import {
  ChatMessage,
  ChatRoom,
  MessageResponse,
  ModeratorJoinedEvent,
  SendImageMessageRequest,
} from '../interfaces/models/chat-box';
import { User } from '../interfaces/models/user';
import { BaseResponse } from '../interfaces/models/base-response';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly API_URL = `${environment.BACKEND_API_URL}/api/chat-box`;
  private hubConnection!: signalR.HubConnection;
  private chatMessages = new BehaviorSubject<ChatMessage[]>([]);
  private currentChatRoom = new BehaviorSubject<ChatRoom | null>(null);
  private pendingChats = new BehaviorSubject<ChatRoom[]>([]);
  private unreadCount = new BehaviorSubject<number>(0);
  private connectionEstablished = new BehaviorSubject<boolean>(false);
  private refreshInterval: any;
  private activeChats = new BehaviorSubject<ChatRoom[]>([]);
  private display = new BehaviorSubject<boolean>(false);
  public display$ = this.display.asObservable();
  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
  ) {
    // Auto connect/disconnect based on auth state
    this.authService.user.subscribe((user: User | null) => {
      if (user?.token) {
        this.connect();
      } else {
        this.disconnect();
      }
    });
  }

  // Modified connect method with role-based logic
  private async connect(): Promise<void> {
    try {
      if (this.hubConnection) {
        await this.hubConnection.stop();
      }

      // Thêm retry logic
      let retryCount = 0;
      const maxRetries = 3;

      const startConnection = async (): Promise<void> => {
        try {
          this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${environment.BACKEND_API_URL}/chatHub`, {
              accessTokenFactory: () => {
                const token = this.authService.userValue?.token;
                if (!token) {
                  throw new Error('No authentication token available');
                }
                return token;
              },
              skipNegotiation: true,
              transport: signalR.HttpTransportType.WebSockets,
            })
            .configureLogging(signalR.LogLevel.Information)
            .withAutomaticReconnect({
              nextRetryDelayInMilliseconds: retryContext => {
                return Math.min(
                  1000 * Math.pow(2, retryContext.previousRetryCount),
                  5000,
                );
              },
            })
            .build();

          // Set up event handlers before starting connection
          this.setupCommonEventHandlers();
          if (this.authService.userValue?.role === 'MODERATOR') {
            this.setupModeratorEventHandlers();
          } else {
            this.setupCustomerEventHandlers();
          }

          await this.hubConnection.start();
          this.connectionEstablished.next(true);
          console.log('SignalR Connected');

          // Initialize data after successful connection
          if (this.authService.userValue?.role === 'MODERATOR') {
            await this.refreshPendingChats();
            this.setupModeratorAutomaticRefresh();
          }
        } catch (err) {
          console.error('Error starting connection:', err);
          if (retryCount < maxRetries) {
            retryCount++;
            console.log(`Retrying connection... Attempt ${retryCount}`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            await startConnection();
          } else {
            this.connectionEstablished.next(false);
            throw err;
          }
        }
      };

      await startConnection();
    } catch (error) {
      console.error('Failed to establish connection:', error);
      this.connectionEstablished.next(false);
    }
  }

  public async checkActiveChat(): Promise<void> {
    try {
      // Chỉ check cho customer
      if (this.authService.userValue?.role !== 'MODERATOR') {
        const response = await this.http
          .get<BaseResponse<ChatRoom>>(`${this.API_URL}/rooms`)
          .toPromise();

        if (response?.isSucceed && response.result) {
          // Nếu có chat room đang active
          this.currentChatRoom.next(response.result);
          await this.loadChatMessages(response.result.id);
        }
      }
    } catch (error) {
      console.error('Error checking active chat:', error);
    }
  }

  private setupCommonEventHandlers(): void {
    // Message events
    this.hubConnection.on('ReceiveMessage', (message: MessageResponse) => {
      const currentMessages = this.chatMessages.value;
      const newMessage: ChatMessage = {
        id: message.senderId,
        chatRoomId: message.chatRoomId,
        senderId: message.senderId,
        receiverId: '',
        content: message.content,
        imageUrl: message.imageUrl,
        timestamp: new Date(message.timestamp),
        isRead: message.isRead,
        senderName: message.senderName,
      };
      this.chatMessages.next([...currentMessages, newMessage]);
    });

    // Error handling
    this.hubConnection.on('Error', (errorMessage: string) => {
      console.error('Hub error:', errorMessage);
    });

    // Chat ended event
    this.hubConnection.on('ChatEnded', () => {
      if (this.currentChatRoom.value) {
        this.currentChatRoom.next({
          ...this.currentChatRoom.value,
          isActive: false,
          status: 'CLOSED',
        });

        // Clear messages when chat ends
        this.chatMessages.next([]);

        // For moderator, refresh chats if needed
        if (this.authService.userValue?.role === 'MODERATOR') {
          void this.refreshActiveChats();
          void this.refreshPendingChats();
        }
      }
    });

    // Messages read event
    this.hubConnection.on(
      'MessagesRead',
      (data: { chatRoomId: string; readAt: Date }) => {
        const currentMessages = this.chatMessages.value;
        const updatedMessages = currentMessages.map(msg =>
          msg.chatRoomId === data.chatRoomId ? { ...msg, isRead: true } : msg,
        );
        this.chatMessages.next(updatedMessages);
      },
    );

    // Unread count update
    this.hubConnection.on(
      'UpdateUnreadCount',
      (data: { chatRoomId: string; unreadCount: number }) => {
        const currentRoom = this.currentChatRoom.value;
        if (currentRoom && currentRoom.id === data.chatRoomId) {
          this.currentChatRoom.next({
            ...currentRoom,
            unreadMessageCount: data.unreadCount,
          });
        }
      },
    );

    // Connection state events
    this.hubConnection.onreconnecting(() => {
      console.log('Attempting to reconnect...');
      this.connectionEstablished.next(false);
    });

    this.hubConnection.onreconnected(() => {
      console.log('Reconnected to hub');
      this.connectionEstablished.next(true);
      const currentRoom = this.currentChatRoom.value;
      if (currentRoom?.id) {
        void this.loadChatRoom(currentRoom.id);
      }
    });

    this.hubConnection.onclose(() => {
      console.log('Connection closed');
      this.connectionEstablished.next(false);
    });
  }

  private setupModeratorEventHandlers(): void {
    this.hubConnection.on('PendingChats', (chats: ChatRoom[]) => {
      this.pendingChats.next(chats);
    });

    this.hubConnection.on('NewChatRequest', (chat: ChatRoom) => {
      const currentPendingChats = this.pendingChats.value;
      this.pendingChats.next([...currentPendingChats, chat]);
    });

    // Add handler for when moderator accepts chat
    this.hubConnection.on('ChatAccepted', async (chatRoom: ChatRoom) => {
      this.currentChatRoom.next({
        ...chatRoom,
        status: 'ACTIVE',
      });
      await this.loadChatMessages(chatRoom.id);
      await this.refreshActiveChats();
    });
  }

  private setupCustomerEventHandlers(): void {
    this.hubConnection.on('ModeratorJoined', (event: ModeratorJoinedEvent) => {
      const currentRoom = this.currentChatRoom.value;
      if (currentRoom && currentRoom.id === event.roomId) {
        this.currentChatRoom.next({
          ...currentRoom,
          moderatorName: event.moderatorName,
          status: 'ACTIVE',
        });
      }
    });

    this.hubConnection.on('ReconnectToChat', (chatRoom: ChatRoom) => {
      this.currentChatRoom.next(chatRoom);
      this.loadChatMessages(chatRoom.id);
      this.display.next(true);
    });

    this.hubConnection.on('ChatInitiated', (chatRoom: ChatRoom) => {
      this.currentChatRoom.next({
        ...chatRoom,
        messages: [],
        unreadMessageCount: 0,
      });
    });
  }

  private async disconnect(): Promise<void> {
    if (this.hubConnection) {
      await this.hubConnection.stop();
      this.currentChatRoom.next(null);
      this.chatMessages.next([]);
      this.pendingChats.next([]);
      this.unreadCount.next(0);
      clearInterval(this.refreshInterval);
    }
  }

  public async canStartNewChat(): Promise<boolean> {
    const user = this.authService.userValue;
    if (!user) return false;
    if (user.role === 'MODERATOR') return false;

    const activeChat = await this.getCurrentChatRoom()
      .pipe(first())
      .toPromise();
    return !activeChat;
  }

  public async refreshPendingChats(): Promise<void> {
    if (this.authService.userValue?.role !== 'MODERATOR') return;

    try {
      const response = await this.http
        .get<BaseResponse<ChatRoom[]>>(`${this.API_URL}/rooms/pending`)
        .toPromise();

      if (response?.isSucceed && response.result) {
        this.pendingChats.next(response.result);
      }
    } catch (error) {
      console.error('Error loading pending chats:', error);
    }
  }

  private setupModeratorAutomaticRefresh(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }

    this.refreshInterval = setInterval(() => {
      if (this.authService.userValue?.role === 'MODERATOR') {
        void this.refreshPendingChats();
      } else {
        clearInterval(this.refreshInterval);
      }
    }, 1000); // Refresh every 1 second
  }

  // Chat Actions
  public async initiateChat(subject: string): Promise<void> {
    if (this.authService.userValue?.role === 'MODERATOR') {
      throw new Error('Moderators cannot initiate chats');
    }
    await this.hubConnection?.invoke('InitiateChat', { subject });
  }

  public async acceptChat(chatRoomId: string): Promise<void> {
    if (this.authService.userValue?.role !== 'MODERATOR') {
      throw new Error('Only moderators can accept chats');
    }
    try {
      await this.hubConnection?.invoke('AcceptChat', chatRoomId);
      // Load chat room after accepting
      await this.loadChatRoom(chatRoomId);
      // Load messages
      await this.loadChatMessages(chatRoomId);
    } catch (error) {
      throw new Error('Failed to accept chat');
    }
  }

  public async sendMessage(chatRoomId: string, content: string): Promise<void> {
    if (
      !this.hubConnection ||
      this.hubConnection.state !== signalR.HubConnectionState.Connected
    ) {
      throw new Error('No connection to server!');
    }

    const currentRoom = this.currentChatRoom.value;
    if (!currentRoom || currentRoom.status !== 'ACTIVE') {
      throw new Error('Cannot send message - chat is not active');
    }

    // const currentMessages = this.chatMessages.value;
    // this.chatMessages.next([...currentMessages, newMessage]);

    await this.hubConnection.invoke('SendMessage', { chatRoomId, content });
  }

  getActiveChats(): Observable<ChatRoom[]> {
    if (this.authService.userValue?.role !== 'MODERATOR') {
      return of([]);
    }
    this.refreshActiveChats();
    return this.activeChats.asObservable();
  }

  public async refreshActiveChats(): Promise<void> {
    try {
      const response = await this.http
        .get<BaseResponse<ChatRoom[]>>(`${this.API_URL}/rooms/active`)
        .toPromise();

      if (response?.isSucceed && response.result) {
        this.activeChats.next(response.result);
      }
    } catch (error) {
      console.error('Error loading active chats:', error);
      this.activeChats.next([]);
    }
  }

  public async sendImage(chatRoomId: string, file: File): Promise<void> {
    try {
      console.log('Sending image:', { chatRoomId, file });

      // Convert to base64
      const base64Image = await this.fileToBase64(file);

      // Prepare request
      const request: SendImageMessageRequest = {
        chatRoomId: chatRoomId,
        image: base64Image,
      };

      if (this.hubConnection?.state === 'Connected') {
        // Send via SignalR and wait for response
        const response = await this.hubConnection.invoke<MessageResponse>(
          'SendImageMessage',
          request,
        );

        // If successful, manually add the message to the UI
        if (response) {
          const currentMessages = this.chatMessages.value;
          const newMessage: ChatMessage = {
            id: response.senderId,
            chatRoomId: response.chatRoomId,
            senderId: response.senderId,
            receiverId: '',
            content: response.content || '',
            imageUrl: response.imageUrl,
            timestamp: new Date(response.timestamp),
            isRead: response.isRead,
            senderName: response.senderName,
          };

          this.chatMessages.next([...currentMessages, newMessage]);
        }

        console.log('Image sent and UI updated successfully');
      } else {
        throw new Error('Hub connection is not established');
      }
    } catch (error) {
      console.error('Error sending image:', error);
      throw error;
    }
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise<string>(
      (
        resolve: (value: string) => void,
        reject: (error: any) => void,
      ): void => {
        const reader: FileReader = new FileReader();

        reader.onload = (): void => {
          const result = reader.result;
          if (typeof result === 'string') {
            resolve(result);
          } else {
            reject(new Error('Failed to convert file to base64'));
          }
        };

        reader.onerror = (): void => {
          reject(new Error('Error reading file'));
        };

        reader.readAsDataURL(file);
      },
    );
  }

  public async endChat(chatRoomId: string): Promise<void> {
    await this.hubConnection?.invoke('EndChat', chatRoomId);
  }

  public canAcceptChats(): boolean {
    return this.authService.userValue?.role === 'MODERATOR';
  }

  public canInitiateChat(): boolean {
    return this.authService.userValue?.role !== 'MODERATOR';
  }

  public isUserModerator(): boolean {
    return this.authService.userValue?.role === 'MODERATOR';
  }

  public async markAsRead(chatRoomId: string): Promise<void> {
    await this.hubConnection?.invoke('MarkAsRead', chatRoomId);
  }

  public async refreshMessages(roomId: string): Promise<void> {
    await this.loadChatMessages(roomId);
  }

  // Load data methods
  public async loadChatMessages(id: string): Promise<void> {
    try {
      const response = await this.http
        .get<
          BaseResponse<ChatMessage[]>
        >(`${this.API_URL}/rooms/${id}/messages`)
        .toPromise();

      if (response?.isSucceed && response.result) {
        this.chatMessages.next(response.result);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }

  public async loadChatRoom(roomId: string): Promise<ChatRoom | null> {
    try {
      const response = await this.http
        .get<BaseResponse<ChatRoom>>(`${this.API_URL}/rooms/${roomId}`)
        .toPromise();

      if (response?.isSucceed && response.result) {
        this.currentChatRoom.next(response.result);
        return response.result;
      }
    } catch (error) {
      console.error('Error loading chat room:', error);
    }
    return null;
  }

  // Observables
  public getChatMessages(): Observable<ChatMessage[]> {
    return this.chatMessages.asObservable();
  }

  public getCurrentChatRoom(): Observable<ChatRoom | null> {
    return this.currentChatRoom.asObservable();
  }

  getPendingChats(): Observable<ChatRoom[]> {
    if (this.authService.userValue?.role !== 'MODERATOR') {
      return of([]);
    }
    return this.pendingChats.asObservable();
  }

  public getConnectionStatus(): Observable<boolean> {
    return this.connectionEstablished.asObservable();
  }

  public getUnreadCount(): Observable<number> {
    return this.http
      .get<BaseResponse<number>>(`${this.API_URL}/messages/unread`)
      .pipe(
        map(response => {
          if (response.isSucceed && response.result !== undefined) {
            return response.result;
          }
          return 0;
        }),
        catchError(() => of(0)),
      );
  }

  // Optional: Add method to manually trigger refresh
  public async manualRefreshPendingChats(): Promise<void> {
    if (this.authService.userValue?.role === 'MODERATOR') {
      await this.refreshPendingChats();
    }
  }

  // Optional: Add method to check if current user can refresh
  public canRefreshPendingChats(): boolean {
    return this.authService.userValue?.role === 'MODERATOR';
  }

  public setDisplay(value: boolean): void {
    this.display.next(value);
  }
}
