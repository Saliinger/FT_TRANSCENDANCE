import { FastifyInstance } from "fastify";
import { CreateUserDTO, SafeUser } from "./user.model";

export const createUserService = (fastify: FastifyInstance) => {
	return {
		async create(toCreate: CreateUserDTO): Promise<SafeUser | null> {
			return null;
		},
		async getAll(): Promise<SafeUser[] | null> {
			return null;
		},
		async getByUsername(username: string): Promise<SafeUser | null> {
			return null;
		},
		async getOnline(): Promise<SafeUser[] | null> {
			return null;
		}
	}
}