import { DATABASE_URL } from '$env/static/private';
import { drizzle } from 'drizzle-orm/neon-serverless';

if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

export const db = drizzle(DATABASE_URL);
