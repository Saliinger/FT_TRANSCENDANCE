import { FastifyRequest, FastifyReply } from "fastify";
import { SafeUser, CreateUserDTO } from "../user/user.model.ts";

interface LoginBody {
	email: string;
	password: string;
}

interface RegisterBody {
	username: string;
	email: string;
	password: string;
	passwordConfirmation: string;
	displayName?: string;
}

interface AuthService {
	login(email: string, password: string): Promise<SafeUser | null>;
	register(toCreate: CreateUserDTO): Promise<SafeUser | null>;
}

export const createAuthController = (authService: AuthService) => {
	return {
		async login(
			request: FastifyRequest<{ Body: LoginBody }>,
			reply: FastifyReply
		) {
			const { email, password } = request.body;

			if (!email || !password)
				return reply.code(400).send({ error: "Missing fields" });

			const user = await authService.login(email, password);

			if (!user)
				return reply.code(401).send({ error: "Invalid credentials" });

			reply.send({ success: true, user });
		},

		async register(
			request: FastifyRequest<{ Body: RegisterBody }>,
			reply: FastifyReply
		) {
			const toCheck = request.body;
			if (toCheck.password != toCheck.passwordConfirmation)
				return reply.code(401).send({ error: "Passwords doesn't match" });
			const toCreate: CreateUserDTO = {
				username: toCheck.username,
				email: toCheck.email,
				password: toCheck.password,
				displayName: toCheck.displayName,
			};
			const user = authService.register(toCreate);

		},
	};
};