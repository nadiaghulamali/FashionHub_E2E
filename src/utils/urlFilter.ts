/**
 * Utility class for filtering and checking URL types.
 */
export class UrlFilter {
    /**
     * Checks if a URL uses a valid HTTP/HTTPS scheme and should be checked for status codes.
     * Excludes special links like mailto, tel, javascript, and hash fragments.
     * @param url The URL string to check.
     * @returns True if the URL should be validated via HTTP request.
     */
    static isValidHttpUrl(url: string): boolean {
        // Exclude special schemes (TC2.6)
        if (url.startsWith('mailto:') || url.startsWith('tel:') || url.startsWith('javascript:')) {
            return false;
        }
        // Exclude in-page fragment links
        if (url.includes('#') && url.split('#')[0] === '') {
            return false;
        }

        // Must start with http or https
        return url.startsWith('http://') || url.startsWith('https://');
    }

    /**
     * Checks if the URL points to a static resource (TC2.7).
     * @param url The URL string to check.
     * @returns True if the URL ends with a common static file extension.
     */
    static isStaticResource(url: string): boolean {
        const staticExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.gif', '.pdf', '.webp', '.ico', '.css', '.js'];
        const lowerUrl = url.toLowerCase();
        return staticExtensions.some(ext => lowerUrl.endsWith(ext));
    }
}