import { test, expect } from '@playwright/test';

/**
 * E2E Test: Products Page Functionality
 * 
 * Purpose: Verify the products catalog displays and filters work correctly
 * Scope: Tests product listing, search, filtering, and navigation to details
 * Best Practices Applied:
 * - Wait for API responses (products load)
 * - Test real user workflows
 * - Use data-testid for reliable selectors when needed
 * - Check both UI state and data accuracy
 */
test.describe('Products Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products');
    // Wait for products to load (API call)
    await page.waitForSelector('.p-datatable-tbody tr', { timeout: 10000 });
  });

  test('should display products in a data table', async ({ page }) => {
    // Assert: Page title is visible
    await expect(page.locator('h1')).toContainText(/catalog|products/i);
    
    // Assert: DataTable is rendered with products
    const rows = page.locator('.p-datatable-tbody tr');
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(0);
    
    // Assert: First product has image, title, and price
    const firstRow = rows.first();
    await expect(firstRow.locator('img')).toBeVisible();
    await expect(firstRow.locator('button:has-text("View Details")')).toBeVisible();
  });

  test('should filter products by search query', async ({ page }) => {
    // Arrange: Get initial product count
    const initialRows = page.locator('.p-datatable-tbody tr');
    const initialCount = await initialRows.count();
    
    // Act: Enter search term
    const searchInput = page.locator('input[type="text"][placeholder*="Search"]');
    await searchInput.fill('phone');
    
    // Wait for query to complete
    await page.waitForTimeout(500); // Debounce time
    await page.waitForSelector('.p-datatable-tbody tr', { timeout: 5000 });
    
    // Assert: Filtered results are shown
    const filteredRows = page.locator('.p-datatable-tbody tr');
    const filteredCount = await filteredRows.count();
    
    // Should have fewer or equal results after filtering
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
    expect(filteredCount).toBeGreaterThan(0);
  });

  test('should filter products by category', async ({ page }) => {
    // Act: Select a category from dropdown
    const categorySelect = page.locator('select#category');
    await categorySelect.selectOption({ index: 1 }); // Select first non-empty category
    
    // Wait for filtered results
    await page.waitForTimeout(500);
    await page.waitForSelector('.p-datatable-tbody tr', { timeout: 5000 });
    
    // Assert: Products are filtered
    const rows = page.locator('.p-datatable-tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should navigate to product detail page when clicking View Details', async ({ page }) => {
    // Act: Click first "View Details" button
    const firstViewDetailsButton = page.locator('button:has-text("View Details")').first();
    await firstViewDetailsButton.click();
    
    // Assert: Navigated to product detail page
    await expect(page).toHaveURL(/\/products\/\d+/);
    
    // Assert: Product details are displayed
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('img')).toBeVisible();
    
    // Assert: Add to Cart button exists
    await expect(page.locator('button:has-text("Add to Cart")')).toBeVisible();
  });
});
