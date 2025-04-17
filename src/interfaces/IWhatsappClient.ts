import { StatusWhatsapp } from "./IWhatsapp";

export interface IMessageCount {
  Message: number;
  Contact: number;
  Chat: number;
}

export interface IWhatsappClient {
  connectionStatus: StatusWhatsapp;
  createdAt: string; // ou Date se for converter
  disconnectionAt: string | null; // ou Date | null
  id: string;
  name: string;
  number: string;
  profileName: string;
  profilePicUrl: string;
  updatedAt: string; // ou Date
  _count: IMessageCount;
}
