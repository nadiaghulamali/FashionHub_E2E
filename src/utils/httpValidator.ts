import { Page } from '@playwright/test';
import { withRetry } from './retry';
import { LinkStatus, LinkDetails } from '../types/linkTypes';

export class HttpValidator {

  public async check(page: Page, link: LinkDetails): Promise<LinkStatus> {

    const checkStatus = async (): Promise<LinkStatus> => {
      const url = link.absoluteUrl;

      // Use Playwright APIRequestContext for robust status checks
      const response = await page.request.get(url);
      const status = response.status();

      const isSuccess = status >= 200 && status < 400;

      if (isSuccess) {
        return { url, status, isValid: true };
      }

      throw new Error(`Returned status code ${status}`);
    };

    try {
      return await withRetry(checkStatus);
    } catch (error) {
      const message = (error as Error).message;
      const match = message.match(/status code (\d+)/);
      const finalStatus = match ? parseInt(match[1], 10) : 599;

      return {
        url: link.absoluteUrl,
        status: finalStatus,
        isValid: false,
        errorDetail: message
      };
    }
  }
}
