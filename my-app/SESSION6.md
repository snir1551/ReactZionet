# Session 6: Advanced Forms with React Hook Form & Zod

## 📋 Table of Contents
1. [Overview](#overview)
2. [Technologies Used](#technologies-used)
3. [Form Requirements](#form-requirements)
4. [Implementation Details](#implementation-details)
5. [Validation Schema](#validation-schema)
6. [Accessibility Features](#accessibility-features)
7. [Bonus Features](#bonus-features)
8. [Best Practices Applied](#best-practices-applied)
9. [Testing the Form](#testing-the-form)
10. [Resources](#resources)

---

## 🎯 Overview

In this session, we built a comprehensive registration form that demonstrates:
- **Form state management** with React Hook Form
- **Schema validation** with Zod
- **Accessibility (a11y)** best practices
- **LocalStorage integration** for data persistence
- **Custom-styled form controls** (Bonus)
- **Animated error messages** (Advanced Bonus)

### Form Location
- **Path**: `/form`
- **Component**: `src/pages/FormPage.tsx`
- **Styles**: `src/pages/FormPage.css`

---

## 🛠️ Technologies Used

### 1. **React Hook Form** (v7+)
Library for managing form state, validation, and submission.

**Why React Hook Form?**
- ✅ Minimal re-renders (performance optimization)
- ✅ Built-in validation support
- ✅ Easy integration with validation libraries
- ✅ Great TypeScript support
- ✅ Small bundle size

### 2. **Zod** (v3+)
TypeScript-first schema validation library.

**Why Zod?**
- ✅ Type-safe validation
- ✅ Excellent TypeScript inference
- ✅ Composable schemas
- ✅ Clear error messages
- ✅ Easy to read and maintain

### 3. **@hookform/resolvers**
Integration layer between React Hook Form and validation libraries like Zod.

---

## 📝 Form Requirements

### Core Form Controls
- ✅ **Text inputs**: First Name, Last Name
- ✅ **Email field**: With email validation
- ✅ **Password fields**: Password + Confirm Password
- ✅ **Number input**: Age (18-100)
- ✅ **Select dropdown**: Country selection
- ✅ **Radio buttons**: Gender selection (Male, Female, Other)
- ✅ **Checkboxes**: Interests, Newsletter, Terms
- ✅ **Range slider**: Years of experience (0-10)
- ✅ **Textarea**: Bio field with character limits

### Validation Requirements
- ✅ **onBlur validation** (validates when user leaves field)
- ✅ Field validation using Zod schema
- ✅ Error messages displayed to user
- ✅ Submit button disabled when form invalid
- ✅ Password strength requirements
- ✅ Password confirmation matching

### Accessibility Requirements
- ✅ **Focus visible** on all interactive elements
- ✅ **No layout shift** on focus or errors
- ✅ Proper ARIA labels and attributes
- ✅ Keyboard navigation support
- ✅ Screen reader friendly

### Submission Requirements
- ✅ Simulate async request (2-second delay)
- ✅ Log form data to console
- ✅ Hide sensitive data in logs

### LocalStorage Requirements
- ✅ Cache non-sensitive data automatically
- ✅ Exclude passwords from storage
- ✅ Restore data on page load
- ✅ Clear data after successful submission

---

## 🔧 Implementation Details

### Form Setup

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const {
  register,
  handleSubmit,
  watch,
  setValue,
  formState: { errors, isValid }
} = useForm<FormData>({
  resolver: zodResolver(formSchema),
  mode: 'onBlur', // Validate on blur
  defaultValues: { /* ... */ }
});
```

### Key Features

#### 1. **Debounced LocalStorage**
```tsx
const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

useEffect(() => {
  if (debounceTimerRef.current) {
    clearTimeout(debounceTimerRef.current);
  }

  debounceTimerRef.current = setTimeout(() => {
    const filtered = filterSensitiveData(formValues);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }, 500);

  return () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  };
}, [formValues]);
```

**Why debounce?**
- Prevents excessive localStorage writes on every keystroke
- Improves performance
- Still provides auto-save functionality

#### 2. **Sensitive Data Filtering**
```tsx
const SENSITIVE_FIELDS: Array<keyof FormData> = ['password', 'confirmPassword'];

const filterSensitiveData = (data: Partial<FormData>): Partial<FormData> => {
  const filtered = { ...data };
  SENSITIVE_FIELDS.forEach(field => {
    delete filtered[field];
  });
  return filtered;
};
```

#### 3. **Async Submission with Cleanup**
```tsx
const onSubmit = async (data: FormData) => {
  setIsSubmitting(true);
  
  try {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Form Data:', {
      ...data,
      password: '***HIDDEN***',
      confirmPassword: '***HIDDEN***'
    });
    
    // Clear localStorage after successful submission
    localStorage.removeItem(STORAGE_KEY);
    
    alert('Form submitted successfully!');
  } catch (error) {
    console.error('Submission error:', error);
  } finally {
    setIsSubmitting(false);
  }
};
```

---

## ✅ Validation Schema

### Zod Schema Definition

```tsx
const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  age: z.number().min(18, 'You must be at least 18 years old').max(100),
  country: z.string().min(1, 'Please select a country'),
  gender: z.enum(['male', 'female', 'other']).optional(),
  interests: z.array(z.string()).min(1, 'Please select at least one interest'),
  experience: z.number().min(0).max(10),
  bio: z.string()
    .min(10, 'Bio must be at least 10 characters')
    .max(500, 'Bio must be at most 500 characters'),
  newsletter: z.boolean(),
  terms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  })
})
.refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
})
.refine(data => data.gender !== undefined, {
  message: "Please select a gender",
  path: ['gender']
});
```

### Custom Refinements

**Password Matching**:
```tsx
.refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
})
```

**Gender Required Check**:
```tsx
.refine(data => data.gender !== undefined, {
  message: "Please select a gender",
  path: ['gender']
})
```

---

## ♿ Accessibility Features

### 1. **ARIA Attributes**

```tsx
<input
  id="firstName"
  type="text"
  {...register('firstName')}
  aria-invalid={errors.firstName ? 'true' : 'false'}
  aria-describedby={errors.firstName ? 'firstName-error' : undefined}
