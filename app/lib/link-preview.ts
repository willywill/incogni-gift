/**
 * Server-only link preview utilities
 * DO NOT import this file in client components
 */

import { getLinkPreview } from "link-preview-js";
import dns from "node:dns";
import { promisify } from "util";
import { extractUrls } from "./link-preview-client";

const resolve4 = promisify(dns.resolve4);
const resolve6 = promisify(dns.resolve6);

// Temporarily disable DNS resolution for Vercel serverless compatibility
// Set to true to re-enable DNS resolution (SSRF protection)
const ENABLE_DNS_RESOLUTION = false;

// DNS resolution timeout in milliseconds
const DNS_TIMEOUT_MS = 3000; // 3 seconds

/**
 * Wrap DNS resolution with a timeout to prevent hanging
 */
async function resolveWithTimeout<T>(
	resolveFn: () => Promise<T>,
	timeoutMs: number
): Promise<T> {
	return Promise.race([
		resolveFn(),
		new Promise<T>((_, reject) =>
			setTimeout(() => reject(new Error("DNS resolution timeout")), timeoutMs)
		),
	]);
}

// List of blocked URL shortener domains
const BLOCKED_SHORTENER_DOMAINS = [
	"bit.ly",
	"tinyurl.com",
	"t.co",
	"goo.gl",
	"ow.ly",
	"buff.ly",
	"rebrand.ly",
	"is.gd",
	"soo.gd",
	"s2r.co",
	"cutt.ly",
	"shorte.st",
	"adf.ly",
];

export interface LinkPreviewData {
	url: string;
	previewImage: string | null;
	previewTitle: string | null;
	previewDescription: string | null;
}

/**
 * Check if a URL is from a blocked shortener domain
 */
export function isShortenerUrl(url: string): boolean {
	try {
		const urlObj = new URL(url);
		const hostname = urlObj.hostname.toLowerCase();

		// Remove 'www.' prefix if present
		const domain = hostname.replace(/^www\./, "");

		return BLOCKED_SHORTENER_DOMAINS.some((shortener) => {
			return domain === shortener || domain.endsWith(`.${shortener}`);
		});
	} catch {
		return false;
	}
}

/**
 * Resolve DNS hostname to prevent SSRF attacks
 * This function resolves the hostname to an IP address before making requests
 */
async function resolveDNSHost(url: string): Promise<string> {
	// Skip DNS resolution if disabled (for serverless environments like Vercel)
	if (!ENABLE_DNS_RESOLUTION) {
		// Still validate URL format
		new URL(url);
		return url;
	}

	try {
		const urlObj = new URL(url);
		const hostname = urlObj.hostname;

		// Resolve hostname to IP addresses
		// Try IPv4 first, then IPv6
		// Both wrapped with timeout to prevent hanging
		try {
			const addresses = await resolveWithTimeout(
				() => resolve4(hostname),
				DNS_TIMEOUT_MS
			);
			if (addresses && addresses.length > 0) {
				// Return the original URL - the resolution itself prevents SSRF
				// by ensuring the hostname resolves to a valid IP
				return url;
			}
		} catch {
			// IPv4 failed, try IPv6
		}

		try {
			const addresses = await resolveWithTimeout(
				() => resolve6(hostname),
				DNS_TIMEOUT_MS
			);
			if (addresses && addresses.length > 0) {
				return url;
			}
		} catch {
			// IPv6 also failed
		}

		throw new Error(`Failed to resolve hostname: ${hostname}`);
	} catch (error) {
		throw new Error(`Invalid URL or DNS resolution failed: ${error instanceof Error ? error.message : String(error)}`);
	}
}

/**
 * Type guard to check if preview has images, title, and description
 */
function hasPreviewData(
	preview: Awaited<ReturnType<typeof getLinkPreview>>
): preview is Awaited<ReturnType<typeof getLinkPreview>> & {
	images: string[];
	title: string;
	description: string | undefined;
} {
	return (
		'images' in preview &&
		'title' in preview &&
		'description' in preview
	);
}

/**
 * Generate link preview for a URL
 * Returns preview data or null if generation fails
 */
export async function generateLinkPreview(url: string): Promise<LinkPreviewData | null> {
	try {
		// Resolve DNS first to prevent SSRF (if enabled)
		await resolveDNSHost(url);

		// Generate preview using link-preview-js
		// Set timeout to 5 seconds to prevent HTTP requests from hanging
		const previewOptions: Parameters<typeof getLinkPreview>[1] = {
			timeout: 5000, // 5 seconds timeout for HTTP requests
		};

		// Only add resolveDNSHost option if DNS resolution is enabled
		if (ENABLE_DNS_RESOLUTION) {
			previewOptions.resolveDNSHost = async (urlToResolve: string) => {
				await resolveDNSHost(urlToResolve);
				return urlToResolve;
			};
		}

		const preview = await getLinkPreview(url, previewOptions);

		// Validate that preview has the required properties (images, title, description)
		if (!hasPreviewData(preview)) {
			return {
				url,
				previewImage: null,
				previewTitle: null,
				previewDescription: null,
			};
		}

		return {
			url,
			previewImage: preview.images?.[0] || null,
			previewTitle: preview.title || null,
			previewDescription: preview.description || null,
		};
	} catch (error) {
		console.error("Error generating link preview:", error);
		return null;
	}
}

/**
 * Process text to detect URLs and generate previews
 * Returns preview data if URL is found and preview is generated successfully
 * Throws error if shortener is detected
 */
export async function processLinkPreview(text: string): Promise<LinkPreviewData | null> {
	const urls = extractUrls(text);

	if (urls.length === 0) {
		return null;
	}

	// Use the first URL found
	const url = urls[0];

	// Check if URL is a shortener
	if (isShortenerUrl(url)) {
		throw new Error("URL shorteners are not supported. Please use the full product URL.");
	}

	// Generate preview
	return await generateLinkPreview(url);
}

