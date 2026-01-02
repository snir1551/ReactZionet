import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to products page', async ({ page }) => {
    // Verify we're on products page by checking for products link
    await expect(page.locator('nav a').filter({ hasText: /Products|מוצרים/ })).toBeVisible();
    
    // Verify DataTable is present
    await expect(page.locator('.p-datatable')).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to about page', async ({ page }) => {
    // Click on About link
    await page.click('text=/About|אודות/');
    
    // Verify we're on about page
    await expect(page.locator('h1')).toContainText(/About|אודות/);
    await expect(page.locator('.about-container')).toBeVisible();
  });

  test('should toggle language between English and Hebrew', async ({ page }) => {
    // Get initial language (should be English or Hebrew)
    const initialText = await page.locator('nav a').first().textContent();
    
    // Click language toggle button
    await page.click('button[title*="Switch"]');
    
    // Wait for language change
    await page.waitForTimeout(500);
    
    // Verify language changed
    const newText = await page.locator('nav a').first().textContent();
    expect(initialText).not.toBe(newText);
  });
});
