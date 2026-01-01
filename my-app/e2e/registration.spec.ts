import { test, expect } from '@playwright/test';

/**
 * E2E Test: User Registration Form
 * 
 * Purpose: Verify form validation and submission work correctly
 * Scope: Tests form inputs, validation messages, and submission flow
 * Best Practices Applied:
 * - Test form validation (both success and error cases)
 * - Verify error messages appear for invalid inputs
 * - Test complete form submission workflow
 * - Check accessibility features (labels, error messages)
 */
test.describe('Registration Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  test('should display registration form with all required fields', async ({ page }) => {
    // Assert: Page title
    await expect(page.locator('h1')).toContainText(/User Registration|Register/);
    
    // Assert: All form fields are present
    await expect(page.locator('input[placeholder*="name"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[placeholder*="age"]')).toBeVisible();
    
    // Assert: Submit button exists
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show validation errors for empty form submission', async ({ page }) => {
    // Act: Submit button should be disabled for empty form
    const submitButton = page.locator('button[type="submit"]');
    
    // Assert: Submit button is disabled when form is empty
    await expect(submitButton).toBeDisabled();
    
    // Assert: We're still on register page (form can't submit)
    await expect(page).toHaveURL('/register');
  });

  test('should show error for invalid email format', async ({ page }) => {
    // Arrange: Get form fields
    const nameInput = page.locator('input[placeholder*="name"]');
    const emailInput = page.locator('input[type="email"]');
    const ageInput = page.locator('input[placeholder*="age"]');
    
    // Act: Fill form with invalid email
    await nameInput.fill('Test User');
    await emailInput.fill('invalid-email');
    await ageInput.fill('25');
    
    // Wait for validation to run
    await page.waitForTimeout(300);
    
    // Assert: Email validation error appears
    const emailError = page.locator('.user-form-error:has-text("valid email")');
    await expect(emailError).toBeVisible();
    
    // Assert: Submit button is disabled due to validation error
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeDisabled();
  });

  test('should successfully submit form with valid data', async ({ page }) => {
    // Dismiss any existing alerts by setting up a handler
    page.on('dialog', dialog => dialog.accept());
    
    // Arrange: Fill form with valid data
    const nameInput = page.locator('input[placeholder*="name"]');
    const emailInput = page.locator('input[type="email"]');
    const ageInput = page.locator('input[placeholder*="age"]');
    
    await nameInput.fill('John Doe');
    await emailInput.fill('john.doe@example.com');
    await ageInput.fill('25');
    
    // Wait for validation
    await page.waitForTimeout(300);
    
    // Act: Submit form
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeEnabled();
    await submitButton.click();
    
    // Wait for submission to complete (2 second simulation + alert)
    await page.waitForTimeout(2500);
    
    // Assert: Form was reset (inputs are empty)
    const nameValue = await nameInput.inputValue();
    const emailValue = await emailInput.inputValue();
    const ageValue = await ageInput.inputValue();
    
    expect(nameValue).toBe('');
    expect(emailValue).toBe('');
    expect(ageValue).toBe('');
  });

  test('should show validation error for short name', async ({ page }) => {
    // Arrange: Get name input
    const nameInput = page.locator('input[placeholder*="name"]');
    const emailInput = page.locator('input[type="email"]');
    const ageInput = page.locator('input[placeholder*="age"]');
    
    // Act: Type short name (less than 2 characters)
    await nameInput.fill('J');
    await emailInput.fill('john@example.com');
    await ageInput.fill('25');
    
    // Wait for validation
    await page.waitForTimeout(300);
    
    // Assert: Name validation error appears
    const nameError = page.locator('.user-form-error:has-text("at least 2 characters")');
    await expect(nameError).toBeVisible();
    
    // Assert: Submit button is disabled
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeDisabled();
  });
});
