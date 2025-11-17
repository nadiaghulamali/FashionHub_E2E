import { Page } from '@playwright/test';
import BasePage from './BasePage';
import { logStep } from '../utils/logger';
import { LOGIN_LOCATORS as LOCATORS } from '../data/loginData';

/**
 * LoginPage extends BasePage and contains all methods and locators
 * specific to the login functionality.
 */

export class LoginPage extends BasePage {
    
    constructor(page: Page) {
        super(page); // Initialize BasePage with the Playwright Page object
    }
    
    /**
     * Submits the login form with the provided credentials.
     * @param username The username to use.
     * @param password The password to use.
     */
    async login(username: string, password: string) {
        await this.fill(LOCATORS.USERNAME_INPUT, username);
        await this.fill(LOCATORS.PASSWORD_INPUT, password);
        await this.click(LOCATORS.LOGIN_BUTTON);
    }

    /**
     * Saves the current page context's authentication state to a file.
     * @param filePath The destination path for the storage state file.
     */
    async saveState(filePath: string) {
        await this.page.context().storageState({ path: filePath });
    }
}