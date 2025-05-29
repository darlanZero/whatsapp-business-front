export interface IWhatsappGroup {
	id: string;
	subject: string;
	subjectOwner?: string;
	subjectTime: number;
	pictureUrl: string | null;
	size: number;
	creation: number;
	owner?: string;
	desc: string;
	descId: string;
	restrict: boolean;
	announce: boolean;
	isCommunity: boolean;
	isCommunityAnnounce: boolean;
}
