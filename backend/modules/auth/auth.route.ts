import { FastifyInstance } from 'fastify';
import { createAuthController } from "./auth.controller.ts"
import { createAuthService } from './auth.service.ts';


export default async function authRoutes(fastify: FastifyInstance) {
	const authService = createAuthService(fastify);
	const authController = createAuthController(authService);
	
	fastify.post('/auth/login', authController.login);
	fastify.post('/auth/register', authController.register);
}