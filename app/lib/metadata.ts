/**
 * Get the base URL for the application
 * Uses NEXT_PUBLIC_BASE_URL if available, otherwise falls back to localhost
 */
export function getBaseUrl(): string {
	if (typeof window !== "undefined") {
		// Client-side: use window.location.origin
		return window.location.origin;
	}

	// Server-side: use environment variable or fallback
	return (
		process.env.NEXT_PUBLIC_BASE_URL ||
		(process.env.VERCEL_URL
			? `https://${process.env.VERCEL_URL}`
			: "http://localhost:3000")
	);
}

/**
 * Generate an absolute URL for a public asset
 * @param path - Path to the asset relative to the public folder (e.g., "/holiday-sample-pic.png")
 */
export function getAbsoluteUrl(path: string): string {
	const baseUrl = getBaseUrl();
	// Ensure path starts with /
	const normalizedPath = path.startsWith("/") ? path : `/${path}`;
	return `${baseUrl}${normalizedPath}`;
}

