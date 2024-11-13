import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  Subject,
  Subscription,
} from 'rxjs';
import {
  first,
  map,
  pairwise,
  startWith,
  switchMap,
  takeUntil,
} from 'rxjs/operators';
import { MenuItem, MessageService } from 'primeng/api';
import { ChatService } from '../../../services/chatbox.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { ChatMessage, ChatRoom } from '../../../interfaces/models/chat-box';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ImageViewerComponent } from '../image-view/image-view.component';
import { User } from '../../../interfaces/models/user';
import { WelcomeMessage } from '../../../interfaces/models/welcome-message';
import { OverlayPanel } from 'primeng/overlaypanel';
import { FileUpload } from 'primeng/fileupload';
export type ConnectionStatus = boolean;

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss'],
})
export class ChatboxComponent implements OnInit, OnDestroy {
  @ViewChild('chatPanel') chatPanel!: OverlayPanel;
  @ViewChild('chatBtn') chatBtn!: ElementRef;
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  @ViewChild('messageContainer')
  @HostListener('scroll', ['$event.target'])
  private messageContainer!: ElementRef<HTMLDivElement>;
  private lastReadTimestamp: number = 0;
  private markAsReadDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  onScroll(target: HTMLElement): void {
    if (
      this.messageContainer &&
      target === this.messageContainer.nativeElement
    ) {
      const element = target;
      const scrollPosition = element.scrollTop;
      const maxScroll = element.scrollHeight - element.clientHeight;
      const scrollPercentage = (scrollPosition / maxScroll) * 100;
      if (scrollPercentage > 90) {
        void this.handleMessagesRead();
      }
    }
  }
  currentUser$ = this.authService.user;
  chatMessages$ = this.chatService.getChatMessages();
  currentRoom$ = this.chatService.getCurrentChatRoom();
  pendingChats$ = this.chatService.getPendingChats();
  connectionStatus$: Observable<ConnectionStatus>;
  unreadCount$ = this.chatService.getUnreadCount();
  currentTime = new Date();
  activeTab: 'pending' | 'active' = 'pending';
  activeChats$ = this.currentUser$.pipe(
    switchMap(user =>
      user?.role === 'MODERATOR' ? this.chatService.getActiveChats() : EMPTY,
    ),
  );
  pendingChatsCount$: Observable<string> = this.pendingChats$.pipe(
    map(chats => (chats?.length || 0).toString()),
  );
  messageForm: FormGroup;
  startChatForm: FormGroup;
  isSending = false;
  isStartingChat = false;
  display = true;
  isRefreshing = false;
  isModerator$ = this.currentUser$.pipe(
    map(user => user?.role === 'MODERATOR'),
    startWith(false),
  );
  private isLoading = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoading.asObservable();
  tabItems: MenuItem[] = [
    {
      label: 'Pending',
      icon: 'pi pi-clock',
      command: () => this.setActiveTab('pending'),
      id: 'pending-tab',
      automationId: 'pending-tab',
    },
    {
      label: 'Active',
      icon: 'pi pi-check',
      command: () => this.setActiveTab('active'),
      id: 'active-tab',
      automationId: 'active-tab',
    },
  ];
  quickActionOptions = [
    {
      subject: 'Tư vấn thuốc',
      label: 'Tư vấn các sản phẩm thuốc với dược sĩ chuyên môn',
    },
    {
      subject: 'Tư vấn sức khỏe',
      label: 'Tư vấn các vấn đề sức khỏe với bác sĩ chuyên khoa',
    },
    {
      subject: 'Hỗ trợ khẩn cấp',
      label: 'Tôi cần được hỗ trợ nhanh',
    },
  ];
  private destroy$ = new Subject<void>();
  private dialogRef: DynamicDialogRef | null = null;
  private subscriptions: Subscription[] = [];
  private currentRoom: ChatRoom | null = null;
  constructor(
    private chatService: ChatService,
    private authService: AuthenticationService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private dialogService: DialogService,
  ) {
    this.messageForm = this.fb.group({
      content: ['', Validators.required],
    });
    this.connectionStatus$ = this.chatService.getConnectionStatus();
    this.startChatForm = this.fb.group({
      subject: ['', [Validators.required, Validators.minLength(10)]],
    });
    this.chatService.display$.subscribe(display => {
      this.display = display;
    });
  }

