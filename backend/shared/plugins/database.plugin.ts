import Database from "better-sqlite3";
import fp from "fastify-plugin"

const db = new Database('database/db.sqlite3');

const dbClient = {
	query<T>(sql: string, params: any[] = []) {
		const stmt = db.prepare(sql);
		return stmt.run(...params) as T;
	},

	execute(sql: string, params: any[] = []) {
		const stmt = db.prepare(sql);
		return stmt.run(...params);
	},

	queryOne<T>(sql: string, params: any[] = []) {
		const stmt = db.prepare(sql);
		return stmt.run(...params) as T | null;
	},
}

export default fp(async (fastify) => {
  fastify.decorate('db', dbClient);
  
  fastify.addHook('onClose', () => {
    db.close();
  });
});