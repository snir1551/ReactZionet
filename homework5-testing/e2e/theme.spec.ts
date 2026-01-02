import { test, expect } from '@playwright/test';

test.describe('Theme Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should toggle between light and dark theme', async ({ page }) => {
    // Find theme toggle button (moon/sun emoji)
    const themeButton = page.locator('button').filter({ hasText: /🌙|☀️/ });
    await expect(themeButton).toBeVisible();
    
    // Get initial theme button text
    const initialEmoji = await themeButton.textContent();
    
    // Click to toggle theme
    await themeButton.click();
    
    // Wait for theme change
    await page.waitForTimeout(300);
    
    // Verify theme button emoji changed
    const newEmoji = await themeButton.textContent();
    expect(initialEmoji).not.toBe(newEmoji);
    
    // Toggle back
    await themeButton.click();
    await page.waitForTimeout(300);
    
    // Verify it toggled back
    const finalEmoji = await themeButton.textContent();
    expect(finalEmoji).toBe(initialEmoji);
  });

  test('should persist theme preference in localStorage', async ({ page }) => {
    // Click theme toggle to set a theme
    const themeButton = page.locator('button').filter({ hasText: /🌙|☀️/ });
    
    // Get button text before click
    const beforeEmoji = await themeButton.textContent();
    
    await themeButton.click();
    
    // Wait for theme change and localStorage update
    await page.waitForTimeout(500);
    
    // Verify button changed (theme toggled)
    const afterEmoji = await themeButton.textContent();
    expect(afterEmoji).not.toBe(beforeEmoji);
    
    // Reload page
    await page.reload();
    await page.waitForTimeout(300);
    
    // Verify theme persisted - button should still show the toggled state
    const persistedEmoji = await themeButton.textContent();
    expect(persistedEmoji).toBe(afterEmoji);
  });
});
