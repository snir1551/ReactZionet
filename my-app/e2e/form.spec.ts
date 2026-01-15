import { test, expect } from '@playwright/test';

/**
 * E2E Test: Advanced Form with React Hook Form & Zod
 * 
 * Purpose: Verify comprehensive form validation, accessibility, and localStorage
 * Scope: Tests all form controls, validation, custom controls, localStorage, submission
 * Best Practices Applied:
 * - Test onBlur validation
 * - Verify error messages and animations
 * - Test localStorage caching (non-sensitive data only)
 * - Verify submit button disabled state
 * - Test keyboard navigation and accessibility
 * - Test custom radio buttons and checkboxes
 * - Verify form submission and cleanup
 */

test.describe('Form Page - Advanced Form Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/form');
    await page.evaluate(() => localStorage.clear());
  });

  test('should display form with all required controls', async ({ page }) => {
    // Assert: Page title
    await expect(page.locator('h1')).toContainText('User Registration Form');
    
    // Assert: Text inputs
    await expect(page.locator('#firstName')).toBeVisible();
    await expect(page.locator('#lastName')).toBeVisible();
    
    // Assert: Email and password fields
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#confirmPassword')).toBeVisible();
    
    // Assert: Number input
    await expect(page.locator('#age')).toBeVisible();
    
    // Assert: Select dropdown
    await expect(page.locator('#country')).toBeVisible();
    
    // Assert: Radio buttons (gender)
    await expect(page.locator('input[name="gender"]')).toHaveCount(3);
    
    // Assert: Checkboxes (interests)
    await expect(page.locator('input[name="interests"]')).toHaveCount(5);
    
    // Assert: Range slider
    await expect(page.locator('#experience')).toBeVisible();
    
    // Assert: Textarea
    await expect(page.locator('#bio')).toBeVisible();
    
    // Assert: Submit button
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should validate required fields on blur', async ({ page }) => {
    const firstNameInput = page.locator('#firstName');
    
    // Act: Focus and blur without entering data
    await firstNameInput.focus();
    await firstNameInput.blur();
    
    // Assert: Error message should appear
    await expect(page.locator('#firstName-error')).toBeVisible();
    await expect(page.locator('#firstName-error')).toContainText('First name must be at least 2 characters');
    
    // Act: Enter valid data
    await firstNameInput.fill('John');
    await firstNameInput.blur();
    
    // Assert: Error should disappear
    await expect(page.locator('#firstName-error')).not.toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    const emailInput = page.locator('#email');
    
    // Act: Enter invalid email
    await emailInput.fill('invalid-email');
    await emailInput.blur();
    
    // Assert: Error message should appear
    await expect(page.locator('#email-error')).toBeVisible();
    await expect(page.locator('#email-error')).toContainText('Invalid email address');
    
    // Act: Enter valid email
    await emailInput.fill('test@example.com');
    await emailInput.blur();
    
    // Assert: Error should disappear
    await expect(page.locator('#email-error')).not.toBeVisible();
  });

  test('should validate password requirements', async ({ page }) => {
    const passwordInput = page.locator('#password');
    
    // Test: Too short
    await passwordInput.fill('Short1');
    await passwordInput.blur();
    await expect(page.locator('#password-error')).toBeVisible();
    
    // Test: No uppercase
    await passwordInput.fill('nouppercas1');
    await passwordInput.blur();
    await expect(page.locator('#password-error')).toContainText('uppercase');
    
    // Test: No lowercase
    await passwordInput.fill('NOLOWERCASE1');
    await passwordInput.blur();
    await expect(page.locator('#password-error')).toContainText('lowercase');
    
    // Test: No number
    await passwordInput.fill('NoNumber');
    await passwordInput.blur();
    await expect(page.locator('#password-error')).toContainText('number');
    
    // Test: Valid password
    await passwordInput.fill('ValidPass123');
    await passwordInput.blur();
    await expect(page.locator('#password-error')).not.toBeVisible();
  });

  test('should validate password confirmation match', async ({ page }) => {
    const passwordInput = page.locator('#password');
    const confirmPasswordInput = page.locator('#confirmPassword');
    
    // Fill all required fields to create a valid form state
    await page.locator('#firstName').fill('John');
    await page.locator('#firstName').blur();
    await page.locator('#lastName').fill('Doe');
    await page.locator('#lastName').blur();
    await page.locator('#email').fill('john@example.com');
    await page.locator('#email').blur();
    
    // Act: Enter matching passwords first
    await passwordInput.fill('ValidPass123');
    await passwordInput.blur();
    await page.waitForTimeout(200);
    
    await confirmPasswordInput.fill('ValidPass123');
    await confirmPasswordInput.blur();
    await page.waitForTimeout(200);
    
    // Fill remaining required fields
    await page.locator('#age').fill('25');
    await page.locator('#age').blur();
    await page.locator('#country').selectOption('us');
    await page.locator('label.custom-radio').filter({ hasText: /^Male$/ }).click();
    await page.locator('label.custom-checkbox:has-text("Programming")').click();
    await page.locator('#bio').fill('This is a valid bio with enough characters.');
    await page.locator('#bio').blur();
    await page.locator('label.custom-checkbox:has-text("I accept the terms")').click();
    
    await page.waitForTimeout(500);
    
    // Verify form is valid - button should be enabled
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeEnabled({ timeout: 2000 });
    
    // Now change confirmPassword to mismatch
    await confirmPasswordInput.clear();
    await confirmPasswordInput.fill('DifferentPass123');
    await confirmPasswordInput.blur();
    await page.waitForTimeout(500);
    
    // Assert: Button should be disabled due to mismatch
    await expect(submitButton).toBeDisabled();
  });

  test('should disable submit button when form is invalid', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');
    
    // Assert: Submit button should be disabled initially
    await expect(submitButton).toBeDisabled();
    
    // Act: Fill only first name
    await page.locator('#firstName').fill('John');
    
    // Assert: Should still be disabled (form incomplete)
    await expect(submitButton).toBeDisabled();
  });

  test('should enable submit button when form is valid', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');
    
    // Act: Fill all required fields with valid data and blur each field
    await page.locator('#firstName').fill('John');
    await page.locator('#firstName').blur();
    
    await page.locator('#lastName').fill('Doe');
    await page.locator('#lastName').blur();
    
    await page.locator('#email').fill('john@example.com');
    await page.locator('#email').blur();
    
    await page.locator('#password').fill('ValidPass123');
    await page.locator('#password').blur();
    
    await page.locator('#confirmPassword').fill('ValidPass123');
    await page.locator('#confirmPassword').blur();
    
    await page.locator('#age').fill('25');
    await page.locator('#age').blur();
    
    await page.locator('#country').selectOption('us');
    await page.locator('#country').blur();
    
    // Select gender (click the custom radio button label)
    await page.locator('label.custom-radio').filter({ hasText: /^Male$/ }).click();
    
    // Select at least one interest
    await page.locator('label.custom-checkbox:has-text("Programming")').click();
    
    // Fill bio
    await page.locator('#bio').fill('This is a valid bio with enough characters.');
    await page.locator('#bio').blur();
    
    // Accept terms
    await page.locator('label.custom-checkbox:has-text("I accept the terms")').click();
    
    // Wait for validation to process
    await page.waitForTimeout(500);
    
    // Assert: Submit button should be enabled
    await expect(submitButton).toBeEnabled({ timeout: 3000 });
  });

  test('should store non-sensitive data in localStorage', async ({ page }) => {
    // Act: Fill some fields
    await page.locator('#firstName').fill('John');
    await page.locator('#lastName').fill('Doe');
    await page.locator('#email').fill('john@example.com');
    await page.locator('#password').fill('ValidPass123');
    
    // Wait for debounce (500ms + buffer)
    await page.waitForTimeout(700);
    
    // Assert: Check localStorage contains data
    const storedData = await page.evaluate(() => {
      return localStorage.getItem('form-data');
    });
    
    expect(storedData).toBeTruthy();
    const parsed = JSON.parse(storedData!);
    
    // Assert: Non-sensitive data is stored
    expect(parsed.firstName).toBe('John');
    expect(parsed.lastName).toBe('Doe');
    expect(parsed.email).toBe('john@example.com');
    
    // Assert: Sensitive data is NOT stored
    expect(parsed.password).toBeUndefined();
    expect(parsed.confirmPassword).toBeUndefined();
  });

  test('should restore non-sensitive data from localStorage on load', async ({ page }) => {
    // Arrange: Set data in localStorage
    await page.evaluate(() => {
      localStorage.setItem('form-data', JSON.stringify({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        age: 30,
        country: 'uk'
      }));
    });
    
    // Act: Reload page
    await page.reload();
    
    // Assert: Fields should be populated
    await expect(page.locator('#firstName')).toHaveValue('Jane');
    await expect(page.locator('#lastName')).toHaveValue('Smith');
    await expect(page.locator('#email')).toHaveValue('jane@example.com');
    await expect(page.locator('#age')).toHaveValue('30');
    await expect(page.locator('#country')).toHaveValue('uk');
    
    // Assert: Password fields should be empty
    await expect(page.locator('#password')).toHaveValue('');
    await expect(page.locator('#confirmPassword')).toHaveValue('');
  });

  test('should submit form and clear localStorage', async ({ page }) => {
    // Setup console log spy
    const consoleMessages: string[] = [];
    page.on('console', msg => consoleMessages.push(msg.text()));
    
    // Act: Fill all required fields and blur each
    await page.locator('#firstName').fill('John');
    await page.locator('#firstName').blur();
    
    await page.locator('#lastName').fill('Doe');
    await page.locator('#lastName').blur();
    
    await page.locator('#email').fill('john@example.com');
    await page.locator('#email').blur();
    
    await page.locator('#password').fill('ValidPass123');
    await page.locator('#password').blur();
    
    await page.locator('#confirmPassword').fill('ValidPass123');
    await page.locator('#confirmPassword').blur();
    
    await page.locator('#age').fill('25');
    await page.locator('#age').blur();
    
    await page.locator('#country').selectOption('us');
    await page.locator('#country').blur();
    
    await page.locator('label.custom-radio').filter({ hasText: /^Male$/ }).click();
    await page.locator('label.custom-checkbox:has-text("Programming")').click();
    
    await page.locator('#bio').fill('This is a valid bio with enough characters.');
    await page.locator('#bio').blur();
    
    await page.locator('label.custom-checkbox:has-text("I accept the terms")').click();
    
    // Wait for validation to complete
    await page.waitForTimeout(500);
    
    // Act: Submit form
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeEnabled({ timeout: 3000 });
    
    page.once('dialog', dialog => dialog.accept()); // Handle alert
    await submitButton.click();
    
    // Assert: Submit button shows loading state
    await expect(page.locator('button[type="submit"]')).toContainText('Submitting');
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
    
    // Wait for submission to complete (2 seconds)
    await page.waitForTimeout(2500);
    
    // Assert: Console should log form data
    const hasFormSubmittedLog = consoleMessages.some(msg => msg.includes('Form submitted successfully'));
    expect(hasFormSubmittedLog).toBeTruthy();
    
    // Wait a bit more to ensure no delayed localStorage saves
    await page.waitForTimeout(1000);
    
    // Assert: localStorage should be cleared
    const storedData = await page.evaluate(() => {
      return localStorage.getItem('form-data');
    });
    expect(storedData).toBeNull();
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Focus on the first input field
    const firstNameInput = page.locator('#firstName');
    await firstNameInput.focus();
    await expect(firstNameInput).toBeFocused();
    
    // Tab to last name
    await page.keyboard.press('Tab');
    await expect(page.locator('#lastName')).toBeFocused();
    
    // Tab to email
    await page.keyboard.press('Tab');
    await expect(page.locator('#email')).toBeFocused();
  });

  test('should work with custom radio buttons via keyboard', async ({ page }) => {
    // Navigate to first radio button
    const maleRadio = page.locator('input[value="male"]');
    
    // Focus the radio button
    await maleRadio.focus();
    
    // Press space to select
    await page.keyboard.press('Space');
    
    // Assert: Radio should be checked
    await expect(maleRadio).toBeChecked();
    
    // Navigate to next radio with arrow key
    await page.keyboard.press('ArrowDown');
    
    // Assert: Female should be checked
    const femaleRadio = page.locator('input[value="female"]');
    await expect(femaleRadio).toBeChecked();
  });

  test('should work with custom checkboxes via keyboard', async ({ page }) => {
    // Find the first checkbox for interests
    const programmingCheckbox = page.locator('input[value="programming"]');
    
    // Focus the checkbox
    await programmingCheckbox.focus();
    
    // Press space to check
    await page.keyboard.press('Space');
    
    // Assert: Checkbox should be checked
    await expect(programmingCheckbox).toBeChecked();
    
    // Press space again to uncheck
    await page.keyboard.press('Space');
    
    // Assert: Checkbox should be unchecked
    await expect(programmingCheckbox).not.toBeChecked();
  });

  test('should update range slider value display', async ({ page }) => {
    const rangeSlider = page.locator('#experience');
    const experienceValue = page.locator('.experience-value');
    
    // Assert: Initial value displayed
    await expect(experienceValue).toContainText('5 years');
    
    // Act: Change slider value
    await rangeSlider.fill('8');
    
    // Assert: Value display updates
    await expect(experienceValue).toContainText('8 years');
  });

  test('should validate bio character limits', async ({ page }) => {
    const bioTextarea = page.locator('#bio');
    
    // Test: Too short
    await bioTextarea.fill('Short');
    await bioTextarea.blur();
    await expect(page.locator('#bio-error')).toContainText('at least 10 characters');
    
    // Test: Too long (501 characters)
    await bioTextarea.fill('a'.repeat(501));
    await bioTextarea.blur();
    await expect(page.locator('#bio-error')).toContainText('at most 500 characters');
    
    // Test: Valid length
    await bioTextarea.fill('This is a valid bio with enough characters to pass validation.');
    await bioTextarea.blur();
    await expect(page.locator('#bio-error')).not.toBeVisible();
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    const firstNameInput = page.locator('#firstName');
    
    // Trigger validation error
    await firstNameInput.focus();
    await firstNameInput.blur();
    
    // Assert: aria-invalid is set
    await expect(firstNameInput).toHaveAttribute('aria-invalid', 'true');
    
    // Assert: aria-describedby links to error
    await expect(firstNameInput).toHaveAttribute('aria-describedby', 'firstName-error');
    
    // Fix the error
    await firstNameInput.fill('John');
    await firstNameInput.blur();
    
    // Assert: aria-invalid is updated
    await expect(firstNameInput).toHaveAttribute('aria-invalid', 'false');
  });

  test('should show error animations without layout shift', async ({ page }) => {
    const firstNameInput = page.locator('#firstName');
    
    // Get initial position of next element
    const submitButton = page.locator('button[type="submit"]');
    const initialPosition = await submitButton.boundingBox();
    
    // Trigger error
    await firstNameInput.focus();
    await firstNameInput.blur();
    
    // Wait for animation
    await page.waitForTimeout(300);
    
    // Get position after error appears
    const finalPosition = await submitButton.boundingBox();
    
    // Assert: Position should be approximately the same (allowing for minor rendering differences)
    // The error container has min-height so there should be no significant shift
    const shift = Math.abs((initialPosition?.y || 0) - (finalPosition?.y || 0));
    expect(shift).toBeLessThan(60); // Allow max 60px (one line height) for error container
    
    // Assert: Error is visible
    await expect(page.locator('#firstName-error')).toBeVisible();
  });

  test('should validate age range', async ({ page }) => {
    const ageInput = page.locator('#age');
    
    // Test: Too young
    await ageInput.fill('17');
    await ageInput.blur();
    await expect(page.locator('#age-error')).toContainText('at least 18');
    
    // Test: Too old
    await ageInput.fill('101');
    await ageInput.blur();
    await expect(page.locator('#age-error')).toBeVisible();
    
    // Test: Valid age
    await ageInput.fill('25');
    await ageInput.blur();
    await expect(page.locator('#age-error')).not.toBeVisible();
  });

  test('should require at least one interest selected', async ({ page }) => {
    // Fill other fields to make interests validation visible
    await page.locator('#firstName').fill('John');
    await page.locator('#lastName').fill('Doe');
    await page.locator('#email').fill('john@example.com');
    await page.locator('#password').fill('ValidPass123');
    await page.locator('#confirmPassword').fill('ValidPass123');
    
    // Try to select gender without interests
    await page.locator('label.custom-radio').filter({ hasText: /^Male$/ }).click();
    
    // Submit button should still be disabled due to missing interests
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeDisabled();
  });

  test('should require terms acceptance', async ({ page }) => {
    // Fill all fields except terms and blur each
    await page.locator('#firstName').fill('John');
    await page.locator('#firstName').blur();
    
    await page.locator('#lastName').fill('Doe');
    await page.locator('#lastName').blur();
    
    await page.locator('#email').fill('john@example.com');
    await page.locator('#email').blur();
    
    await page.locator('#password').fill('ValidPass123');
    await page.locator('#password').blur();
    
    await page.locator('#confirmPassword').fill('ValidPass123');
    await page.locator('#confirmPassword').blur();
    
    await page.locator('#age').fill('25');
    await page.locator('#age').blur();
    
    await page.locator('#country').selectOption('us');
    await page.locator('#country').blur();
    
    await page.locator('label.custom-radio').filter({ hasText: /^Male$/ }).click();
    await page.locator('label.custom-checkbox:has-text("Programming")').click();
    
    await page.locator('#bio').fill('This is a valid bio with enough characters.');
    await page.locator('#bio').blur();
    
    // Wait for validation
    await page.waitForTimeout(500);
    
    // Submit button should be disabled without terms
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeDisabled();
    
    // Accept terms
    await page.locator('label.custom-checkbox:has-text("I accept the terms")').click();
    
    // Wait for validation
    await page.waitForTimeout(500);
    
    // Now submit button should be enabled
    await expect(submitButton).toBeEnabled({ timeout: 3000 });
  });
});
