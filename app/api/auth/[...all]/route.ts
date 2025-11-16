import { auth, createBypassSession, isAuthBypassEnabled } from "@/app/lib/auth-server";

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

	return await auth.handler(request);
}
