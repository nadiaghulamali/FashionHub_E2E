import { test, expect } from '../src/fixtures/baseTest';
import { Config } from '../src/config/envLoader';
import { LoginPage } from '../src/pages/LoginPage';

const ERROR_MESSAGE_LOCATOR = '#errorMessage';
const ACCOUNT_WELCOME_TEXT = 'Welcome, testUser!';
const ACCOUNT_URL_PATH = '/account.html';

test.describe('UC1 Login Functionality', () => {

 
    // C1 – Successful Login
  
    test('C1: Login succeeds with valid credentials', async ({ page, appUrls }) => {
        const loginPage = new LoginPage(page);

        await page.goto(appUrls.LOGIN);
        await loginPage.login(Config.username!, Config.password!);

        // Redirects to Account Page
        await page.waitForURL(appUrls.ACCOUNT);
        await expect(page).toHaveURL(appUrls.ACCOUNT);

        // Validate account content
        await expect(page.locator(`text=${ACCOUNT_WELCOME_TEXT}`)).toBeVisible();
    });

    // C2 – Empty username

    test('C2: Cannot login with empty username', async ({ page, appUrls }) => {
        const loginPage = new LoginPage(page);

        await page.goto(appUrls.LOGIN);
        await loginPage.login('', Config.password!); // empty username

        // HTML5 required → no redirect
        await expect(page).toHaveURL(appUrls.LOGIN);
    });

    // C3 – Empty password
 
    test('C3: Cannot login with empty password', async ({ page, appUrls }) => {
        const loginPage = new LoginPage(page);

        await page.goto(appUrls.LOGIN);
        await loginPage.login(Config.username!, ''); // empty password

        await expect(page).toHaveURL(appUrls.LOGIN);
    });

    // C4 – Both fields empty

    test('C4: Cannot login with both fields empty', async ({ page, appUrls }) => {
        const loginPage = new LoginPage(page);

        await page.goto(appUrls.LOGIN);
        await loginPage.login('', '');

        await expect(page).toHaveURL(appUrls.LOGIN);
    });

    // C5 – Invalid username

    test('C5: Invalid username shows error', async ({ page, appUrls }) => {
        const loginPage = new LoginPage(page);

        await page.goto(appUrls.LOGIN);
        await loginPage.login('wronguser', Config.password!);

        // Should remain on login page
        await expect(page).toHaveURL(appUrls.LOGIN);

        // Error message is shown in static HTML
        await expect(page.locator(ERROR_MESSAGE_LOCATOR)).toBeVisible();
        await expect(page.locator(ERROR_MESSAGE_LOCATOR)).toContainText('Invalid username or password');
    });

    // C6 – Invalid password

    test('C6: Invalid password shows error', async ({ page, appUrls }) => {
        const loginPage = new LoginPage(page);

        await page.goto(appUrls.LOGIN);
        await loginPage.login(Config.username!, 'wrongpass');

        await expect(page).toHaveURL(appUrls.LOGIN);
        await expect(page.locator(ERROR_MESSAGE_LOCATOR)).toBeVisible();
        await expect(page.locator(ERROR_MESSAGE_LOCATOR)).toContainText('Invalid username or password');
    });

    // C7 – Both invalid

    test('C7: Both username & password invalid show error', async ({ page, appUrls }) => {
        const loginPage = new LoginPage(page);

        await page.goto(appUrls.LOGIN);
        await loginPage.login('wronguser', 'wrongpass');

        await expect(page).toHaveURL(appUrls.LOGIN);
        await expect(page.locator(ERROR_MESSAGE_LOCATOR)).toBeVisible();
        await expect(page.locator(ERROR_MESSAGE_LOCATOR)).toContainText('Invalid username or password');
    });
});