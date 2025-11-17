export interface LinkDetails {
    // URL found in the source code (may be relative or absolute)
    rawUrl: string;
    // Normalized, absolute URL used for testing
    absoluteUrl: string;
    // The page URL where this link was found
    sourcePage: string;
    // The anchor text (if available)
    text?: string;
}

export interface LinkStatus {
    // The absolute URL that was checked
    url: string;
    // The HTTP status code (e.g., 200, 301, 404)
    status: number;
    // True if the status is 2xx or 3xx (Success or Redirect)
    isValid: boolean;
    // Detailed error message if status is 4xx or 5xx
    errorDetail?: string;
}