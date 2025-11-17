import { Page } from '@playwright/test';
import { LinkDetails } from '../types/linkTypes';
import { UrlFilter } from './urlFilter';

export class LinkExtractor {

  private baseUrl: string;
  private basePathname: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
    this.basePathname = new URL(this.baseUrl).pathname;
  }

  public normalize(rawUrl: string): string {
    try {
      const resolved = new URL(rawUrl, this.baseUrl).href;
      const u = new URL(resolved);

      u.hash = '';
      u.search = '';

      let finalUrl = u.href;

      if (finalUrl.endsWith('/') && finalUrl !== this.baseUrl) {
        finalUrl = finalUrl.slice(0, -1);
      }

      return finalUrl;
    } catch {
      return rawUrl;
    }
  }

  public async extractLinks(page: Page): Promise<LinkDetails[]> {
    const rawLinks: LinkDetails[] = await page.evaluate((sourceUrl) => {
      const links: LinkDetails[] = [];
      document.querySelectorAll('a[href]').forEach(a => {
        const href = a.getAttribute('href') || '';
        const abs = (a as HTMLAnchorElement).href;
        links.push({
          rawUrl: href,
          absoluteUrl: abs,
          sourcePage: sourceUrl,
          text: a.textContent?.trim() || ''
        });
      });
      return links;
    }, page.url());

    const unique = new Map<string, LinkDetails>();

    for (const link of rawLinks) {
      if (!UrlFilter.isValidHttpUrl(link.absoluteUrl)) {
        continue;
      }

      const normalized = this.normalize(link.absoluteUrl);
      const linkPathname = new URL(normalized).pathname;

      // internal link check (must belong to the app root path)
      if (!linkPathname.startsWith(this.basePathname)) {
        continue;
      }

      if (!unique.has(normalized)) {
        unique.set(normalized, { ...link, absoluteUrl: normalized });
      }
    }

    return Array.from(unique.values());
  }
}
