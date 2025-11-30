import { FastifyInstance } from 'fastify';

export default async function authRoutes(fastify: FastifyInstance) {
	fastify.post('/auth/login', async (request, reply) => {
		console.log("login");
	});

	fastify.post('/auth/register', async (request, reply) => {
		console.log("register");
	});
}