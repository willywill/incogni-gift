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
	const timestamp = new Date().toISOString();
	const url = new URL(request.url);
	const isMagicLinkRequest = url.pathname.includes("/magic-link") || url.pathname.includes("/sign-in/magic-link");
	
	if (isMagicLinkRequest) {
		console.log(`[Magic Link API] [${timestamp}] Received magic link request - Path: ${url.pathname}`);
	}
	
	if (isAuthBypassEnabled()) {
		if (isMagicLinkRequest) {
			console.log(`[Magic Link API] [${timestamp}] Auth bypass enabled, returning success response`);
			const response = new Response(JSON.stringify({ success: true }), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			});
			console.log(`[Magic Link API] [${timestamp}] Returning bypass response with status: ${response.status}`);
			return response;
		}
	}
	
	try {
		const response = await auth.handler(request);
		if (isMagicLinkRequest) {
			console.log(`[Magic Link API] [${timestamp}] Magic link request processed - Response status: ${response.status}`);
		}
		return response;
	} catch (error) {
		const errorTimestamp = new Date().toISOString();
		const errorDetails = {
			message: error instanceof Error ? error.message : String(error),
			stack: error instanceof Error ? error.stack : undefined,
			name: error instanceof Error ? error.name : undefined,
		};
		console.error(`[Magic Link API] [${errorTimestamp}] Error processing magic link request:`, errorDetails);
		throw error;
	}
}
