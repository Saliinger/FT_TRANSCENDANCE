import { User } from "../user/user.model"

export interface Chat {
	id: string;
	participent: User[];
	content: Message[];
};

export interface Message {
	from: User;
	content: string;
};