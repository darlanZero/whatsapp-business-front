export interface JWT_DECODED_DATA {
	email: string;
	exp: number;
	iat: number;
	id: string | number;
	nome: string;
	username: string;
	role: string;
}