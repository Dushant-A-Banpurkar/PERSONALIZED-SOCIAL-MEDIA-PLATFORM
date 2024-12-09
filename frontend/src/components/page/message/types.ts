// types.ts
export interface User {
  _id: string;
  profileimg: string;
  firstname: string;
  lastname: string;
  username: string;
}

export interface Message {
  conversationId: string;
  recipient: User;
  sender: User;
  lastMessage: string;
  updatedAt: string;
}
