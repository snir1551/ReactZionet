import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../stores/themeStore';
import './FormPage.css';

// Validation schema - will need to use translation in error messages
const createFormSchema = (t: (key: string) => string) => z.object({
  firstName: z.string().min(2, t('form:errors.firstNameMin')),
  lastName: z.string().min(2, t('form:errors.lastNameMin')),
  email: z.email(t('form:errors.emailInvalid')),
  password: z.string().min(8, t('form:errors.passwordMin'))
    .regex(/[A-Z]/, t('form:errors.passwordUppercase'))
    .regex(/[a-z]/, t('form:errors.passwordLowercase'))
    .regex(/[0-9]/, t('form:errors.passwordNumber')),
  confirmPassword: z.string(),
  age: z.number().min(18, t('form:errors.ageMin')).max(100, t('form:errors.ageMax')),
  country: z.string().min(1, t('form:errors.countryRequired')),
  gender: z.enum(['male', 'female', 'other']).optional(),
  interests: z.array(z.string()).min(1, t('form:errors.interestsMin')),
  experience: z.number().min(0).max(10),
  bio: z.string().min(10, t('form:errors.bioMin')).max(500, t('form:errors.bioMax')),
  newsletter: z.boolean(),
  terms: z.boolean().refine(val => val === true, {
    message: t('form:errors.termsRequired')
  })
}).refine(data => data.password === data.confirmPassword, {
  message: t('form:errors.passwordMismatch'),
  path: ['confirmPassword']
}).refine(data => data.gender !== undefined, {
  message: t('form:errors.genderRequired'),
  path: ['gender']
});

// Define FormData type from a sample schema
type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  age: number;
  country: string;
  gender?: 'male' | 'female' | 'other';
  interests: string[];
  experience: number;
  bio: string;
  newsletter: boolean;
  terms: boolean;
};

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
  const { t } = useTranslation(['form', 'common']);
  const { theme } = useThemeStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasSubmittedRef = useRef(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const formSchema = createFormSchema(t);
  
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
      
      alert(t('form:successMessage'));
    } catch (error) {
      console.error('Submission error:', error);
      alert(t('form:errorMessage'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const experienceValue = watch('experience');

  return (
    <div className={`form-page theme-${theme}`}>
      <div className="form-container">
        <h1>{t('form:title')}</h1>
        <p className="form-description">{t('form:description')}</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Personal Information Section */}
          <fieldset className="form-section">
            <legend>{t('form:personalInfo')}</legend>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">
                  {t('form:firstName')} <span className="required">*</span>
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
                  {t('form:lastName')} <span className="required">*</span>
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
                {t('form:email')} <span className="required">*</span>
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
                  {t('form:password')} <span className="required">*</span>
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
                  {t('form:passwordHint')}
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
                  {t('form:confirmPassword')} <span className="required">*</span>
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
                  {t('form:age')} <span className="required">*</span>
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
                  {t('form:country')} <span className="required">*</span>
                </label>
                <select
                  id="country"
                  {...register('country')}
                  className={errors.country ? 'error' : ''}
                  aria-invalid={errors.country ? 'true' : 'false'}
                  aria-describedby={errors.country ? 'country-error' : undefined}
                >
                  <option value="">{t('form:selectCountry')}</option>
                  <option value="us">{t('form:countries.us')}</option>
                  <option value="uk">{t('form:countries.uk')}</option>
                  <option value="ca">{t('form:countries.ca')}</option>
                  <option value="au">{t('form:countries.au')}</option>
                  <option value="il">{t('form:countries.il')}</option>
                  <option value="de">{t('form:countries.de')}</option>
                  <option value="fr">{t('form:countries.fr')}</option>
                  <option value="other">{t('form:countries.other')}</option>
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
              {t('form:genderSection')} <span className="required">*</span>
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
                <span className="radio-label">{t('form:gender.male')}</span>
              </label>

              <label className="custom-radio">
                <input
                  type="radio"
                  value="female"
                  {...register('gender')}
                  className="visually-hidden"
                />
                <span className="radio-custom" aria-hidden="true"></span>
                <span className="radio-label">{t('form:gender.female')}</span>
              </label>

              <label className="custom-radio">
                <input
                  type="radio"
                  value="other"
                  {...register('gender')}
                  className="visually-hidden"
                />
                <span className="radio-custom" aria-hidden="true"></span>
                <span className="radio-label">{t('form:gender.other')}</span>
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
              {t('form:interestsSection')} <span className="required">*</span>
            </legend>

            <div className="checkbox-group" role="group" aria-describedby={errors.interests ? 'interests-error' : undefined}>
              {[{key: 'programming', value: 'programming'}, {key: 'design', value: 'design'}, {key: 'marketing', value: 'marketing'}, {key: 'dataScience', value: 'data-science'}, {key: 'devops', value: 'devops'}].map((interest) => (
                <label key={interest.value} className="custom-checkbox">
                  <input
                    type="checkbox"
                    value={interest.value}
                    {...register('interests')}
                    className="visually-hidden"
                  />
                  <span className="checkbox-custom" aria-hidden="true"></span>
                  <span className="checkbox-label">{t(`form:interests.${interest.key}`)}</span>
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
            <legend>{t('form:experienceSection')}</legend>

            <div className="form-group">
              <label htmlFor="experience">
                {t('form:experience')}: <span className="experience-value">{t('form:experienceYears', { count: experienceValue })}</span>
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
                aria-valuetext={t('form:experienceYears', { count: experienceValue })}
              />
              <div className="range-labels">
                <span>{t('form:rangeMin')}</span>
                <span>{t('form:rangeMax')}</span>
              </div>
            </div>
          </fieldset>

          {/* Bio Section with Textarea */}
          <fieldset className="form-section">
            <legend>{t('form:aboutSection')}</legend>

            <div className="form-group">
              <label htmlFor="bio">
                {t('form:bio')} <span className="required">*</span>
              </label>
              <textarea
                id="bio"
                rows={5}
                {...register('bio')}
                className={errors.bio ? 'error' : ''}
                aria-invalid={errors.bio ? 'true' : 'false'}
                aria-describedby={errors.bio ? 'bio-error bio-hint' : 'bio-hint'}
                placeholder={t('form:bioPlaceholder')}
              />
              <div className="field-hint" id="bio-hint">
                {t('form:bioHint')}
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
            <legend>{t('form:preferencesSection')}</legend>

            <label className="custom-checkbox">
              <input
                type="checkbox"
                {...register('newsletter')}
                className="visually-hidden"
              />
              <span className="checkbox-custom" aria-hidden="true"></span>
              <span className="checkbox-label">{t('form:newsletter')}</span>
            </label>

            <label className="custom-checkbox">
              <input
                type="checkbox"
                {...register('terms')}
                className="visually-hidden"
              />
              <span className="checkbox-custom" aria-hidden="true"></span>
              <span className="checkbox-label">
                {t('form:terms')} <span className="required">*</span>
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
              {isSubmitting ? t('form:submitting') : t('form:submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
