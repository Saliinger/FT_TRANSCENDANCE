import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async function gameRoutes(fastify: FastifyInstance) {
	fastify.post('game/hello', async(request: FastifyRequest, reply: FastifyReply) => {
		console.log("hello");
		return reply.send({ success: true, "Hello": "string" });
	});
}