import { StatusWhatsapp } from "./IWhatsapp";

export interface IMessageCount {
  Message: number;
  Contact: number;
  Chat: number;
}

export interface IWhatsappEvolution {
  connectionStatus: StatusWhatsapp;
  createdAt: string;
  disconnectionAt: string | null;
  id: string;
  name: string;
  number: string;
  profileName: string;
  profilePicUrl: string;
  updatedAt: string;
  _count: IMessageCount;
}
