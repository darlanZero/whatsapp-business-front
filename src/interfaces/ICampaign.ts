import { IContact } from "./IContact";
import { IList } from "./IList";

export interface ICampaign {
  id?: number;
  name: string;
  active: boolean;
  status: ICampaignStatus;
  content: string;
  file: string;
  userId: number;
  listContactId: number;
  total_contacts: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  deletedAt?: string | Date;
  startAt?: string | Date;
  endAt?: string | Date;
  startTimeAt?: string | Date;
  endTImeAt?: string | Date;
  whatsappId: number;
  saved_contacts?: IContact[];
  list?: IList;
}

export const ICampaignStatus = {
  FINISH: "FINISH",
  STOPPED: "STOPPED",
  CREATED: "CREATED",
  RUNNING: "RUNNING",
} as Record<string, ICampaignStatus>;

export type ICampaignStatus = "FINISH" | "STOPPED" | "CREATED" | "RUNNING";
