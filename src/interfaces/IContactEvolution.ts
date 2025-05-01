export interface IContactEvolution {
	id: string;
	instanceId: string;
	remoteJid: string;
	pushName: string;
	profilePicUrl: string | null;
	createdAt: string; // ou Date, se você for converter depois
	updatedAt: string; // idem
}