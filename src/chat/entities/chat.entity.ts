import { ObjectId } from 'mongoose';

export class Chat {
  name: string;
  text: string;
}
export interface ChatMessage {
  text: string;
  sender: ObjectId;
  receiver: ObjectId;
  senderType: 'User' | 'servicer';
  receiverType: 'User' | 'servicer';
  time: Date;
  _id: ObjectId;
}