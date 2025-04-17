import { UserRole } from "./user-role";


interface Address {
  zipCode: string;
  city: string;
  state: string;
  country: string;
  street: string;
}

export interface IUser {
  id: number;
  name: string;
  username: string;
  status: string;
  email: string;
  role: UserRole;
  phoneNumber: string;
  address?: Address
}
