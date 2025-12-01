import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserDTO, SafeUser } from "./user.model.ts"

interface UserService {
	getAll(): Promise<SafeUser[] | null>,
	getByUsername(username: string): Promise<SafeUser | null>,
	getOnline(): Promise<SafeUser[] | null>,
	update(): Promise<SafeUser | null>,
}

export const createUserController = (userService: UserService) => {
	return {
		async getAll(
			request: FastifyRequest,
			reply: FastifyReply
		) {
			const users = await userService.getAll();
			if (!users || users.length === 0)
				return reply.code(404).send({ error: "No users found" });
			return reply.send({ success: true, users });
		},
		async getByUsername(
			request: FastifyRequest<{ Body: string }>,
			reply: FastifyReply
		) {
			const username = request.body;
			const user = await userService.getByUsername(username);
			if (!user)
				return reply.code(404).send({ error: "User not found" });

			return reply.send({ success: true, user });
		},
		async getOnline(
			request: FastifyRequest,
			reply: FastifyReply
		) {
			const users = await userService.getOnline();
			if (!users || users.length === 0)
				return reply.code(404).send({ error: "No online users" });
			return reply.send({ success: true, users });
		},
		async update(
			request: FastifyRequest,
			reply: FastifyReply
		) {

		}
	}
}