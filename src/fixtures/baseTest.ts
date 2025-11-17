import { test as base, expect } from '@playwright/test';
import { LinkExtractor } from '../utils/linkExtractor';
import { HttpValidator } from '../utils/httpValidator';
import { resolveBaseUrl } from '../../src/config/resolveEnvironment';
import { AppUrls } from '../config/urls';

// Worker fixtures
type CustomWorkerFixtures = {
  baseUrl: string;
};

// Test fixtures
type CustomTestFixtures = {
  linkExtractor: LinkExtractor;
  httpValidator: HttpValidator;
  appUrls: AppUrls;   // <-- MUST BE HERE
};

export const test = base
  // ---------------- Worker Fixtures ----------------
  .extend<CustomWorkerFixtures>({
    baseUrl: async ({}, use) => {
      const resolved = await resolveBaseUrl();
      await use(resolved);
    },
  })

  // ---------------- Test Fixtures ----------------
  .extend<CustomTestFixtures>({   // <-- MUST INCLUDE GENERICS HERE
    linkExtractor: async ({ baseUrl }, use) => {
      await use(new LinkExtractor(baseUrl));
    },

    httpValidator: async ({}, use) => {
      await use(new HttpValidator());
    },

    appUrls: async ({ baseUrl }, use) => {
      await use(new AppUrls(baseUrl)); 
    },
  });

export { expect };
