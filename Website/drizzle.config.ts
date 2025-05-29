import { defineConfig } from 'drizzle-kit';

export default defineConfig ({
  dialect:"postgresql",
  schema: './db/schema', // Path to your schema folder
  out: './db/migrations', // Folder where migrations should be saved
  dbCredentials: {
    url:process.env.DATABASE_URL!, // Use the DATABASE_URL from .env
  },
} )
