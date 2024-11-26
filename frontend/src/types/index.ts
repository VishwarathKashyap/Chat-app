export interface User {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  token: string;
}

export interface Message {
  _id: string;
  sender: User;
  content: string;
  chat: Chat;
  createdAt: string;
}

export interface Chat {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: User[];
  latestMessage?: Message;
  groupAdmin?: User;
  createdAt: string;
  updatedAt: string;
}