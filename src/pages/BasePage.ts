import { Page } from '@playwright/test';
import { logStep } from '../utils/logger';

/**
 * BasePage is the foundation for all Page Object Models (POMs).
 * It provides common, reusable methods that wrap Playwright's Page actions
 * to improve test readability and maintainability.
 */
export default class BasePage {
  protected page: Page;
  
  /**
   * Initializes the BasePage with a Playwright Page instance.
   * @param page The Playwright Page object.
   */
  constructor(page: Page) {
    this.page = page;
  }
  
  /**
   * Navigates the page to a specified path relative to the baseURL.
   * @param path The path to navigate to (e.g., '/login.html').
   */
  async navigate(path: string) {
    logStep('Navigation', `Navigating to: ${path}`);
    await this.page.goto(path);
  }
  
  /**
   * Clicks an element identified by a selector.
   * @param selector The CSS selector or Playwright locator string.
   */
  async click(selector: string) {
    logStep('Action', `Clicking element: ${selector}`);
    await this.page.click(selector);
  }
  
  /**
   * Fills an input field identified by a selector with a value.
   * @param selector The CSS selector or Playwright locator string.
   * @param value The text value to input.
   */
  async fill(selector: string, value: string) {
    logStep('Action', `Filling input ${selector} with value (redacted)`);
    await this.page.fill(selector, value);
  }
  
  /**
   * Retrieves the text content of an element.
   * @param selector The CSS selector or Playwright locator string.
   * @returns The text content.
   */
  async text(selector: string) {
    return this.page.textContent(selector);
  }
}