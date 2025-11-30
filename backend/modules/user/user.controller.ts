import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserDTO, SafeUser } from "./user.model"

interface UserService {
	create(toCreate: CreateUserDTO): Promise<SafeUser | null>,
	getAll(): Promise<SafeUser[] | null>,
	getByUsername(username: string): Promise<SafeUser | null>,
	getOnline(): Promise<SafeUser[] | null>,
}

export const createUserController = (userService: UserService) => {
	return {
		async create(
			request: FastifyRequest<{ Body: CreateUserDTO }>,
			reply: FastifyReply
		) {
			const body = request.body;
			const newUser = await userService.create(body);
			if (!newUser)
				return reply.code(409).send({ error: "User already exists" });

			return reply.code(201).send({ success: true, user: newUser });
		},
		async getAll(
			request: null,
			reply: FastifyReply
		) {
			const users = await userService.getAll();
			if (!users || users.length === 0)
				return reply.code(404).send({ error: "No users found" });
			return reply.send({ success: true, users });
		},
		async getByUsername(
			request: { username: string },
			reply: FastifyReply
		) {
			const user = await userService.getByUsername(request.username);
			if (!user)
				return reply.code(404).send({ error: "User not found" });

			return reply.send({ success: true, user });
		},
		async getOnline(
			request: null,
			reply: FastifyReply
		) {
			const users = await userService.getOnline();
			if (!users || users.length === 0)
				return reply.code(404).send({ error: "No online users" });
			return reply.send({ success: true, users });
		},
	}
}