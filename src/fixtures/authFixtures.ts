import { test } from './baseTest';  
import { LoginPage } from '../pages/LoginPage';
import { loginAs } from '../helpers/loginHelper';
import { Config } from '../config/envLoader';
import type { Page } from '@playwright/test';

export const authTest = test.extend<{
  authPage: Page;
}>({
  authPage: async ({ page, appUrls }, use) => {
    const loginPage = new LoginPage(page);

    await loginAs(
      page,
      loginPage,
      Config.username!,
      Config.password!,
      appUrls
    );

    await use(page);
  },
});

export { expect } from '@playwright/test';
