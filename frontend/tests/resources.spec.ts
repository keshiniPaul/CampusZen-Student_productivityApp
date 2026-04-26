import { test, expect } from '@playwright/test';

test.describe('Career Resources Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/career/resources');
  });

  test('11. Should load Career Resources page successfully', async ({ page }) => {
    const heroTitle = page.locator('.hero__title');
    await expect(heroTitle).toContainText('Career Resources');
  });

  test('12. Should display the search input field', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Search resources by title/i);
    await expect(searchInput).toBeVisible();
  });

  test('13. Should display Type filter dropdown', async ({ page }) => {
    const typeSelect = page.locator('select.res-select').first();
    await expect(typeSelect).toBeVisible();
  });

  test('14. Should display Category filter dropdown', async ({ page }) => {
    const categorySelect = page.locator('select.res-select').nth(1);
    await expect(categorySelect).toBeVisible();
  });

  test('15. Should allow typing in the search box', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Search resources by title/i);
    await searchInput.fill('React');
    await expect(searchInput).toHaveValue('React');
  });

  test('16. Should allow selecting a type filter', async ({ page }) => {
    const typeSelect = page.locator('select.res-select').first();
    await typeSelect.selectOption('Article');
    await expect(typeSelect).toHaveValue('Article');
  });

  test('17. Should allow selecting a category filter', async ({ page }) => {
    const categorySelect = page.locator('select.res-select').nth(1);
    await categorySelect.selectOption('Frontend');
    await expect(categorySelect).toHaveValue('Frontend');
  });

  test('18. Should show empty state message for non-matching search', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Search resources by title/i);
    // Fill with a string unlikely to match any real resource
    await searchInput.fill('XYZ123NonExistentResource456');
    // Wait for debounce and fetch
    await page.waitForTimeout(1000); 
    const emptyState = page.locator('.res-empty');
    await expect(emptyState).toContainText(/No resources found/i);
  });

  test('19. Should display resource grid (or empty state)', async ({ page }) => {
    // If there are resources, .res-grid is visible. If not, .res-empty is visible.
    const grid = page.locator('.res-grid');
    const empty = page.locator('.res-empty');
    
    // We expect at least one of them to be visible
    const isGridVisible = await grid.isVisible();
    const isEmptyVisible = await empty.isVisible();
    
    expect(isGridVisible || isEmptyVisible).toBeTruthy();
  });

  test('20. Should open Login toast when saving a resource without login', async ({ page }) => {
    // Assuming there is at least one resource, we click the save button
    const saveBtn = page.locator('.res-save-btn').first();
    if (await saveBtn.isVisible()) {
      await saveBtn.click();
      const toast = page.locator('.toast');
      await expect(toast).toContainText(/Please login/i);
    } else {
      // Skip if no resources available to test
      test.skip();
    }
  });
});
