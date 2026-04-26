import { test, expect } from '@playwright/test';

test.describe('Career Module', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the career page before each test
    await page.goto('/career');
  });

  test('1. Should load the Career page successfully', async ({ page }) => {
    // Check if the hero section is visible
    const hero = page.locator('.hero--career');
    await expect(hero).toBeVisible();
  });

  test('2. Should display correct title for non-admins', async ({ page }) => {
    const title = page.locator('.hero__title');
    await expect(title).toContainText('Career Development Hub');
  });

  test('3. Should display Internship Opportunities card', async ({ page }) => {
    const cardTitle = page.locator('.post__title', { hasText: 'Internship Opportunities' });
    await expect(cardTitle).toBeVisible();
  });

  test('4. Should display Career Guidance card', async ({ page }) => {
    const cardTitle = page.locator('.post__title', { hasText: 'Career Guidance' });
    await expect(cardTitle).toBeVisible();
  });

  test('5. Should display Resources card', async ({ page }) => {
    const cardTitle = page.locator('.post__title', { hasText: 'Resources' });
    await expect(cardTitle).toBeVisible();
  });

  test('6. Should display Internship Management card', async ({ page }) => {
    const cardTitle = page.locator('.post__title', { hasText: 'Internship Management' });
    await expect(cardTitle).toBeVisible();
  });

  test('7. Should display CV / Resume Builder card', async ({ page }) => {
    const cardTitle = page.locator('.post__title', { hasText: 'CV / Resume Builder' });
    await expect(cardTitle).toBeVisible();
  });

  test('8. Should navigate to Internships page on click', async ({ page }) => {
    // Click the link in the Internship card
    await page.locator('article', { hasText: 'Internship Opportunities' }).locator('a').click();
    await expect(page).toHaveURL(/.*\/career\/internships/);
  });

  test('9. Should navigate to Resources page on click', async ({ page }) => {
    await page.locator('article', { hasText: 'Resources' }).locator('a').click();
    await expect(page).toHaveURL(/.*\/career\/resources/);
  });

  test('10. Should navigate to Resume Builder page on click', async ({ page }) => {
    await page.locator('article', { hasText: 'CV / Resume Builder' }).locator('a').click();
    await expect(page).toHaveURL(/.*\/career\/resume-builder/);
  });
});
