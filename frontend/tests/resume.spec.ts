import { test, expect } from '@playwright/test';

test.describe('Resume Builder Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/career/resume-builder');
  });

  test('21. Should load the Resume Builder dashboard', async ({ page }) => {
    // The page header should say Resume Builder
    const header = page.locator('.resume-brand');
    await expect(header).toContainText('Resume Builder');
  });

  test('22. Should display "My Resumes" section initially', async ({ page }) => {
    const dashboardHeader = page.locator('.resume-dashboard-header h2');
    await expect(dashboardHeader).toContainText('My Resumes');
  });

  test('23. Should display "+ Create New" button in dashboard or header', async ({ page }) => {
    const createBtn = page.locator('button', { hasText: '+ Create New' }).first();
    await expect(createBtn).toBeVisible();
  });

  test('24. Should open the editor when creating a new resume', async ({ page }) => {
    const createBtn = page.locator('button', { hasText: '+ Create New' }).first();
    await createBtn.click();
    
    // Editor should be visible now
    const editor = page.locator('.resume-editor');
    await expect(editor).toBeVisible();
  });

  test('25. Should have "Personal" tab active by default in the editor', async ({ page }) => {
    await page.locator('button', { hasText: '+ Create New' }).first().click();
    const activeTab = page.locator('.resume-tab.active');
    await expect(activeTab).toContainText('Personal');
  });

  test('26. Should allow typing in the Full Name input', async ({ page }) => {
    await page.locator('button', { hasText: '+ Create New' }).first().click();
    
    // Fill the full name input
    const nameInput = page.getByPlaceholder('Full Name');
    await nameInput.fill('John Doe QA');
    await expect(nameInput).toHaveValue('John Doe QA');
  });

  test('27. Should reflect Full Name in the live preview instantly', async ({ page }) => {
    await page.locator('button', { hasText: '+ Create New' }).first().click();
    
    const nameInput = page.getByPlaceholder('Full Name');
    await nameInput.fill('Test User Resume');
    
    const previewName = page.locator('.cv-name');
    await expect(previewName).toContainText('Test User Resume');
  });

  test('28. Should switch to "Objective" tab and allow input', async ({ page }) => {
    await page.locator('button', { hasText: '+ Create New' }).first().click();
    
    const objectiveTab = page.locator('button', { hasText: 'Objective' });
    await objectiveTab.click();
    
    const objectiveTextArea = page.getByPlaceholder(/Write a brief professional summary/i);
    await objectiveTextArea.fill('A passionate tester.');
    await expect(objectiveTextArea).toHaveValue('A passionate tester.');
  });

  test('29. Should allow adding a new Education field', async ({ page }) => {
    await page.locator('button', { hasText: '+ Create New' }).first().click();
    
    const eduTab = page.locator('button', { hasText: 'Education' });
    await eduTab.click();
    
    const addEduBtn = page.locator('button', { hasText: '+ Add Education' });
    // First, there's 1 by default, let's add another
    await addEduBtn.click();
    
    // Count the number of remove buttons
    const removeBtns = page.locator('.resume-btn-delete', { hasText: 'Remove' });
    expect(await removeBtns.count()).toBe(2);
  });

  test('30. Should allow removing an Education field', async ({ page }) => {
    await page.locator('button', { hasText: '+ Create New' }).first().click();
    
    const eduTab = page.locator('button', { hasText: 'Education' });
    await eduTab.click();
    
    const addEduBtn = page.locator('button', { hasText: '+ Add Education' });
    await addEduBtn.click(); // Now there are 2
    
    const removeBtns = page.locator('.resume-btn-delete', { hasText: 'Remove' });
    await removeBtns.first().click(); // Remove 1
    
    expect(await removeBtns.count()).toBe(1);
  });
});
