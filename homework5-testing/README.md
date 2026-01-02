# Homework 5: Testing with Playwright

## 📋 Overview

This homework focuses on understanding different types of testing and implementing End-to-End (E2E) tests using Playwright.

---

## 🧪 Testing Concepts

### 1. Unit Testing
**What is tested**: Individual functions, methods, or utilities in isolation

**Level**: Single function/method level

**Common tool**: Jest, Vitest

**Advantage**: ⚡ Fast execution, easy to pinpoint bugs, encourages modular code design

**Limitation**: ❌ Doesn't test how components work together or integrate with real systems

**Example**: Testing a price calculation function, date formatter, or validation utility

---

### 2. Component Testing
**What is tested**: Individual React components in isolation with mock data

**Level**: Single component level

**Common tool**: React Testing Library, Vitest + @testing-library/react

**Advantage**: ✅ Tests user interactions and rendering logic without needing full application context

**Limitation**: ❌ May miss issues with routing, context providers, or real API integration

**Example**: Testing that a button component renders correctly and handles click events

---

### 3. Integration Testing
**What is tested**: How multiple units/components work together

**Level**: Multiple components/modules interacting

**Common tool**: React Testing Library, Vitest

**Advantage**: ✅ Catches bugs that occur when different parts of the system interact

**Limitation**: ❌ Slower than unit tests, harder to isolate the exact failure point

**Example**: Testing a form component that uses multiple input components and validation utilities

---

### 4. End-to-End (E2E) Testing ⭐ (Implemented in this homework)
**What is tested**: Complete user workflows through the real application

**Level**: Full application in a real browser

**Common tool**: **Playwright**, Cypress

**Advantage**: ✅ Tests the entire system as users experience it, provides highest confidence

**Limitation**: ❌ Slowest to run, most brittle (breaks easily with UI changes), harder to debug

**Example**: Testing complete user journey from landing page → browsing products → viewing details → changing theme

---

## 🎯 Testing Pyramid

```
        /\
       /E2E\        ← Few tests, high value (slowest)
      /------\
     /  INT   \     ← More tests (medium speed)
    /----------\
   / COMPONENT  \   ← Many tests (fast)
  /--------------\
 /     UNIT       \ ← Most tests (fastest)
/------------------\
```

**Best Practice**: Write more unit tests, fewer E2E tests. Each level serves a different purpose.

---

## 🚀 Playwright Tests Implemented

### Test Suite 1: Navigation (3 tests)
**File**: `e2e/navigation.spec.ts`

- ✅ Should navigate to products page
- ✅ Should navigate to about page
- ✅ Should toggle language between English and Hebrew

### Test Suite 2: Products Page (3 tests)
**File**: `e2e/products.spec.ts`

- ✅ Should display products in DataTable
- ✅ Should show product image, title, price, and category
- ✅ Should navigate to product detail page when clicking view details

### Test Suite 3: Product Detail Page (4 tests)
**File**: `e2e/product-detail.spec.ts`

- ✅ Should display product title
- ✅ Should display product image
- ✅ Should display product information (price, brand, category)
- ✅ Should navigate back to products page

### Test Suite 4: Theme Toggle (2 tests)
**File**: `e2e/theme.spec.ts`

- ✅ Should toggle between light and dark theme
- ✅ Should persist theme preference in localStorage

**Total: 12 E2E tests** covering all major user workflows

---

## 📦 Setup Instructions

### 1. Install Dependencies

```bash
cd homework5-testing
npm install
```

### 2. Install Playwright Browsers

```bash
npx playwright install --with-deps
```

---

## 🏃 Running Tests

### Basic Commands

```bash
# Run all tests (headless mode)
npm run test:e2e

# Run with UI mode (recommended for development)
npm run test:e2e:ui

# Run with browser visible
npm run test:e2e:headed

# Debug mode (step through tests)
npm run test:e2e:debug
```

### Advanced Commands

