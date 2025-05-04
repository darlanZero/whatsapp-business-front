export interface IGroupParticipant {
	id: string;
	admin: 'superadmin' | 'admin' | null;
	name: string | null;
	imgUrl: string | null;
}