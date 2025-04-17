export interface IWhatsapp {
  id: number;
  phoneNumber: string; //
  status: StatusWhatsapp; //
  instanceId?: string;
  instanceName?: string; //
  token?: string;
  userId: number;
  createdAt: Date; //
  updatedAt: Date; //
  deletedAt?: Date | null;
  active: boolean;
}

export type StatusWhatsapp = "open" | "close" | "connecting";