  ngOnInit(): void {
    this.setupConnectionHandlers();
    this.setupMessageTracking();

    this.subscriptions = [
      this.chatMessages$.subscribe(() => this.scrollToBottom()),

      this.isModerator$
        .pipe(takeUntil(this.destroy$))
        .subscribe(async isModerator => {
          if (!isModerator) {
            await this.chatService.checkActiveChat();
          }
        }),

      this.currentRoom$.pipe(takeUntil(this.destroy$)).subscribe(room => {
        if (room?.status === 'ACTIVE' || room?.status === 'WAITING') {
          this.display = true;
        }
      }),

      this.currentRoom$.pipe(takeUntil(this.destroy$)).subscribe(async room => {
        if (room?.id && room.status === 'ACTIVE') {
          this.display = true;
          await this.chatService.markAsRead(room.id);
        }
      }),

      this.currentRoom$.subscribe(room => {
        this.currentRoom = room;
      }),

      this.isModerator$
        .pipe(takeUntil(this.destroy$))
        .subscribe(isModerator => {
          if (isModerator) {
            void this.loadModeratorData();
          }
        }),
    ];
  }

  private setupMessageTracking(): void {
    this.subscriptions.push(
      this.chatMessages$.subscribe(messages => {
        if (messages.length > 0 && this.isViewVisible()) {
          void this.handleMessagesRead();
        }
        this.scrollToBottom();
      }),
    );
  }

  private async handleMessagesRead(): Promise<void> {
    if (this.markAsReadDebounceTimer) {
      clearTimeout(this.markAsReadDebounceTimer);
    }

    return new Promise<void>(resolve => {
      this.markAsReadDebounceTimer = setTimeout(async () => {
        const currentRoom = await this.getCurrentRoom();
        if (currentRoom?.id) {
          const currentTimestamp = Date.now();
          if (currentTimestamp - this.lastReadTimestamp > 1000) {
            try {
              await this.chatService.markAsRead(currentRoom.id);
              this.lastReadTimestamp = currentTimestamp;
            } catch (error) {
              console.error('Error marking messages as read:', error);
            }
          }
        }
        resolve();
      }, 300);
    });
  }

  private isViewVisible(): boolean {
    return this.display && !!this.messageContainer?.nativeElement;
  }

  setActiveTab(tab: 'pending' | 'active'): void {
    this.activeTab = tab;
  }

