export interface IWhatsapp {
  id: number;
  phoneNumber: string;
  status: StatusWhatsapp;
  instanceId?: string;
  instanceName?: string;
  token?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  active: boolean;
}

export type StatusWhatsapp = "open" | "close" | "connecting";
