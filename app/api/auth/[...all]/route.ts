import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/app/db";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	emailAndPassword: {
		enabled: false,
	},
	email: {
		enabled: true,
		sendVerificationEmail: true,
	},
	secret: process.env.BETTER_AUTH_SECRET || "change-me-in-production",
	baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
	basePath: "/api/auth",
});

export const { GET, POST } = auth.handler;

