import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async function tournementRoutes(fastify: FastifyInstance) {
	fastify.post('tournement/hello', async(request: FastifyRequest, reply: FastifyReply) => {
		console.log("hello");
		return reply.send({ success: true, "Hello": "string" });
	});
}