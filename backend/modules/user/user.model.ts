export interface User {
	id: string;
	username: string;
	email: string;
	passwordHash: string;

	displayName: string;

	chats: string[]; // chat id's

	oauthProvider?: '42' | null;
	oauthId?: string;
	twoFactorEnabled: boolean;
  	twoFactorSecret?: string;

	status: 'online' | 'offline' | 'in-game';
	
	lastSeen: Date;
	createdAt:Date;
	updatedAt: Date;
};

export interface SafeUser extends Omit<User, 'passwordHash' | 'twoFactorSecret'> {
};

export interface CreateUserDTO {
	username: string;
	email: string;
	password: string;
	displayName?: string;
};

export interface UpdateUserDTO {
	displayName?: string;
};