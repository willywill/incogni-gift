"use client";

import FingerprintJS from "@fingerprintjs/fingerprintjs";

let visitorIdPromise: Promise<string> | null = null;

/**
 * Gets or generates a visitor ID using FingerprintJS.
 * The result is cached to avoid multiple API calls.
 */
export async function getVisitorId(): Promise<string> {
	// If we already have a promise in progress, return it
	if (visitorIdPromise) {
		return visitorIdPromise;
	}

	// Create a new promise to get the visitor ID
	visitorIdPromise = (async () => {
		try {
			// Initialize the FingerprintJS agent
			const fp = await FingerprintJS.load();
			
			// Get the visitor ID
			const result = await fp.get();
			
			return result.visitorId;
		} catch (error) {
			console.error("Error getting visitor ID:", error);
			// Return a fallback ID if fingerprinting fails
			// This ensures the app still works even if fingerprinting is blocked
			return `fallback-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
		}
	})();

	return visitorIdPromise;
}

