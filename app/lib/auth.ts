import { createAuthClient } from "better-auth/react";

// Better Auth client configuration
// Connects to the backend API routes at /api/auth
export const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "/api/auth",
});

// Export hooks for use in components
export const { useSession, signIn, signUp, signOut } = authClient;

