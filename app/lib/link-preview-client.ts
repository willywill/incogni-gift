/**
 * Client-safe URL utility functions
 * These can be imported in client components
 */

/**
 * Extract URLs from text using regex
 */
export function extractUrls(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  const matches = text.match(urlRegex);
  return matches || [];
}

/**
 * Clean URL for display by removing query parameters
 */
export function cleanUrlForDisplay(url: string): string {
  try {
    const urlObj = new URL(url);
    // Remove query parameters and hash
    urlObj.search = "";
    urlObj.hash = "";
    return urlObj.toString();
  } catch {
    // If URL parsing fails, return original
    return url;
  }
}

/**
 * Clean URLs in text for display by removing query parameters
 */
export function cleanUrlsInText(text: string): string {
  const urls = extractUrls(text);
  let cleanedText = text;

  for (const url of urls) {
    const cleanedUrl = cleanUrlForDisplay(url);
    cleanedText = cleanedText.replace(url, cleanedUrl);
  }

  return cleanedText;
}

/**
 * Replace URLs in text with "From [favicon] [domain name]" format
 */
export function replaceUrlsWithSource(text: string): string {
  const urls = extractUrls(text);
  let replacedText = text;

  for (const url of urls) {
    const domain = extractDomain(url);
    if (domain) {
      const domainName = formatDomainName(domain);
      const faviconUrl = getFaviconUrl(domain);
      const replacement = `From ${domainName}`;
      replacedText = replacedText.replace(url, replacement);
    }
  }

  return replacedText;
}

/**
 * Extract domain name from URL
 */
export function extractDomain(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return null;
  }
}

/**
 * Format domain name for display (e.g., "amazon.com" -> "Amazon", "bestbuy.com" -> "Best Buy")
 */
export function formatDomainName(domain: string): string {
  // Remove www. prefix
  let formatted = domain.replace(/^www\./i, "");

  // Remove TLD
  formatted = formatted.replace(/\.[^.]+$/, "");

  // Split by common separators and capitalize
  const parts = formatted.split(/[-.]/);
  const capitalized = parts.map((part) => {
    // Handle common brand names
    const brandNames: Record<string, string> = {
      amazon: "Amazon",
      bestbuy: "Best Buy",
      target: "Target",
      walmart: "Walmart",
      etsy: "Etsy",
      ebay: "eBay",
    };

    const lower = part.toLowerCase();
    if (brandNames[lower]) {
      return brandNames[lower];
    }

    // Capitalize first letter
    return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
  });

  return capitalized.join(" ");
}

/**
 * Get favicon URL for a domain
 */
export function getFaviconUrl(domain: string): string {
  // Use Google's favicon service
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=32`;
}

