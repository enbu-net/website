import { readdirSync } from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const pages = readdirSync('dist', { recursive: true })
  .filter((file) => /^(en|ja)\/.*index\.html$/.test(file))
  .map((file) => '/' + file.slice(0, -'index.html'.length))
  .sort();

test.beforeEach(async ({ page }) => {
  await page.route('https://api.github.com/**', (route) => route.abort());
});

async function checkAccessibility(page) {
  const { violations } = await new AxeBuilder({ page }).withTags(wcagTags).analyze();
  const findings = violations.map(({ id, nodes }) => ({
    id,
    nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })),
  }));
  expect(findings).toEqual([]);
}

async function checkPageWidth(page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
}

for (const path of pages) {
  test(`${path} accessibility and reflow`, async ({ page }, testInfo) => {
    await page.goto(path);
    // Expressive Code measures overflow after layout before assigning tabindex.
    await expect.poll(() => page.locator('.expressive-code pre').evaluateAll((blocks) =>
      blocks.filter((block) => block.scrollWidth > block.clientWidth && block.tabIndex < 0).length,
    )).toBe(0);
    await checkAccessibility(page);
    await checkPageWidth(page);
    if (testInfo.project.name === 'reflow') {
      await page.addStyleTag({ content: `
        * { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }
        p { margin-block-end: 2em !important; }
      ` });
      await checkPageWidth(page);
    }
  });
}

for (const path of ['/en/', '/ja/']) {
  test(`${path} landing supports keyboard navigation`, async ({ page }) => {
    await page.goto(path);
    await page.keyboard.press('Tab');
    await expect(page.locator('.skip-link')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('main')).toBeFocused();

    const toggle = page.locator('button[aria-controls="download-menu"]');
    const menu = page.locator('#download-menu');
    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Tab');
    await expect(menu.getByRole('link').first()).toBeFocused();
    await checkAccessibility(page);
    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toBeFocused();
  });
}

test('Japanese guides are reachable from the landing page', async ({ page }) => {
  await page.goto('/ja/');
  const hero = page.locator('.hero');
  await hero.getByRole('link', { name: 'ドキュメント' }).click();
  await expect(page).toHaveURL(/\/ja\/docs\/$/);
  await expect(page.locator('link[rel~="icon"]')).toHaveAttribute('href', '/favicon.png');
  const favicon = await page.request.get('/favicon.png');
  expect(favicon.ok()).toBe(true);
  expect(favicon.headers()['content-type']).toContain('image/png');
  await expect(page.locator('#starlight__sidebar details')).toHaveCount(0);
  await expect(page.locator('#starlight__sidebar a[href="/ja/about/"]')).toHaveCount(1);
  await page.getByRole('main').getByRole('link', { name: 'enbu とは', exact: true }).click();
  await expect(page).toHaveURL(/\/ja\/about\/$/);
});

test('English pages use the /en paths', async ({ page }) => {
  await page.goto('/?source=test#download');
  await expect(page).toHaveURL(/\/en\/\?source=test#download$/);
  await page.locator('.hero').getByRole('link', { name: 'Docs' }).click();
  await expect(page).toHaveURL(/\/en\/docs\/$/);
  await page.goto('/docs/');
  await expect(page).toHaveURL(/\/en\/docs\/$/);
});

test('documentation search and table of contents work with the keyboard', async ({ page }, testInfo) => {
  await page.goto('/ja/docs/');
  const search = page.getByRole('button', { name: '検索', exact: true });
  await search.press('Enter');
  const dialog = page.getByRole('dialog', { name: '検索' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('textbox')).toBeFocused();
  await checkAccessibility(page);
  await page.keyboard.press('Escape');
  await expect(search).toBeFocused();

  const narrow = testInfo.project.name === 'reflow';
  const toc = page.locator(narrow ? '#starlight__mobile-toc' : 'starlight-toc');
  if (narrow) await toc.locator('summary').press('Enter');
  await toc.getByRole('link', { name: 'FAQ', exact: true }).press('Enter');
  await expect(page).toHaveURL(/#faq$/);
});
