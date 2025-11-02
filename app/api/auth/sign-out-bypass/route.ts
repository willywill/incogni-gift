import { isAuthBypassEnabled } from "@/app/lib/auth-server";

export async function POST() {
	if (!isAuthBypassEnabled()) {
		return new Response(JSON.stringify({ error: "Bypass mode not enabled" }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}

	const isProduction = process.env.NODE_ENV === "production";
	
	// Clear the session cookie by setting it to expire immediately
	const response = new Response(JSON.stringify({ success: true }), {
		status: 200,
		headers: { 
			"Content-Type": "application/json",
		},
	});
	
	response.headers.set(
		"Set-Cookie",
		`better-auth.session-token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${isProduction ? "; Secure" : ""}`
	);
	
	return response;
}

