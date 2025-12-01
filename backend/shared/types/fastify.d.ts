import 'fastify';

declare module 'fastify' {
	interface FastifyInstance {
		db: {
			query<T>(sql: string, params?: any[]): Promise<T[]>;
			queryOne<T>(sql: string, params?: any[]): Promise<T | null>;
			execute(sql: string, params?: any[]): Promise<any>;
		};
	}
}