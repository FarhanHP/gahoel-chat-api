import { ObjectId } from 'bson';

export interface DatabaseDocument {
  _id: ObjectId,
  updatedAt: number,
  createdAt: number,
}

export interface User extends DatabaseDocument {
  email: string,
  name: string,
  imageUrl: string,
  password: string,
}

export interface LoginTokenInfo extends DatabaseDocument {
  userId: ObjectId,
  token: string,
  firebaseRegisterToken: string,
}

export interface LoginBody extends DatabaseDocument {
  email: string,
  password: string,
  firebaseRegisterToken: string,
}

export interface CreateMessageBody extends DatabaseDocument {
  recipientEmail: string,
  messageBody: string,
}

export interface CreateMessageBody2 extends DatabaseDocument {
  roomId: string,
  messageBody: string,
}

export interface ChatRoom extends DatabaseDocument {
  userIds: [ObjectId, ObjectId],
  lastInteractAt: number,
}

export interface Message extends DatabaseDocument {
  roomId: ObjectId,
  senderUserId: ObjectId,
  messageBody: string,
}
