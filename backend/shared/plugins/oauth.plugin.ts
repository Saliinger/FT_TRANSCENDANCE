import fp from 'fastify-plugin';
import oauth2 from '@fastify/oauth2';

export default fp(async (fastify) => {
	await fastify.register(oauth2, {
		name: 'oauth42',
		credentials: {
			client: {
				id: process.env.OAUTH_42_CLIENT_ID!,
				secret: process.env.OAUTH_42_CLIENT_SECRET!
			},
			auth: oauth2.OAUTH2_PROVIDER_DEFINITIONS.OAUTH2_42
		},
		startRedirectPath: '/api/auth/oauth/42',
		callbackUri: process.env.OAUTH_42_REDIRECT_URI!
	});
});