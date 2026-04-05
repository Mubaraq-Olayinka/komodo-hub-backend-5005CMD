export interface Message {
  id?: string;

  senderId: string;
  senderName: string;
  senderEmail: string;

  receiverId: string;
  receiverEmail: string;

  message: string;

  createdAt: string;
}