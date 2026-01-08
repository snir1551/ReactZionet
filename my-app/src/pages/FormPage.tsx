import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import './FormPage.css';

// Validation schema
const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  age: z.number().min(18, 'You must be at least 18 years old').max(100),
  country: z.string().min(1, 'Please select a country'),
  gender: z.enum(['male', 'female', 'other']).optional(),
  interests: z.array(z.string()).min(1, 'Please select at least one interest'),
  experience: z.number().min(0).max(10),
  bio: z.string().min(10, 'Bio must be at least 10 characters').max(500, 'Bio must be at most 500 characters'),
  newsletter: z.boolean(),
  terms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  })
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
}).refine(data => data.gender !== undefined, {
  message: "Please select a gender",
  path: ['gender']
});

type FormData = z.infer<typeof formSchema>;

const STORAGE_KEY = 'form-data';
const SENSITIVE_FIELDS: Array<keyof FormData> = ['password', 'confirmPassword'];
const DEBOUNCE_DELAY = 500; // ms

// Exclude sensitive fields from the data with proper typing
const filterSensitiveData = (data: Partial<FormData>): Partial<FormData> => {
  const filtered = { ...data };
  SENSITIVE_FIELDS.forEach(field => {
    delete filtered[field];
  });
  return filtered;
};