```bash
# Run specific test file
npx playwright test e2e/products.spec.ts

# Run tests matching a pattern
npx playwright test -g "should display products"

# View HTML report
npx playwright show-report
```

---

## ✅ Best Practices Applied

### 1. Test User Behavior, Not Implementation
```typescript
// ✅ Good - Tests what user sees
await page.click('text=/View Details|צפה בפרטים/');

// ❌ Bad - Tests implementation details
await component.props.onClick();
```

### 2. Use Descriptive Test Names
```typescript
test('should navigate to product detail page when clicking view details', async ({ page }) => {
  // Clear what's being tested and expected outcome
});
```

### 3. Arrange-Act-Assert Pattern
```typescript
// Arrange: Set up test conditions
await page.goto('/');

// Act: Perform user action
await page.click('button');

// Assert: Verify expected outcome
await expect(page.locator('h1')).toBeVisible();
```

### 4. Wait for Dynamic Content
```typescript
// Wait for API responses
await page.waitForSelector('.p-datatable-tbody tr', { timeout: 10000 });
```

### 5. Support Multi-language Testing
```typescript
// Use regex to match both English and Hebrew text
await page.click('text=/About|אודות/');
```

---

## 📂 Project Structure

```
homework5-testing/
├── e2e/                                # E2E test files
│   ├── navigation.spec.ts              # Navigation tests
│   ├── products.spec.ts                # Products page tests
│   ├── product-detail.spec.ts          # Product detail tests
│   └── theme.spec.ts                   # Theme toggle tests
├── playwright.config.ts                # Playwright configuration
├── package.json                        # Test scripts
├── test-results/                       # Test artifacts (gitignored)
├── playwright-report/                  # HTML reports (gitignored)
└── README.md                           # This file
```

---

## 📊 Configuration Highlights

**`playwright.config.ts` Settings:**

- **Base URL**: `http://localhost:5173` (Vite dev server)
- **Auto-start dev server**: Tests automatically start Vite
- **Screenshots**: `only-on-failure`
- **Videos**: `retain-on-failure`
- **Traces**: `on-first-retry`
- **Parallel execution**: Tests run in parallel for speed
- **Browser**: Chromium
- **Timeout**: 30 seconds per test (default)
- **Retries**: 2 on CI, 0 locally

---

## 🎓 Learning Objectives

By completing this homework, you should understand:

- ✅ **Different testing types**: Unit, Component, Integration, E2E
- ✅ **Testing pyramid**: When to use each type of test
- ✅ **E2E testing with Playwright**: Real browser automation
- ✅ **Best practices**: User-centric testing, proper test structure
- ✅ **Test organization**: Descriptive names, logical grouping
- ✅ **Multi-language support**: Testing internationalized apps
- ✅ **Async handling**: Waiting for dynamic content

---

## 🔗 Resources

- [Playwright Documentation](https://playwright.dev)
- [Testing Best Practices](https://playwright.dev/docs/best-practices)
- [React Testing Library](https://testing-library.com/react)
- [Jest Documentation](https://jestjs.io)

---

## 📝 Notes for Lecture

During the lecture, be ready to discuss:

1. **When to use E2E vs Unit tests**
   - E2E: Critical user workflows, integration points
   - Unit: Business logic, utilities, pure functions

2. **Trade-offs**
   - E2E tests provide confidence but are slow and brittle
   - Unit tests are fast but don't catch integration issues

3. **Test maintenance**
   - E2E tests need updating when UI changes
   - Focus on testing behavior, not implementation

4. **Real-world scenarios**
   - How many of each test type?
   - What should be tested at each level?
   - When are tests worth the maintenance cost?

---

## ✨ Features Tested

- ✅ Navigation between pages
- ✅ Product listing with DataTable
- ✅ Product detail page
- ✅ Theme switching (light/dark)
- ✅ Language switching (English/Hebrew)
- ✅ LocalStorage persistence
- ✅ User interactions (clicks, navigation)

**Status**: ✅ 12 E2E tests covering all major features
