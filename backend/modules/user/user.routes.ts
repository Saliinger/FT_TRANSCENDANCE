import { FastifyInstance } from "fastify";

export default async function userRoutes(fastify: FastifyInstance) {
	fastify.post('user/update', async (request, reply) => {
		console.log("update");
	});
}