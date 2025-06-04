import { drizzle } from 'drizzle-orm/postgres-js'

const databaseURI: string = process.env.DATABASE_URL as string

const db = drizzle(databaseURI);

export {db}