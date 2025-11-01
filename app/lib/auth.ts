import { createAuthClient } from "better-auth/react";

// Better Auth client configuration
// This will connect to the backend API routes when they are implemented
// For now, this is a placeholder client setup
export const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "/api/auth",
});

// Export hooks for use in components
export const { useSession, signIn, signUp, signOut } = authClient;

