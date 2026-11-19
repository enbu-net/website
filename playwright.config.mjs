import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://127.0.0.1:4367', locale: 'en-US' },
  webServer: {
    command: 'astro preview --ignore-lock --host 127.0.0.1 --port 4367',
    url: 'http://127.0.0.1:4367',
  },
  projects: [
    { name: 'desktop-light', use: { viewport: { width: 1280, height: 900 }, colorScheme: 'light' } },
    { name: 'desktop-dark', use: { viewport: { width: 1280, height: 900 }, colorScheme: 'dark' } },
    { name: 'reflow', use: { viewport: { width: 320, height: 800 }, colorScheme: 'light' } },
  ],
});
