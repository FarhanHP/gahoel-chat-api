import { ObjectId } from 'bson';

export interface User {
  email: string,
  name: string,
  imageUrl: string,
  password: string,
  createdAt: number,
  updatedAt: number,
}

export interface LoginTokenInfo {
  userId: ObjectId,
  token: string,
  firebaseRegisterToken: string,
}

export interface LoginBody {
  email: String,
  password: String,
  firebaseRegisterToken: String,
}
