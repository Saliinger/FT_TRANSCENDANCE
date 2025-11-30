import Fastify from 'fastify'
import autoload from '@fastify/autoload'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const fastify = Fastify({
  logger: true
})

await fastify.register(autoload, {
	dir: path.join(__dirname, 'shared/plugins')
});

fastify.register(autoload, {
	dir: path.join(__dirname, 'modules'),
	options: { prefix: '/api' }
});

// Run the server!
fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})