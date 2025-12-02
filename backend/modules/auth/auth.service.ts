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
		},
		async handleOAuth42(code: string) {
			const tokenResponse = await fetch('https://api.intra.42.fr/oauth/token', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					grant_type: 'authorization_code',
					client_id: process.env.OAUTH_42_CLIENT_ID,
					client_secret: process.env.OAUTH_42_CLIENT_SECRET,
					code,
					redirect_uri: process.env.OAUTH_42_REDIRECT_URI
				})
			});

			const { access_token } = await tokenResponse.json();

			const profileResponse = await fetch('https://api.intra.42.fr/v2/me', {
				headers: { Authorization: `Bearer ${access_token}` }
			});

			const profile = await profileResponse.json();

			let user = await fastify.db.queryOne<User>(
				'SELECT * FROM users WHERE oauthProvider = ? AND oauthId = ?',
				['42', profile.id.toString()]
			);

			if (!user) {
				const userId = crypto.randomUUID();
				await fastify.db.execute(
					'INSERT INTO users (id, username, email, passwordHash, displayName, oauthProvider, oauthId, ...) VALUES (...)',
					[userId, profile.login, profile.email, '', profile.usual_full_name, '42', profile.id, ...]
				);
				user = await fastify.db.queryOne('SELECT * FROM users WHERE id = ?', [userId]);
			}

			const token = fastify.jwt.sign({
				userId: user.id,
				email: user.email
			});

			return { user, token };
		}

	}
}