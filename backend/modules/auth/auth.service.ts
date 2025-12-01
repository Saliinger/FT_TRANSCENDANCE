import { FastifyInstance } from "fastify"
import { User, SafeUser, CreateUserDTO } from "../user/user.model.ts"

export const createAuthService = (fastify: FastifyInstance) => {
	return {
		async verifyPassword(password: string, hash: string): Promise<boolean> {
			console.log(password + ' ' + hash);
			return true;
		},
		async login(email: string, password: string): Promise<SafeUser | null> {
			const user = await fastify.db.queryOne<User>(
				'SELECT * FROM users WHERE email = ?',
				[email]
			);
			if (!user)
				return null;

			const isValid = await this.verifyPassword(password, user.passwordHash);
			if (!isValid)
				return null;

			const { passwordHash, ...safeUser } = user;
			return safeUser as User;
		},
		async register(toCreate: CreateUserDTO): Promise<SafeUser | null> {
			const id = crypto.randomUUID();
			const passwordHash = toCreate.password;
			await fastify.db.execute(
				'INSERT INTO users (id, username, email, passwordHash, displayName) VALUES (?, ?, ?, ?, ?)',
				[id, toCreate.username, toCreate.email, passwordHash, toCreate.displayName]
			);

			return null;
		}

	}
}