export interface ChatMessage {
  id: string;
  chatRoomId: string;
  senderId: string;
  receiverId?: string;
  content: string;
  imageUrl?: string;
  timestamp: Date;
  isRead: boolean;
  senderName: string;
}

// Chat Room interface
export interface ChatRoom {
  id: string;
  isActive: boolean;
  status: 'WAITING' | 'ACTIVE' | 'CLOSED';
  subject?: string;
  lastMessageTime?: Date;
  unreadMessageCount: number;
  firstResponseTime?: Date;
  customerId: string;
  customerName: string;
  moderatorId?: string;
  moderatorName?: string;
  messages: ChatMessage[];
}

// Event interfaces
export interface ModeratorJoinedEvent {
  roomId: string;
  moderatorName: string;
}

export interface MessageResponse {
  chatRoomId: string;
  content: string;
  imageUrl?: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  isRead: boolean;
}

export interface SendImageMessageRequest {
  chatRoomId: string;
  image: string;
}
