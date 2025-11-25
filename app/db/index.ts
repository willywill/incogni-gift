import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL environment variable is not set");
}

// Create a connection pool using the service account credentials
// The DATABASE_URL should point to the app_service user (not root)
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	max: 10,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 2000,
});

// Create and export the Drizzle database instance
export const db = drizzle(pool, { schema });

// Export the schema for use in other files
export * from "./schema";
