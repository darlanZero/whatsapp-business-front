import { IUser } from "./IUser";

/**
 * Interface para informações de conta comercial do WhatsApp Business (Meta API)
 */
export interface IBusinessAccount {
    businessAccountId: string;
    businessName: string;
    phoneNumberId: string;
    displayPhoneNumber: string;
    wabaId: string;
    wabaName: string;
}

/**
 * Interface estendida de IUser com informações específicas da Meta API
 * Usado quando o usuário faz login via Meta (Embedded Signup)
 */
export interface IUserMeta extends IUser {
  // Informações de múltiplas empresas associadas (Meta API)
    businessAccounts?: IBusinessAccount[];
    
    // Tipo de API (para diferenciar de Evolution)
    apiType: 'meta';
}

/**
 * Type guard para verificar se o usuário é do tipo Meta
 */
export function isUserMeta(user: IUser | IUserMeta): user is IUserMeta {
    return 'apiType' in user && user.apiType === 'meta';
}

/**
 * Type guard para verificar se o usuário tem múltiplas empresas
 */
export function hasMultipleBusinessAccounts(user: IUser | IUserMeta): boolean {
    if (!isUserMeta(user)) return false;
    return !!(user.businessAccounts && user.businessAccounts.length > 1);
}