import { logStep } from './logger';

/**
 * Executes an asynchronous function with retries on failure to handle network flakiness.
 * @param fn The asynchronous function to execute.
 * @param maxRetries The maximum number of times to retry (default is 3).
 * @param delayMs The delay between retries in milliseconds (default is 500ms).
 * @returns The result of the successful function execution.
 * @throws The final error if all retry attempts fail.
 */
export async function withRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 500
): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            if (attempt === maxRetries) {
                logStep('FATAL RETRY', `Attempt ${attempt}/${maxRetries} failed. No more retries.`);
                throw error;
            }
            logStep('Retry', `Attempt ${attempt}/${maxRetries} failed. Retrying in ${delayMs}ms. Error: ${error instanceof Error ? error.message : String(error)}`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }
    // Should be unreachable, but required for Promise return type compatibility
    throw new Error('Retry mechanism failed to return a value or throw an error after all attempts.');
}