export const FormPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasSubmittedRef = useRef(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      age: 18,
      country: '',
      gender: undefined,
      interests: [],
      experience: 5,
      bio: '',
      newsletter: false,
      terms: false
    }
  });

  // Watch all form values to determine if form is complete
  const formValues = watch();
  
  // Check if form is complete and valid
  const isFormValid = 
    Object.keys(errors).length === 0 &&
    formValues.firstName?.trim() &&
    formValues.lastName?.trim() &&
    formValues.email?.trim() &&
    formValues.password &&
    formValues.confirmPassword &&
    formValues.age >= 18 &&
    formValues.country &&
    formValues.gender &&
    formValues.interests.length > 0 &&
    formValues.bio?.trim() &&
    formValues.terms === true;

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData) as Partial<FormData>;
        (Object.entries(parsed) as [keyof FormData, FormData[keyof FormData]][]).forEach(([key, value]) => {
          if (!SENSITIVE_FIELDS.includes(key)) {
            setValue(key, value, { shouldValidate: false });
          }
        });
      }
    } catch (error) {
      console.error('Error loading form data from localStorage:', error);
    }
  }, [setValue]);

  // Save non-sensitive data to localStorage on change with debouncing
  useEffect(() => {
    // Don't save if currently submitting or has already submitted
    if (isSubmitting || hasSubmittedRef.current) {
      return;
    }
    
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      try {
        const filtered = filterSensitiveData(formValues);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      } catch (error) {
        console.error('Error saving form data to localStorage:', error);
      }
    }, DEBOUNCE_DELAY);

    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [formValues, isSubmitting]);

  const onSubmit = async (data: FormData) => {
    // Mark as submitted to prevent further localStorage saves
    hasSubmittedRef.current = true;
    
    // Clear any pending debounce timer and localStorage immediately
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    localStorage.removeItem(STORAGE_KEY);
    
    setIsSubmitting(true);
    
    try {
      // Simulate async request
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Log form data to console (excluding password for security)
      console.log('Form submitted successfully!');
      console.log('Form Data:', {
        ...data,
        password: '***HIDDEN***',
        confirmPassword: '***HIDDEN***'
      });
      
      alert('Form submitted successfully! Check the console for details.');
    } catch (error) {
      console.error('Submission error:', error);
      alert('An error occurred during submission. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const experienceValue = watch('experience');

  return (
    <div className="form-page">
      <div className="form-container">
        <h1>User Registration Form</h1>
        <p className="form-description">Please fill out all required fields</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Personal Information Section */}
          <fieldset className="form-section">
            <legend>Personal Information</legend>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">
                  First Name <span className="required">*</span>
                </label>
                <input
                  id="firstName"
                  type="text"
                  {...register('firstName')}
                  className={errors.firstName ? 'error' : ''}
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
              </div>

              <div className="form-group">
                <label htmlFor="lastName">
                  Last Name <span className="required">*</span>
                </label>
                <input
                  id="lastName"
                  type="text"
                  {...register('lastName')}
                  className={errors.lastName ? 'error' : ''}
                  aria-invalid={errors.lastName ? 'true' : 'false'}
                  aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                />
                <div className="error-container" role="alert">
                  {errors.lastName && (
                    <span id="lastName-error" className="error-message">
                      {errors.lastName.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">
                Email <span className="required">*</span>
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className={errors.email ? 'error' : ''}
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
                autoComplete="email"
              />
              <div className="error-container" role="alert">
                {errors.email && (
                  <span id="email-error" className="error-message">
                    {errors.email.message}
                  </span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">
                  Password <span className="required">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  {...register('password')}
                  className={errors.password ? 'error' : ''}
                  aria-invalid={errors.password ? 'true' : 'false'}
                  aria-describedby={errors.password ? 'password-error password-hint' : 'password-hint'}
                  autoComplete="new-password"
                />
                <div className="field-hint" id="password-hint">
                  Must be 8+ characters with uppercase, lowercase, and number
                </div>
                <div className="error-container" role="alert">
                  {errors.password && (
                    <span id="password-error" className="error-message">
                      {errors.password.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">
                  Confirm Password <span className="required">*</span>
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword', {
                    validate: (value) => {
                      const password = getValues('password');
                      return value === password || "Passwords don't match";
                    }
                  })}
                  className={errors.confirmPassword ? 'error' : ''}
                  aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                  aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                  autoComplete="new-password"
                />
                <div className="error-container" role="alert">
                  {errors.confirmPassword && (
                    <span id="confirmPassword-error" className="error-message">
                      {errors.confirmPassword.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="age">
                  Age <span className="required">*</span>
                </label>
                <input
                  id="age"
                  type="number"
                  min="18"
                  max="100"
                  {...register('age', { valueAsNumber: true })}
                  className={errors.age ? 'error' : ''}
                  aria-invalid={errors.age ? 'true' : 'false'}
                  aria-describedby={errors.age ? 'age-error' : undefined}
                />
                <div className="error-container" role="alert">
                  {errors.age && (
                    <span id="age-error" className="error-message">
                      {errors.age.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="country">
                  Country <span className="required">*</span>
                </label>
                <select
                  id="country"
                  {...register('country')}
                  className={errors.country ? 'error' : ''}
                  aria-invalid={errors.country ? 'true' : 'false'}
                  aria-describedby={errors.country ? 'country-error' : undefined}
                >
                  <option value="">Select a country</option>
                  <option value="us">United States</option>
                  <option value="uk">United Kingdom</option>
                  <option value="ca">Canada</option>
                  <option value="au">Australia</option>
                  <option value="il">Israel</option>
                  <option value="de">Germany</option>
                  <option value="fr">France</option>
                  <option value="other">Other</option>
                </select>
                <div className="error-container" role="alert">
                  {errors.country && (
                    <span id="country-error" className="error-message">
                      {errors.country.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </fieldset>

          {/* Gender Section with Custom Radio Buttons */}
          <fieldset className="form-section">
            <legend>
              Gender <span className="required">*</span>
            </legend>
            
            <div className="radio-group" role="radiogroup" aria-describedby={errors.gender ? 'gender-error' : undefined}>
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

              <label className="custom-radio">
                <input
                  type="radio"
                  value="female"
                  {...register('gender')}
                  className="visually-hidden"
                />
                <span className="radio-custom" aria-hidden="true"></span>
                <span className="radio-label">Female</span>
              </label>

              <label className="custom-radio">
                <input
                  type="radio"
                  value="other"
                  {...register('gender')}
                  className="visually-hidden"
                />
                <span className="radio-custom" aria-hidden="true"></span>
                <span className="radio-label">Other</span>
              </label>
            </div>

            <div className="error-container" role="alert">
              {errors.gender && (
                <span id="gender-error" className="error-message">
                  {errors.gender.message}
                </span>
              )}
            </div>
          </fieldset>

          {/* Interests Section with Custom Checkboxes */}
          <fieldset className="form-section">
            <legend>
              Interests <span className="required">*</span>
            </legend>

            <div className="checkbox-group" role="group" aria-describedby={errors.interests ? 'interests-error' : undefined}>
              {['Programming', 'Design', 'Marketing', 'Data Science', 'DevOps'].map((interest) => (
                <label key={interest} className="custom-checkbox">
                  <input
                    type="checkbox"
                    value={interest.toLowerCase().replace(' ', '-')}
                    {...register('interests')}
                    className="visually-hidden"
                  />
                  <span className="checkbox-custom" aria-hidden="true"></span>
                  <span className="checkbox-label">{interest}</span>
                </label>
              ))}
            </div>

            <div className="error-container" role="alert">
              {errors.interests && (
                <span id="interests-error" className="error-message">
                  {errors.interests.message}
                </span>
              )}
            </div>
          </fieldset>

          {/* Experience Section with Range Slider */}
          <fieldset className="form-section">
            <legend>Years of Experience</legend>

            <div className="form-group">
              <label htmlFor="experience">
                Experience: <span className="experience-value">{experienceValue} years</span>
              </label>
              <input
                id="experience"
                type="range"
                min="0"
                max="10"
                step="1"
                {...register('experience', { valueAsNumber: true })}
                className="range-slider"
                aria-valuemin={0}
                aria-valuemax={10}
                aria-valuenow={experienceValue}
                aria-valuetext={`${experienceValue} years`}
              />
              <div className="range-labels">
                <span>0 years</span>
                <span>10+ years</span>
              </div>
            </div>
          </fieldset>

          {/* Bio Section with Textarea */}
          <fieldset className="form-section">
            <legend>About You</legend>

            <div className="form-group">
              <label htmlFor="bio">
                Bio <span className="required">*</span>
              </label>
              <textarea
                id="bio"
                rows={5}
                {...register('bio')}
                className={errors.bio ? 'error' : ''}
                aria-invalid={errors.bio ? 'true' : 'false'}
                aria-describedby={errors.bio ? 'bio-error bio-hint' : 'bio-hint'}
                placeholder="Tell us about yourself..."
              />
              <div className="field-hint" id="bio-hint">
                Write at least 10 characters (max 500)
              </div>
              <div className="error-container" role="alert">
                {errors.bio && (
                  <span id="bio-error" className="error-message">
                    {errors.bio.message}
                  </span>
                )}
              </div>
            </div>
          </fieldset>

          {/* Newsletter and Terms Section */}
          <fieldset className="form-section">
            <legend>Preferences</legend>

            <label className="custom-checkbox">
              <input
                type="checkbox"
                {...register('newsletter')}
                className="visually-hidden"
              />
              <span className="checkbox-custom" aria-hidden="true"></span>
              <span className="checkbox-label">Subscribe to newsletter</span>
            </label>

            <label className="custom-checkbox">
              <input
                type="checkbox"
                {...register('terms')}
                className="visually-hidden"
              />
              <span className="checkbox-custom" aria-hidden="true"></span>
              <span className="checkbox-label">
                I accept the terms and conditions <span className="required">*</span>
              </span>
            </label>

            <div className="error-container" role="alert">
              {errors.terms && (
                <span className="error-message">
                  {errors.terms.message}
                </span>
              )}
            </div>
          </fieldset>

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="submit-button"
              aria-busy={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Form'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
