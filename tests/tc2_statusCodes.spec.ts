import { test, expect } from '../src/fixtures/baseTest';

function failureReport(broken: any[], testName: string): string {
  const details = broken
    .map(b => `[${b.status}] ${b.url} – ${b.errorDetail}`)
    .join('\n');

  return `
Broken links found during: ${testName}

Count: ${broken.length}

Details:
${details}
`;
}

test.describe('Use Case 2 Status Code Validation for All Links', () => {

  // .1 – Home page must load with 200
  test('1 Homepage returns 200 OK', async ({ page, httpValidator, appUrls }) => {
    const status = await httpValidator.check(page, {
      rawUrl: appUrls.HOME,
      absoluteUrl: appUrls.HOME,
      sourcePage: 'direct',
      text: 'home'
    });

    expect(status.isValid, `Homepage failed → Status: ${status.status}`).toBe(true);
  });

  test('Validate all internal links return 2xx/3xx', async ({
    page,
    linkExtractor,
    httpValidator,
    appUrls
  }) => {

    await page.goto(appUrls.HOME);

    const links = await linkExtractor.extractLinks(page);

    const broken = [];

    for (const link of links) {
      const result = await httpValidator.check(page, link);

      if (!result.isValid) {
        broken.push(result);
      }
    }

    const message = failureReport(broken, 'Internal Link Status Validation');

    expect(broken, message).toHaveLength(0);
  });
});
