// Mantém a estrutura original e adiciona suporte para Meta

export interface JWT_DECODED_DATA {
	id: number;
	name: string;
	username: string;
	email: string;
	role: string;
	phoneNumber: string;
	isActive: boolean;

// Campos adicionais para Meta API (opcionais para manter compatibilidade)	

	businessAccounts?: Array<{
		businessAccountId: string;
		businessName: string;
		phoneNumberId: string;
		displayPhoneNumber: string;
		wabaId: string;
		wabaName: string;
	}>;

	iat?: number;
	exp?: number;
}

export interface JWT_DECODED_DATA_WHATSAPP {
	instanceName: string;
	status: string;
	phoneNumber: string;
	iat?: number;
	exp?: number;
}