import { auth, createBypassSession, isAuthBypassEnabled, getSession } from "@/app/lib/auth-server";
import { db } from "@/app/db";
import { session } from "@/app/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
	if (isAuthBypassEnabled()) {
		const url = new URL(request.url);
		if (url.pathname.includes("session")) {
			try {
				const { sessionToken, response: mockResponse } = await createBypassSession();

				const response = new Response(JSON.stringify(mockResponse), {
					status: 200,
					headers: {
						"Content-Type": "application/json",
						"Cache-Control": "no-store",
					},
				});

				const isProduction = process.env.NODE_ENV === "production";
				response.headers.set(
					"Set-Cookie",
					`better-auth.session-token=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}${isProduction ? "; Secure" : ""}`
				);

				return response;
			} catch (error) {
				console.error("Auth bypass error:", error);
			}
		}
	}

	return await auth.handler(request);
}

export async function POST(request: Request) {
	if (isAuthBypassEnabled()) {
		const url = new URL(request.url);
		if (url.pathname.includes("/magic-link") || url.pathname.includes("/sign-in/magic-link")) {
			return new Response(JSON.stringify({ success: true }), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			});
		}
	}

	// Handle magic link sign-in requests: if user is already signed in, sign them out first
	const url = new URL(request.url);
	if (url.pathname.includes("/magic-link") || url.pathname.includes("/sign-in/magic-link")) {
		try {
			// Check if there's an existing session
			const existingSession = await getSession({ headers: request.headers });

			if (existingSession?.user?.id) {
				// User is already signed in - sign them out first to avoid "Invalid origin" errors
				try {
					await db.delete(session).where(eq(session.userId, existingSession.user.id));
				} catch (signOutError) {
					// Log but continue - the magic link request will still proceed
					console.error("Error signing out existing session before magic link:", signOutError);
				}
			}
		} catch (error) {
			// If session check fails, continue anyway - better-auth will handle it
			console.error("Error checking existing session:", error);
		}
	}

	return await auth.handler(request);
}
