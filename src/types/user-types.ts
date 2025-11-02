// types/user.ts

export interface BusinessAccount {
    businessAccountId: string;
    businessName: string;
    phoneNumberId: string;
    displayPhoneNumber: string;
    wabaId: string;
    wabaName: string;
    }

export interface UserInformations {
  // Informações do usuário (para login Meta)
    id?: string;
    name?: string;
    email?: string;
    
    // Lista de empresas associadas (para login Meta)
    businessAccounts?: BusinessAccount[];
    
    // Informações de empresa única (para login tradicional)
    businessAccountId?: string;
    businessName?: string;
    phoneNumberId?: string;
    displayPhoneNumber?: string;
    
    // Tipo de API usado
    apiType?: 'meta' | 'traditional';
}

export interface UserContextType {
    informations: UserInformations | null;
    setInformations: (info: UserInformations | null) => void;
    loading: boolean;
}