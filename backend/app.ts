import Fastify from 'fastify'
import autoload from '@fastify/autoload'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './modules/auth/auth.routes.ts'
import userRoutes from './modules/user/user.routes.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const fastify = Fastify({
	logger: true
})

// Register plugins
await fastify.register(autoload, {
	dir: path.join(__dirname, 'shared/plugins')
});

// Register routes manually
await fastify.register(authRoutes, { prefix: '/api' });
await fastify.register(userRoutes, { prefix: '/api' });

// Run the server!
fastify.listen({ port: 3000 }, function (err, address) {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
	// Server is now listening on ${address}
})