/>

<div className="error-container" role="alert">
  {errors.firstName && (
    <span id="firstName-error" className="error-message">
      {errors.firstName.message}
    </span>
  )}
</div>
```

### 2. **Focus Management**

```css
/* Visible focus without layout shift */
input:focus {
  outline: 3px solid #4CAF50;
  outline-offset: 0px; /* No layout shift! */
  border-color: #4CAF50;
}
```

### 3. **Keyboard Navigation**

- ✅ All form controls are keyboard accessible
- ✅ Tab order is logical
- ✅ Custom controls use visually-hidden native inputs
- ✅ Range slider has proper keyboard controls

### 4. **Screen Reader Support**

- ✅ Semantic HTML (`<fieldset>`, `<legend>`, `<label>`)
- ✅ Error messages linked with `aria-describedby`
- ✅ Form sections properly labeled
- ✅ Submit button has `aria-busy` state

---

## ⭐ Bonus Features

### 1. Custom-Styled Radio Buttons

```tsx
<label className="custom-radio">
  <input
    type="radio"
    value="male"
    {...register('gender')}
    className="visually-hidden"
  />
  <span className="radio-custom" aria-hidden="true"></span>
  <span className="radio-label">Male</span>
</label>
```

**CSS**:
```css
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.radio-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 50%;
}

.radio-custom::after {
  content: '';
  width: 10px;
  height: 10px;
  background: #4CAF50;
  border-radius: 50%;
  transform: scale(0);
  transition: transform 0.2s ease;
}

.custom-radio input:checked + .radio-custom::after {
  transform: scale(1);
}
```

### 2. Custom-Styled Checkboxes

Similar implementation to radio buttons but with square shape and checkmark icon.

### 3. Accessible Custom Controls

**Requirements Met**:
- ✅ Native inputs hidden but still in DOM
- ✅ Keyboard navigable
- ✅ Focus visible
- ✅ Screen reader announces state
- ✅ Visual custom UI

---

## ⭐⭐ Advanced Bonus: Animated Errors

### No Layout Shift Technique

```css
/* Fixed minimum height prevents layout shift */
.error-container {
  min-height: 1.5rem;
  margin-top: 0.25rem;
  overflow: hidden;
}

