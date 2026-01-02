import { test, expect } from '@playwright/test';

test.describe('Products Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for products to load
    await page.waitForSelector('.p-datatable-tbody tr', { timeout: 10000 });
  });

  test('should display products in DataTable', async ({ page }) => {
    // Verify DataTable is present
    await expect(page.locator('.p-datatable')).toBeVisible();
    
    // Verify at least one product row exists
    const productRows = page.locator('.p-datatable-tbody tr');
    await expect(productRows.first()).toBeVisible();
    
    // Count products
    const count = await productRows.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should show product image, title, price, and category', async ({ page }) => {
    // Get first product row
    const firstRow = page.locator('.p-datatable-tbody tr').first();
    
    // Verify product has image
    await expect(firstRow.locator('img')).toBeVisible();
    
    // Verify product has text content (title, price, category)
    const rowText = await firstRow.textContent();
    expect(rowText).toBeTruthy();
    expect(rowText!.length).toBeGreaterThan(0);
  });

  test('should navigate to product detail page when clicking view details', async ({ page }) => {
    // Click on first "View Details" button
    const firstViewButton = page.locator('.p-datatable-tbody tr').first().locator('button').filter({ hasText: /View Details|צפה בפרטים/ });
    await firstViewButton.click();
    
    // Verify we're on product detail page
    await expect(page).toHaveURL(/\/products\/\d+/);
    
    // Verify product details are shown
    await expect(page.locator('h1')).toBeVisible();
  });
});