  private async loadModeratorData(): Promise<void> {
    try {
      await this.chatService.refreshPendingChats();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load moderator data',
      });
    }
  }

  welcomeMessage: WelcomeMessage = {
    getTime: (): Date => new Date(),
    content: 'Xin chào! Medigo có thể hỗ trợ điều gì cho bạn?',
  };

  handleKeyDown(event: KeyboardEvent, action: string, payload?: any): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      switch (action) {
        case 'accept':
          this.acceptChat(payload);
          break;
        case 'select':
          this.selectChat(payload);
          break;
        case 'send':
          void this.sendMessage();
          break;
      }
    }
  }

  async selectChat(chatId: string): Promise<void> {
    try {
      await this.chatService.loadChatRoom(chatId);
      await this.chatService.loadChatMessages(chatId);
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load chat',
      });
    }
  }

  private setupConnectionHandlers(): void {
    this.connectionStatus$
      .pipe(takeUntil(this.destroy$), pairwise())
      .subscribe(([prev, current]) => {
        if (prev && !current) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Disconnected',
            detail: 'Lost connection to chat service. Trying to reconnect...',
          });
        } else if (!prev && current) {
          this.messageService.add({
            severity: 'success',
            summary: 'Connected',
            detail: 'Reconnected to chat service',
          });
          this.currentRoom$.pipe(first()).subscribe(async currentRoom => {
            if (currentRoom?.id) {
              await this.chatService.loadChatRoom(currentRoom.id);
              await this.chatService.loadChatMessages(currentRoom.id);
            }
          });
        }
      });
  }

  async refreshPendingChats(): Promise<void> {
    if (this.chatService.canRefreshPendingChats()) {
      this.isRefreshing = true;
      try {
        await this.chatService.manualRefreshPendingChats();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Pending chats refreshed',
        });
      } catch (error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to refresh pending chats',
        });
      } finally {
        this.isRefreshing = false;
      }
    }
  }

  isConnected(status: ConnectionStatus): boolean {
    return status === true;
  }

  viewImage(imageUrl: string | undefined): void {
    if (!imageUrl) return;

    if (this.dialogRef) {
      this.dialogRef.close();
    }

    this.dialogRef = this.dialogService.open(ImageViewerComponent, {
      data: { imageUrl },
      header: 'Image Preview',
      width: '90%',
      height: '90%',
      dismissableMask: true,
      showHeader: false,
      closeOnEscape: true,
      baseZIndex: 10000,
    });
  }

  private cleanup(): void {
    if (this.markAsReadDebounceTimer) {
      clearTimeout(this.markAsReadDebounceTimer);
      this.markAsReadDebounceTimer = null;
    }
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = null;
    }
    this.messageForm.reset();
    this.startChatForm.reset();
    this.isSending = false;
    this.isStartingChat = false;
    this.isRefreshing = false;
  }

  // Chat Actions
  async startNewChat(subject: string): Promise<void> {
    if (!this.chatService.canInitiateChat()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Only customers can start new chats',
      });
      return;
    }

    this.isStartingChat = true;
    try {
      await this.chatService.initiateChat(subject);
      this.messageService.add({
        severity: 'success',
        summary: 'Chat Started',
        detail: 'Waiting for staff to join...',
      });
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to start chat',
      });
    } finally {
      this.isStartingChat = false;
    }
  }

  async acceptChat(chatId: string): Promise<void> {
    if (!this.chatService.canAcceptChats()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Only moderators can accept chats',
      });
      return;
    }
    try {
      await this.chatService.acceptChat(chatId);
      this.setActiveTab('active');
      this.messageService.add({
        severity: 'success',
        summary: 'Chat Accepted',
        detail: 'You have joined the chat',
      });

      // Load messages after the initial acceptance to speed up response
      await this.chatService.loadChatMessages(chatId);
      await this.chatService.refreshActiveChats();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to accept chat',
      });
    }
  }

  async sendMessage(): Promise<void> {
    if (this.messageForm.invalid || this.isSending) {
      return;
    }

    const content = this.messageForm.get('content')?.value?.trim();
    if (!content) {
      return;
    }

    this.isSending = true;
    try {
      const currentRoom = await this.getCurrentRoom();
      if (currentRoom?.status === 'ACTIVE') {
        await this.chatService.sendMessage(currentRoom.id, content);
        this.messageForm.reset();
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Cannot send message, chat is not active',
        });
      }
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to send message',
      });
    } finally {
      this.isSending = false;
    }
  }

  async handleImageUpload(event: any): Promise<void> {
    try {
      // Kiểm tra event từ p-fileUpload
      if (!event || !event.files || event.files.length === 0) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No file selected',
        });
        return;
      }

      const file = event.files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Only image files are allowed',
        });
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Image size should be less than 5MB',
        });
        return;
      }

      this.isSending = true;

      // Lấy current room
      const currentRoom = await this.getCurrentRoom();
      if (!currentRoom?.id) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No active chat room',
        });
        return;
      }

      // Gửi ảnh qua service
      await this.chatService.sendImage(currentRoom.id, file);

      // Clear file upload
      if (this.fileUpload) {
        this.fileUpload.clear();
      }

      // Thông báo thành công
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Image sent successfully',
      });
    } catch (error) {
      console.error('Error handling image upload:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to send image',
      });
    } finally {
      this.isSending = false;
    }
  }

  async endChat(): Promise<void> {
    try {
      const currentRoom = await this.getCurrentRoom();
      if (currentRoom) {
        await this.chatService.endChat(currentRoom.id);
        this.messageService.add({
          severity: 'info',
          summary: 'Chat Ended',
          detail: 'Chat session has ended',
        });
        this.display = false;
        // Clear local state
        this.cleanup();
      }
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to end chat',
      });
    }
  }

  // Utility Methods
  toggleChat(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.currentRoom?.status === 'ACTIVE' && !this.display) {
      this.chatPanel.show(event);
      this.display = true;
      return;
    }

    if (this.display) {
      this.chatPanel.hide();
    } else {
      this.chatPanel.show(event);
    }
    this.display = !this.display;
  }

  async handleEnterKey(event: Event): Promise<void> {
    const keyEvent = event as KeyboardEvent;
    if (keyEvent.key === 'Enter' && !keyEvent.shiftKey) {
      keyEvent.preventDefault();
      await this.sendMessage();
    }
  }

  private async getCurrentRoom(): Promise<ChatRoom | null> {
    return new Promise(resolve => {
      this.currentRoom$.pipe(first()).subscribe(room => resolve(room));
    });
  }

  public scrollToBottom(): void {
    try {
      const element = this.messageContainer?.nativeElement;
      if (element) {
        setTimeout(() => {
          element.scrollTop = element.scrollHeight;
          void this.handleMessagesRead();
        }, 0);
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.cleanup();
    this.destroy$.next();
    this.destroy$.complete();
  }

  isMessageFromCurrentUser(
    message: ChatMessage,
    currentUser: User | null,
  ): boolean {
    return message.senderId === currentUser?.userId;
  }

  isActiveChat(room: ChatRoom | null): boolean {
    return room?.status === 'ACTIVE';
  }
}
