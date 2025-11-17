import { test } from '@playwright/test';

/**
 * Logs a custom step or information into the current Playwright test report (annotations).
 * This makes the logs visible in the HTML report, Allure report, and the command line output.
 * * @param type The category of the log (e.g., 'Action', 'Assertion', 'Setup').
 * @param description The detailed message of the step.
 */
export function logStep(type: string, description: string) {
    // We must use test.info() to access the current running test context for annotations.
    test.info().annotations.push({
        type: type,
        description: description,
    });
}