/* Animated slide-down */
.error-message {
  display: inline-block;
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**How it works**:
1. Error container always reserves space (`min-height`)
2. Error message animates into that space
3. No content jumping or layout shifts
4. Smooth user experience

---

## 🎯 Best Practices Applied

### 1. **TypeScript**
- ✅ Proper type inference from Zod schema
- ✅ No `any` types (properly typed)
- ✅ Type-safe form data

### 2. **Performance**
- ✅ Debounced localStorage (500ms)
- ✅ Single `watch()` subscription
- ✅ Minimal re-renders with React Hook Form
- ✅ Cleanup in useEffect

### 3. **Security**
- ✅ Passwords never stored in localStorage
- ✅ Passwords hidden in console logs
- ✅ Validation on both client side

### 4. **UX**
- ✅ Clear error messages
- ✅ Visual feedback (loading states)
- ✅ Auto-save for convenience
- ✅ Clear data after submission
- ✅ Responsive design

### 5. **Code Quality**
- ✅ Clean, readable code
- ✅ Proper separation of concerns
- ✅ Reusable utilities
- ✅ Consistent naming

---

## 🧪 Testing the Form

### Manual Testing Checklist

#### Validation Testing
- [ ] Leave required fields empty and blur → Should show errors
- [ ] Enter invalid email → Should show "Invalid email address"
- [ ] Enter password < 8 characters → Should show error
- [ ] Enter password without uppercase → Should show error
- [ ] Enter password without number → Should show error
- [ ] Mismatch confirm password → Should show error
- [ ] Enter age < 18 → Should show error
- [ ] Don't select gender → Should show error on submit attempt
- [ ] Don't select interests → Should show error
- [ ] Bio < 10 characters → Should show error
- [ ] Don't accept terms → Submit button should be disabled

#### LocalStorage Testing
- [ ] Fill form partially → Refresh page → Data should restore
- [ ] Fill passwords → Refresh page → Passwords should NOT restore
- [ ] Submit form → Check localStorage → Should be cleared

#### Accessibility Testing
- [ ] Tab through all fields → Focus should be visible
- [ ] Use only keyboard to fill form → Should work completely
- [ ] Check focus styles → No layout shifts
- [ ] Use screen reader → All fields should be announced

#### Submission Testing
- [ ] Fill valid form → Click submit → Should show loading state
- [ ] Wait 2 seconds → Should show success message
- [ ] Check console → Should see form data with hidden passwords
- [ ] Check localStorage → Should be cleared after success

#### Custom Controls Testing
- [ ] Click custom radio buttons → Should work
- [ ] Tab to radio buttons → Focus should be visible
- [ ] Space to select radio → Should work
- [ ] Same tests for checkboxes

#### Animation Testing
- [ ] Trigger error → Should slide down smoothly
- [ ] Fix error → Should disappear smoothly
- [ ] No layout jumping during animations

---

## 📚 Resources

### Documentation
- [React Hook Form](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [ARIA Best Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN: Form Validation](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation)

### Articles
- [Accessible Form Design](https://www.smashingmagazine.com/2018/08/best-practices-for-mobile-form-design/)
- [Custom Form Controls](https://moderncss.dev/pure-css-custom-styled-radio-buttons/)
- [React Hook Form Best Practices](https://react-hook-form.com/advanced-usage)

### Tools
- [Form Accessibility Checker](https://wave.webaim.org/)
- [Keyboard Testing Guide](https://webaim.org/articles/keyboard/)
- [NVDA Screen Reader](https://www.nvaccess.org/) (Free, Windows)

---

## 🎓 Key Takeaways

1. **React Hook Form** dramatically simplifies form management
2. **Zod** provides type-safe validation with great DX
3. **Accessibility** is not optional - it's a core requirement
4. **Performance matters** - debounce expensive operations
5. **Security first** - never store sensitive data client-side
6. **UX details matter** - animations, focus states, error messages
7. **Custom controls** can be accessible if done correctly
8. **TypeScript** makes forms safer and easier to maintain

---

## 📝 Summary

This session demonstrated building a **production-quality form** with:
- Comprehensive validation
- Full accessibility support
- Custom-styled controls
- Smooth animations
- Data persistence
- Best practices throughout

The form is ready to use in a real application and serves as a great template for future projects! 🚀
