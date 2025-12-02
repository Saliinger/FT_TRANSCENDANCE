import 'fastify';
import '@fastify/jwt';

declare module 'fastify' {
	interface FastifyInstance {
		authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
		db: {
			query<T>(sql: string, params?: any[]): Promise<T[]>;
			queryOne<T>(sql: string, params?: any[]): Promise<T | null>;
			execute(sql: string, params?: any[]): Promise<any>;
		};

	}
}