import { test, expect } from '@playwright/test';

/**
 * E2E Test: Counter Component Interaction
 * 
 * Purpose: Verify interactive counter functionality works correctly
 * Scope: Tests button clicks and state updates
 * Best Practices Applied:
 * - Test user interactions (clicks)
 * - Verify UI updates in response to actions
 * - Simple, focused tests on component behavior
 * - Test edge cases (like boundaries)
 */
test.describe('Counter Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/counter');
  });

  test('should display initial counter value', async ({ page }) => {
    // Assert: Page has title
    await expect(page.locator('h1')).toContainText('Counter');
    
    // Assert: Counter display is visible
    const counterDisplay = page.locator('span.counter-value').first();
    await expect(counterDisplay).toBeVisible();
  });

  test('should increment counter when clicking increment button', async ({ page }) => {
    // Arrange: Get initial counter value
    const counterDisplay = page.locator('span.counter-value').first();
    const initialValue = await counterDisplay.textContent();
    const initialCount = parseInt(initialValue || '0');
    
    // Act: Click increment button
    const incrementButton = page.locator('button.counter-btn-increment');
    await incrementButton.click();
    
    // Assert: Counter increased by 1
    const newValue = await counterDisplay.textContent();
    const newCount = parseInt(newValue || '0');
    expect(newCount).toBe(initialCount + 1);
  });

  test('should decrement counter when clicking decrement button', async ({ page }) => {
    // Arrange: Get initial counter value and increment first to ensure positive value
    const counterDisplay = page.locator('span.counter-value').first();
    
    const incrementButton = page.locator('button.counter-btn-increment');
    await incrementButton.click();
    await incrementButton.click();
    
    const beforeValue = await counterDisplay.textContent();
    const beforeCount = parseInt(beforeValue || '0');
    
    // Act: Click decrement button
    const decrementButton = page.locator('button.counter-btn-decrement');
    await decrementButton.click();
    
    // Assert: Counter decreased by 1
    const afterValue = await counterDisplay.textContent();
    const afterCount = parseInt(afterValue || '0');
    expect(afterCount).toBe(beforeCount - 1);
  });

  test('should handle multiple increments correctly', async ({ page }) => {
    // Arrange: Get initial value
    const counterDisplay = page.locator('span.counter-value').first();
    const initialValue = await counterDisplay.textContent();
    const initialCount = parseInt(initialValue || '0');
    
    // Act: Click increment 5 times
    const incrementButton = page.locator('button.counter-btn-increment');
    
    for (let i = 0; i < 5; i++) {
      await incrementButton.click();
      await page.waitForTimeout(100); // Small delay for state update
    }
    
    // Assert: Counter increased by 5
    const finalValue = await counterDisplay.textContent();
    const finalCount = parseInt(finalValue || '0');
    expect(finalCount).toBe(initialCount + 5);
  });
});
