import { atom } from "jotai";

export interface IWhatsappToCreate {
  name: string;
  phoneNumber: string;
}

export const contactsAtoms = atom<IWhatsappToCreate[]>([]);
