import { FastifyInstance } from "fastify";
import { SafeUser } from "./user.model.ts";

export const createUserService = (fastify: FastifyInstance) => {
	return {
		async getAll(): Promise<SafeUser[] | null> {
			return null;
		},
		async getByUsername(username: string): Promise<SafeUser | null> {
			return null;
		},
		async getOnline(): Promise<SafeUser[] | null> {
			return null;
		},
		async update(): Promise<SafeUser | null> {
			return null;
		}
	}
}