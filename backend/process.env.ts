import { z } from 'zod';

// Define schema for environment variables
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  
  // Database
  DATABASE_URL: z.string().default('./database/db.sqlite3'),
  
  // JWT
  JWT_SECRET: z.string().min(32),
  
  // OAuth 42
  OAUTH_42_CLIENT_ID: z.string().optional(),
  OAUTH_42_CLIENT_SECRET: z.string().optional(),
  OAUTH_42_REDIRECT_URI: z.string().optional(),
  
  // Frontend
  FRONTEND_URL: z.string().default('http://localhost:8080'),
});

// Parse and validate
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.format());
  process.exit(1);
}

// Export typed env
export const env = parsed.data;