import Database from "better-sqlite3";
import fp from "fastify-plugin";

const database = new Database('database/db.sqlite3');

const dbClient = {
	query<T>(sql: string, params: any[] = []): T[] | null {
		const stmt = database.prepare(sql);
		return stmt.all(...params) as T[] | null;
	},

	execute(sql: string, params: any[] = []) {
		const stmt = database.prepare(sql);
		return stmt.run(...params);
	},

	queryOne<T>(sql: string, params: any[] = []): T | null {
		const stmt = database.prepare(sql);
		return stmt.get(...params) as T | null;
	},
}

export default fp(async (fastify) => {
	fastify.decorate('db', dbClient);

	fastify.addHook('onClose', () => {
		database.close();
	});
});