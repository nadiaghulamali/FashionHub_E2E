import { Page, ConsoleMessage, Request } from '@playwright/test';
import { logStep } from '../src/utils/logger';
import { test, expect } from '../src/fixtures/baseTest'; 

function setupErrorListeners(page: Page, errors: string[]) {
    page.on('console', (msg: ConsoleMessage) => {
        if (msg.type() === 'error') {
            errors.push(`[CONSOLE ERROR on ${page.url()}]: ${msg.text()}`);
        }
    });

    page.on('pageerror', (err: Error) => {
        errors.push(`[PAGE ERROR on ${page.url()}]: ${err.message}`);
    });

    page.on('requestfailed', (req: Request) => {
        const failure = req.failure();
        // Ignore requests that are deliberately aborted (e.g., when navigation is too fast)
        if (failure && failure.errorText !== 'net::ERR_ABORTED') {
            errors.push(`[REQUEST FAILED on ${page.url()}]: ${req.url()} (${failure.errorText})`);
        }
    });
}

function createFailureMessage(errors: string[], testName: string): string {
    return errors.length > 0
        ? `\n\nFAILURE REASON: ${errors.length} UNEXPECTED console error(s) found during ${testName}.\n` +
          `\n--- DETAILED UNEXPECTED ERRORS ---\n${errors.join('\n')}\n----------------------------------\n`
        : 'No unexpected console errors were found.';
}

test.describe("Use Case 1 Console Error Validation (Strict) @usecase1", () => {

    // UC1-1 – Homepage Console Check
    test("UC1-1: No console errors on homepage @smoke", async ({ page, appUrls }) => {
        const errors: string[] = [];
        setupErrorListeners(page, errors);

        logStep('Action', `Navigating to Home: ${appUrls.HOME}`);
        await page.goto(appUrls.HOME, { waitUntil: 'domcontentloaded' });

        await page.waitForTimeout(500);

        const failureMessage = createFailureMessage(errors, 'homepage check');
        logStep('Assertion', failureMessage);

        expect(errors, failureMessage).toHaveLength(0);
    });

    // UC1-2 – Internal Pages Check
    test("UC1-2: No console errors on primary internal pages @smoke", async ({ page, appUrls }) => {
        const errors: string[] = [];
        setupErrorListeners(page, errors);

        const internalPages = [
            { name: 'Home', url: appUrls.HOME },
            { name: 'About', url: appUrls.ABOUT },
            { name: 'Account', url: appUrls.ACCOUNT },
            { name: 'Clothing (Products)', url: appUrls.PRODUCTS },
            { name: 'Shopping Bag (Cart)', url: appUrls.CART },
        ];

        for (const { name, url } of internalPages) {
            logStep('Action', `Navigating to ${name}: ${url}`);
            await page.goto(url, { waitUntil: 'load' });
            await page.waitForTimeout(500);
        }

        const failureMessage = createFailureMessage(errors, 'internal page crawling');
        logStep('Assertion', failureMessage);

        expect(errors, failureMessage).toHaveLength(0);
    });

    // UC1-3 – Interaction Check
    test("UC1-3: No console errors during interactions @interaction", async ({ page, appUrls }) => {
        const errors: string[] = [];
        setupErrorListeners(page, errors);

        logStep('Action', `Navigating to Home for interaction test: ${appUrls.HOME}`);
        await page.goto(appUrls.HOME, { waitUntil: 'domcontentloaded' });

        // Scroll down to potentially load lazy-loaded elements/resources
        await page.mouse.wheel(0, 5000);

        const items = page.locator("a, button, .btn");
        const count = await items.count();
        logStep('Interaction', `Processing up to 5 interactive elements out of ${count}.`);

        for (let i = 0; i < Math.min(count, 5); i++) {
            const item = items.nth(i);
            // Use trial click to simulate the click event without navigating away
            await item.hover({ timeout: 500 });
            await item.click({ trial: true, timeout: 500 });
        }

        const failureMessage = createFailureMessage(errors, 'interaction check');
        logStep('Assertion', failureMessage);

        expect(errors, failureMessage).toHaveLength(0);
    });
});