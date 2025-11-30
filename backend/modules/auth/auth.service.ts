import { FastifyInstance } from "fastify"
import { User, SafeUser } from "../user/user.model"

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

				const { passwordHash, ...safeUser} = user;
				return safeUser as User;
			},
			async register(username: string, email: string, password: string): Promise<SafeUser | null> {
				return null;
			}
			
	}
}