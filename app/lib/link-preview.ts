/**
 * Server-only link preview utilities
 * DO NOT import this file in client components
 */

import { extractUrls } from "./link-preview-client";

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
	previewFavicon: string | null;
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
 * Extract domain from URL for favicon generation
 */
function extractDomain(url: string): string | null {
	try {
		const urlObj = new URL(url);
		let hostname = urlObj.hostname.toLowerCase();
		// Remove 'www.' prefix if present
		hostname = hostname.replace(/^www\./, "");
		return hostname;
	} catch {
		return null;
	}
}

/**
 * Generate favicon URL using Google's free favicon service
 */
function generateFaviconUrl(url: string): string | null {
	const domain = extractDomain(url);
	if (!domain) {
		return null;
	}
	return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
}

/**
 * Generate link preview for a URL
 * Returns preview data or null if generation fails
 */
export async function generateLinkPreview(
	url: string,
): Promise<LinkPreviewData | null> {
	try {
		// Validate URL format
		new URL(url);

		// Get API key from environment
		const apiKey = process.env.LINKPREVIEW_API_KEY;
		if (!apiKey) {
			console.error("LINKPREVIEW_API_KEY is not set");
			return null;
		}

		// Call LinkPreview.net API
		const endpoint = `https://api.linkpreview.net/?key=${apiKey}&q=${encodeURIComponent(url)}`;

		// Set timeout to 5 seconds to prevent HTTP requests from hanging
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 5000);

		const response = await fetch(endpoint, {
			signal: controller.signal,
		});

		clearTimeout(timeoutId);

		if (!response.ok) {
			const errorText = await response.text();
			console.error(
				`LinkPreview API error: ${response.status} ${response.statusText}`,
				errorText,
			);
			return null;
		}

		const contentType = response.headers.get("content-type");
		const isJson = contentType && contentType.includes("application/json");

		let preview;
		if (isJson) {
			preview = await response.json();
		} else {
			const text = await response.text();
			console.error(
				`LinkPreview API returned non-JSON response: ${contentType}`,
				text,
			);
			return null;
		}

		// Debug: Log the API response to see what we're getting
		console.log("LinkPreview API response:", JSON.stringify(preview, null, 2));

		// Check if API returned an error
		if (preview.error) {
			console.error(`LinkPreview API error: ${preview.error}`);
			return null;
		}

		// Generate favicon URL using Google's free favicon service
		const faviconUrl = generateFaviconUrl(url);

		// Map API response to LinkPreviewData interface
		// Handle empty strings as null, and check for different possible field names
		const previewImage = preview.image || preview.images?.[0] || null;
		const previewTitle = preview.title || null;
		const previewDescription = preview.description || null;

		// Convert empty strings to null
		const result = {
			url: preview.url || url,
			previewImage:
				previewImage && previewImage.trim() !== "" ? previewImage : null,
			previewTitle:
				previewTitle && previewTitle.trim() !== "" ? previewTitle : null,
			previewDescription:
				previewDescription && previewDescription.trim() !== ""
					? previewDescription
					: null,
			previewFavicon: faviconUrl,
		};

		console.log("Processed preview data:", JSON.stringify(result, null, 2));

		return result;
	} catch (error) {
		if (error instanceof Error && error.name === "AbortError") {
			console.error("Link preview request timed out");
		} else {
			console.error("Error generating link preview:", error);
		}
		return null;
	}
}

/**
 * Process text to detect URLs and generate previews
 * Returns preview data if URL is found and preview is generated successfully
 * Throws error if shortener is detected
 */
export async function processLinkPreview(
	text: string,
): Promise<LinkPreviewData | null> {
	const urls = extractUrls(text);

	if (urls.length === 0) {
		return null;
	}

	// Use the first URL found
	const url = urls[0];

	// Check if URL is a shortener
	if (isShortenerUrl(url)) {
		throw new Error(
			"URL shorteners are not supported. Please use the full product URL.",
		);
	}

	// Generate preview
	return await generateLinkPreview(url);
}
