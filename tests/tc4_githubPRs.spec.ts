import { test, expect } from '@playwright/test';
import { CsvGenerator } from '../src/utils/csvGenerator';

// GitHub Repo
const REPO_OWNER = 'appwrite';
const REPO_NAME = 'appwrite';

const FULL_PULLS_URL =
  `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/pulls?state=open`;

// Invalid repo URL for A4
const INVALID_REPO_URL =
  `https://api.github.com/repos/${REPO_OWNER}/nope/pulls`;

const csvGenerator = new CsvGenerator();

test.describe('TC4 GitHub Open PR Report Generation', () => {

  // ============================ A1 ============================
  test('A1 - API Returns Open PR List and D2 - HTTPS Enforced', async ({ request }) => {

    const response = await request.get(FULL_PULLS_URL, {
      headers: { "User-Agent": "Playwright-Automation" }
    });

    expect(response.status()).toBe(200);

    const json = await response.json();
    expect(Array.isArray(json)).toBe(true);

    if (json.length > 0) {
      const first = json[0];

      expect(first).toHaveProperty('title');
      expect(first).toHaveProperty('created_at');
      expect(first.user).toHaveProperty('login');
      expect(first).toHaveProperty('html_url');
    }
  });

  // ============================ A2 ============================
  test('A2 - Validate CSV Content Matches API Response', async ({ request }) => {

    const response = await request.get(FULL_PULLS_URL, {
      headers: { "User-Agent": "Playwright-Automation" }
    });

    expect(response.status()).toBe(200);

    const apiData = await response.json();
    test.skip(apiData.length === 0, 'Skipping A2 → No open PRs in repo.');

    const csv = csvGenerator.generate(apiData);
    const rows = csv.trim().split('\n');

    expect(rows.length).toBe(apiData.length + 2); // header + summary

    const first = apiData[0];
    const row = rows[1];

    const d = new Date(first.created_at);
    const formattedDate =
      `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;

    expect(row).toContain(first.title);
    expect(row).toContain(first.user.login);
    expect(row).toContain(formattedDate);
    expect(row).toContain(first.html_url);
  });

  // ============================ A3 ============================
  test('A3 - Placeholder Handling', async () => {

    const mock = [
      { title: 'Valid', created_at: '2023-10-26T10:00:00Z', user: { login: 'u1' }, html_url: 'https://v.url' },
      { title: '', created_at: '2023-10-27T10:00:00Z', user: { login: 'u2' }, html_url: 'https://v.url' },
      { title: 'X', created_at: null, user: { login: 'u3' }, html_url: 'https://v.url' },
      { title: 'Y', created_at: '2023-10-28T10:00:00Z' },
      { title: 'Z', created_at: '2023-10-29T10:00:00Z', user: { login: 'u5' }, html_url: null }
    ];

    const out = csvGenerator.generate(mock);
    const rows = out.trim().split('\n');

    expect(rows[2]).toContain('"Unknown Title"');
    expect(rows[3]).toContain('Unknown Date');
    expect(rows[4]).toContain('Unknown Author');
    expect(rows[5]).toContain('Unknown URL');
  });

  // ============================ A4 ============================
  test('A4 - Invalid Repo (404 Not Found)', async ({ request }) => {

    const response = await request.get(INVALID_REPO_URL, {
      headers: { "User-Agent": "Playwright-Automation" }
    });

    expect(response.status()).toBe(404);

    const json = await response.json();
    expect(json.message).toBe('Not Found');
  });

  // ============================ A5 ============================
  test('A5 - Malformed API Response Graceful Handling', async () => {

    const mocked = [
      { created_at: '2023-10-26T10:00:00Z', user: { login: 't1' }, html_url: 'u1' },
      { title: 'Missing Author', created_at: '2023-10-27T10:00:00Z', user: {}, html_url: 'u2' },
      { title: 'Missing Date', user: { login: 't3' }, html_url: 'u3' },
      { title: 'Missing URL', created_at: '2023-10-29T10:00:00Z', user: { login: 't4' } }
    ];

    const csv = csvGenerator.generate(mocked);
    const rows = csv.trim().split('\n');

    expect(rows.length).toBe(6);
    expect(rows[1]).toContain('"Unknown Title"');
    expect(rows[2]).toContain('Unknown Author');
    expect(rows[3]).toContain('Unknown Date');
    expect(rows[4]).toContain('Unknown URL');
  });

  // ============================ A6 ============================
  test('A6 - Zero PRs', async () => {

    const out = csvGenerator.generate([]);
    const rows = out.trim().split('\n');

    expect(rows.length).toBe(2);
    expect(rows[1]).toBe('Total Open PRs: 0');
  });

  // ============================ A7 ============================
  test('A7 - CSV Escaping for commas', async () => {

    const mock = [{
      title: 'Fix, bug, now resolved',
      created_at: '2023-10-26T10:00:00Z',
      user: { login: 'dev' },
      html_url: 'https://example.com/pr/123'
    }];

    const out = csvGenerator.generate(mock);
    const rows = out.trim().split('\n');

    expect(rows[1]).toContain('"Fix, bug, now resolved"');
  });

  // ============================ A8 ============================
  test('A8 - Unicode Emojis', async () => {

    const mock = [{
      title: '✨ Dark Mode 🌙',
      created_at: '2023-10-26T10:00:00Z',
      user: { login: 'emoji' },
      html_url: 'https://example.com/pr/456'
    }];

    const out = csvGenerator.generate(mock);
    const rows = out.trim().split('\n');

    expect(rows[1]).toContain('✨ Dark Mode 🌙');
  });

});
