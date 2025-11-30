import { FastifyInstance } from "fastify";
import { createUserService } from "./user.service";
import { createUserController } from "./user.controller";

export default async function userRoutes(fastify: FastifyInstance) {
	const userService = createUserService(fastify);
	const userController = createUserController(userService);
	
	fastify.post('user/register', userController.create);
}