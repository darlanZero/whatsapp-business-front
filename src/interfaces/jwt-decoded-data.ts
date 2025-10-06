export interface JWT_DECODED_DATA {
	email: string;
	exp: number;
	iat: number;
	id: string | number;
	name: string;
	username: string;
	role: string;
	apiType?: 'evolution' | 'meta';
}

export interface JWT_DECODED_DATA_WHATSAPP {
	instanceName: string;
}