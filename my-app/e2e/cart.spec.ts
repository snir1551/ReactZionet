import { test, expect } from '@playwright/test';

/**
 * E2E Test: Shopping Cart Workflow
 * 
 * Purpose: Verify complete shopping cart functionality from browsing to adding items
 * Scope: Tests the entire user flow of adding products to cart
 * Best Practices Applied:
 * - Test complete user workflows, not isolated features
 * - Verify state changes (cart count updates)
 * - Test across multiple pages (integration)
 * - Use localStorage to verify persistence
 */
test.describe('Shopping Cart', () => {
  test.beforeEach(async ({ page }) => {
    // Clear cart before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should add product to cart from product detail page', async ({ page }) => {
    // Arrange: Navigate to products page
    await page.goto('/products');
    await page.waitForSelector('.p-datatable-tbody tr', { timeout: 10000 });
    
    // Act: Click first product's "View Details"
    await page.locator('button:has-text("View Details")').first().click();
    await expect(page).toHaveURL(/\/products\/\d+/);
    
    // Act: Click "Add to Cart" button
    const addToCartButton = page.locator('button:has-text("Add to Cart")');
    await addToCartButton.click();
    
    // Wait for cart update
    await page.waitForTimeout(300);
    
    // Assert: Toast notification appears (if implemented)
    // This is optional based on your implementation
    
    // Assert: Cart badge appears with count of 1
    const cartBadgeAfter = page.locator('.cart-badge, [class*="badge"]');
    await expect(cartBadgeAfter).toBeVisible();
    await expect(cartBadgeAfter).toContainText('1');
  });

  test('should persist cart items in localStorage', async ({ page }) => {
    // Arrange: Add item to cart
    await page.goto('/products');
    await page.waitForSelector('.p-datatable-tbody tr', { timeout: 10000 });
    await page.locator('button:has-text("View Details")').first().click();
    await page.locator('button:has-text("Add to Cart")').click();
    await page.waitForTimeout(500);
    
    // Act: Get localStorage value
    const cartData = await page.evaluate(() => localStorage.getItem('cart-items'));
    
    // Assert: Cart data exists in localStorage
    expect(cartData).not.toBeNull();
    const cart = JSON.parse(cartData!);
    expect(Array.isArray(cart)).toBe(true);
    expect(cart.length).toBeGreaterThan(0);
    
    // Act: Reload page
    await page.reload();
    
    // Assert: Cart badge still shows item count
    const cartBadge = page.locator('.cart-badge, [class*="badge"]');
    await expect(cartBadge).toBeVisible();
    await expect(cartBadge).toContainText('1');
  });

  test('should open cart sidebar when clicking cart button', async ({ page }) => {
    // Arrange: Add item to cart first
    await page.goto('/products');
    await page.waitForSelector('.p-datatable-tbody tr', { timeout: 10000 });
    await page.locator('button:has-text("View Details")').first().click();
    
    // Add to cart - this will open the sidebar
    await page.locator('button:has-text("Add to Cart")').click();
    await page.waitForTimeout(500);
    
    // Assert: Cart sidebar is visible after adding item
    const cartSidebar = page.locator('.cart-sidebar, .p-sidebar');
    await expect(cartSidebar).toBeVisible();
    
    // Close the sidebar by clicking cart button
    const cartButton = page.locator('button.cart-button');
    await cartButton.click({ force: true });
    await page.waitForTimeout(300);
    
    // Act: Open sidebar again by clicking cart button
    await cartButton.click({ force: true });
    await page.waitForTimeout(300);
    
    // Assert: Cart sidebar is visible
    await expect(cartSidebar).toBeVisible();
    
    // Assert: Cart contains the added item
    const cartItems = cartSidebar.locator('.cart-item, [class*="cart-item"]');
    expect(await cartItems.count()).toBeGreaterThan(0);
  });
});
