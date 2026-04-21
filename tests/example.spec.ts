import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
});

test('01 - Event dashboard renders core categories', async ({ page }) => {
  await page.goto('/events');

  await expect(page.getByRole('heading', { name: 'Event Dashboard' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Event' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Sports' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Club & Society' })).toBeVisible();
});

test('02 - Event card navigates to events list', async ({ page }) => {
  await page.goto('/events');

  const eventCard = page.locator('article', {
    has: page.getByRole('heading', { name: 'Event' }),
  });
  await eventCard.getByRole('link', { name: 'View Details' }).click();

  await expect(page).toHaveURL(/\/events\/list$/);
  await expect(page.getByRole('heading', { name: 'Upcoming Events' })).toBeVisible();
});

test('03 - Sports card navigates to sports page', async ({ page }) => {
  await page.goto('/events');

  const sportsCard = page.locator('article', {
    has: page.getByRole('heading', { name: 'Sports' }),
  });
  await sportsCard.getByRole('link', { name: 'View Details' }).click();

  await expect(page).toHaveURL(/\/sports$/);
  await expect(page.getByRole('heading', { name: 'University Sports Programs' })).toBeVisible();
});

test('04 - Clubs card navigates to clubs page', async ({ page }) => {
  await page.goto('/events');

  const clubsCard = page.locator('article', {
    has: page.getByRole('heading', { name: 'Club & Society' }),
  });
  await clubsCard.getByRole('link', { name: 'View Details' }).click();

  await expect(page).toHaveURL(/\/clubs$/);
  await expect(page.getByRole('heading', { name: 'Clubs & Societies' })).toBeVisible();
});

test('05 - ECA modal opens and cancels', async ({ page }) => {
  await page.goto('/events');

  await page.getByRole('button', { name: '+ Log Activity' }).click();
  await expect(page.getByRole('heading', { name: 'Log New Activity' })).toBeVisible();

  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByRole('heading', { name: 'Log New Activity' })).toBeHidden();
});

test('06 - ECA logging saves activity and updates counters', async ({ page }) => {
  await page.goto('/events');

  await page.getByRole('button', { name: '+ Log Activity' }).click();
  await page.getByPlaceholder('e.g. Chess Club, Hackathon...').fill('Inter Faculty Cricket');
  await page.locator('select').selectOption('sport');
  await page.getByPlaceholder('e.g. Participant, Player, President').fill('Team Player');
  await page.getByRole('button', { name: 'Save Activity' }).click();

  await expect(page.getByText('Inter Faculty Cricket')).toBeVisible();
  await expect(
    page
      .locator('.ecaMetric', { hasText: 'Total Activities' })
      .locator('.ecaMetric__value')
  ).toHaveText('1');
  await expect(
    page
      .locator('.ecaMetric', { hasText: 'Sports Teams' })
      .locator('.ecaMetric__value')
  ).toHaveText('1');
});

test('07 - Events list page displays default event cards', async ({ page }) => {
  await page.goto('/events/list');

  await expect(page.getByRole('heading', { name: 'Upcoming Events' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'View Details' }).first()).toBeVisible();
  await expect(page.getByText('Viramaya Music Festival')).toBeVisible();
});

test('08 - Events search filters results and can be reset', async ({ page }) => {
  await page.goto('/events/list');

  await page.getByRole('searchbox', { name: 'Search events' }).fill('zzzz-no-event');
  await expect(page.getByText('No events matched your search')).toBeVisible();

  await page.getByRole('button', { name: 'Clear search' }).click();
  await expect(page.getByText('No events matched your search')).toBeHidden();
  await expect(page.getByText('Viramaya Music Festival')).toBeVisible();
});

test('09 - Event details page opens from event card', async ({ page }) => {
  await page.goto('/events/list');

  await page.getByRole('link', { name: 'View Details' }).first().click();

  await expect(page).toHaveURL(/\/activity\//);
  await expect(page.getByRole('heading', { name: 'About This Activity' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Event Information' })).toBeVisible();
});

test('10 - Sports activity details route shows capacity info', async ({ page }) => {
  await page.goto('/activity/sports');

  await expect(page.getByRole('heading', { name: 'Cricket Tournament Registration' })).toBeVisible();
  await expect(page.getByText('180 / 200 attendees')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'About This Activity' })).toBeVisible();
});

test('11 - Club and society activity details route renders content', async ({ page }) => {
  await page.goto('/activity/club-&-society');

  await expect(page.getByRole('heading', { name: 'IEEE Student Chapter Meetup' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'About This Activity' })).toBeVisible();
});

test('12 - Sports search filters and resets successfully', async ({ page }) => {
  await page.goto('/sports');

  await page.getByRole('searchbox', { name: 'Search sports' }).fill('zzzz-no-sport');
  await expect(page.getByText('No sports matched your search')).toBeVisible();

  await page.getByRole('button', { name: 'Clear search' }).click();
  await expect(page.getByText('No sports matched your search')).toBeHidden();
  await expect(page.getByText('Cricket Team Selection')).toBeVisible();
});

test('13 - Sports details modal opens and closes', async ({ page }) => {
  await page.goto('/sports');

  await page.getByRole('button', { name: 'View Details' }).first().click();
  await expect(page.locator('.modal__content--large')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Description' })).toBeVisible();

  await page.getByLabel('Close modal').click();
  await expect(page.locator('.modal__content--large')).toBeHidden();
});

test('14 - Clubs search filters and resets successfully', async ({ page }) => {
  await page.goto('/clubs');

  await page.getByRole('searchbox', { name: 'Search clubs and societies' }).fill('zzzz-no-club');
  await expect(page.getByText('No clubs matched your search')).toBeVisible();

  await page.getByRole('button', { name: 'Clear search' }).click();
  await expect(page.getByText('No clubs matched your search')).toBeHidden();
  await expect(page.getByText('IEEE Student Branch')).toBeVisible();
});

test('15 - Clubs details modal opens and closes', async ({ page }) => {
  await page.goto('/clubs');

  await page.getByRole('button', { name: 'View Details' }).first().click();
  await expect(page.locator('.modal__content--large')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Connect With Us' })).toBeVisible();

  await page.getByLabel('Close modal').click();
  await expect(page.locator('.modal__content--large')).toBeHidden();
});
