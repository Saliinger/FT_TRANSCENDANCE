import { FastifyInstance } from "fastify";
import { createUserService } from "./user.service.ts";
import { createUserController } from "./user.controller.ts";

export default async function userRoutes(fastify: FastifyInstance) {
	const userService = createUserService(fastify);
	const userController = createUserController(userService);
	
	fastify.post('user/update', userController.update);
	fastify.get('user/getAll', userController.getAll);
	fastify.get('user/online', userController.getOnline);
	fastify.get('user/username', userController.getByUsername)

}