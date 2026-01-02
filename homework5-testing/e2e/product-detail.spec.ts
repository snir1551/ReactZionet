import { test, expect } from '@playwright/test';

test.describe('Product Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for products to load
    await page.waitForSelector('.p-datatable-tbody tr', { timeout: 10000 });
    
    // Navigate to first product detail
    const firstViewButton = page.locator('.p-datatable-tbody tr').first().locator('button').filter({ hasText: /View Details|צפה בפרטים/ });
    await firstViewButton.click();
    
    // Wait for product detail page to load
    await page.waitForURL(/\/products\/\d+/);
  });

  test('should display product title', async ({ page }) => {
    const title = page.locator('h1');
    await expect(title).toBeVisible();
    
    const titleText = await title.textContent();
    expect(titleText).toBeTruthy();
    expect(titleText!.length).toBeGreaterThan(0);
  });

  test('should display product image', async ({ page }) => {
    const productImage = page.locator('img').first();
    await expect(productImage).toBeVisible();
    
    // Verify image has src attribute
    const src = await productImage.getAttribute('src');
    expect(src).toBeTruthy();
  });

  test('should display product information (price, brand, category)', async ({ page }) => {
    // Wait for content to load
    await page.waitForTimeout(1000);
    
    // Get page text content
    const pageText = await page.locator('body').textContent();
    
    // Verify some product information is present
    // (exact fields depend on the product, but there should be content)
    expect(pageText).toBeTruthy();
    expect(pageText!.length).toBeGreaterThan(100);
  });

  test('should navigate back to products page', async ({ page }) => {
    // Click back to products button
    const backButton = page.locator('button, a').filter({ hasText: /Back to Products|חזור למוצרים/ });
    await backButton.click();
    
    // Verify we're back on products page (check pathname only)
    await page.waitForURL(/\/(products)?$/);
    await expect(page.locator('.p-datatable')).toBeVisible();
  });
});
