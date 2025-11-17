import { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AppUrls } from '../config/urls';

export async function loginAs(
  page: Page,
  loginPage: LoginPage,
  username: string,
  password: string,
  appUrls: AppUrls
) {
  await page.goto(appUrls.LOGIN);
  await loginPage.login(username, password);
  await page.waitForURL(appUrls.ACCOUNT);
}
