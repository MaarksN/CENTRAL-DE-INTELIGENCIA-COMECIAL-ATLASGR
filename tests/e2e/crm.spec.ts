import { test, expect } from '@playwright/test';

test.describe('CRM Operations - End-to-End', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crm');
  });

  test('should render the CRM dashboard', async ({ page }) => {
    await expect(page).toHaveTitle(/Atlas | PROSPECTOR-ATLAS/);
    await expect(page.locator('h1', { hasText: 'CRM' }).first()).toBeVisible();
  });
});
