import { test, expect } from '@playwright/test';

/**
 * E2E Test: Navigation and Page Routing
 * 
 * Purpose: Verify that users can navigate through all main pages
 * Scope: Tests the entire routing system and navigation component
 * Best Practices Applied:
 * - Test user behavior, not implementation
 * - Use descriptive test names
 * - Check visible elements, not internal state
 */
test.describe('Navigation', () => {
  test('should navigate to all main pages from navigation menu', async ({ page }) => {
    // Arrange: Start at home page
    await page.goto('/');
    
    // Assert: Home page loads correctly
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toContainText('Welcome');

    // Act & Assert: Navigate to Products page
    await page.click('text=Products');
    await expect(page).toHaveURL('/products');
    await expect(page.locator('h1')).toContainText(/catalog|products/i);

    // Act & Assert: Navigate to Counter page
    await page.click('text=Counter');
    await expect(page).toHaveURL('/counter');
    await expect(page.locator('h1')).toContainText('Counter');

    // Act & Assert: Navigate to Register page
    await page.click('text=Register');
    await expect(page).toHaveURL('/register');
    await expect(page.locator('h1')).toContainText(/User Registration|Register/);

    // Act & Assert: Navigate to About page
    await page.click('text=About');
    await expect(page).toHaveURL('/about');
    await expect(page.locator('h1')).toContainText('About');
  });
});
