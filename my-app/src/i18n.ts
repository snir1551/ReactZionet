import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources organized by namespace
const resources = {
  en: {
    common: {
      home: 'Home',
      counter: 'Counter',
      register: 'Register',
      form: 'Form',
      products: 'Products',
      about: 'About',
      cart: 'Cart',
      addToCart: 'Add to Cart',
      viewDetails: 'View Details',
      backTo: 'Back to {{page}}',
      loading: 'Loading...',
      error: 'Error',
      somethingWentWrong: 'Something went wrong!',
      tryAgain: 'Try Again',
    },
    form: {
      title: 'User Registration Form',
      description: 'Please fill out all required fields',
      submit: 'Submit Form',
      submitting: 'Submitting...',
      successMessage: 'Form submitted successfully! Check the console for details.',
      errorMessage: 'An error occurred during submission. Please try again.',
      
      // Sections
      personalInfo: 'Personal Information',
      genderSection: 'Gender',
      interestsSection: 'Interests',
      experienceSection: 'Years of Experience',
      aboutSection: 'About You',
      preferencesSection: 'Preferences',
      
      // Fields
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      age: 'Age',
      country: 'Country',
      selectCountry: 'Select a country',
      bio: 'Bio',
      bioPlaceholder: 'Tell us about yourself...',
      experience: 'Experience',
      experienceYears: '{{count}} years',
      
      // Countries
      countries: {
        us: 'United States',
        uk: 'United Kingdom',
        ca: 'Canada',
        au: 'Australia',
        il: 'Israel',
        de: 'Germany',
        fr: 'France',
        other: 'Other',
      },
      
      // Gender options
      gender: {
        male: 'Male',
        female: 'Female',
        other: 'Other',
      },
      
      // Interests
      interests: {
        programming: 'Programming',
        design: 'Design',
        marketing: 'Marketing',
        dataScience: 'Data Science',
        devops: 'DevOps',
      },
      
      // Preferences
      newsletter: 'Subscribe to newsletter',
      terms: 'I accept the terms and conditions',
      
      // Hints
      passwordHint: 'Must be 8+ characters with uppercase, lowercase, and number',
      bioHint: 'Write at least 10 characters (max 500)',
      rangeMin: '0 years',
      rangeMax: '10+ years',
      
      // Validation errors
      errors: {
        firstNameMin: 'First name must be at least 2 characters',
        lastNameMin: 'Last name must be at least 2 characters',
        emailInvalid: 'Invalid email address',
        passwordMin: 'Password must be at least 8 characters',
        passwordUppercase: 'Password must contain at least one uppercase letter',
        passwordLowercase: 'Password must contain at least one lowercase letter',
        passwordNumber: 'Password must contain at least one number',
        passwordMismatch: "Passwords don't match",
        ageMin: 'You must be at least 18 years old',
        ageMax: 'Age must be at most 100',
        countryRequired: 'Please select a country',
        genderRequired: 'Please select a gender',
        interestsMin: 'Please select at least one interest',
        bioMin: 'Bio must be at least 10 characters',
        bioMax: 'Bio must be at most 500 characters',
        termsRequired: 'You must accept the terms and conditions',
      },
    },
    products: {
      catalog: 'Product Catalog',
      showing: 'Showing {{count}} products',
      productCount: '{{count}} product',
      productCount_plural: '{{count}} products',
      search: 'Search products...',
      emptyList: 'No products found',
      category: 'Category',
      price: 'Price',
      title: 'Title',
      image: 'Image',
      actions: 'Actions',
      previous: 'Previous',
      next: 'Next',
      productDetail: 'Product Details',
      description: 'Description',
      searchInfo: 'Use the <strong>search bar</strong> above to find products by name or <em>filter by category</em>.',
      allCategories: 'All Categories',
      clearFilters: 'Clear Filters',
      searchFor: 'for "{{query}}"',
      inCategory: 'in "{{category}}"',
    },
  },
  he: {
    common: {
      home: 'בית',
      counter: 'מונה',
      register: 'הרשמה',
      form: 'טופס',
      products: 'מוצרים',
      about: 'אודות',
      cart: 'עגלה',
      addToCart: 'הוסף לעגלה',
      viewDetails: 'צפה בפרטים',
      backTo: 'חזרה ל{{page}}',
      loading: 'טוען...',
      error: 'שגיאה',
      somethingWentWrong: 'משהו השתבש!',
      tryAgain: 'נסה שוב',
    },
    form: {
      title: 'טופס הרשמת משתמש',
      description: 'אנא מלא את כל השדות הנדרשים',
      submit: 'שלח טופס',
      submitting: 'שולח...',
      successMessage: 'הטופס נשלח בהצלחה! בדוק את הקונסול לפרטים.',
      errorMessage: 'אירעה שגיאה בשליחה. אנא נסה שוב.',
      
      // Sections
      personalInfo: 'מידע אישי',
      genderSection: 'מגדר',
      interestsSection: 'תחומי עניין',
      experienceSection: 'שנות ניסיון',
      aboutSection: 'אודותיך',
      preferencesSection: 'העדפות',
      
      // Fields
      firstName: 'שם פרטי',
      lastName: 'שם משפחה',
      email: 'אימייל',
      password: 'סיסמה',
      confirmPassword: 'אימות סיסמה',
      age: 'גיל',
      country: 'מדינה',
      selectCountry: 'בחר מדינה',
      bio: 'ביוגרפיה',
      bioPlaceholder: 'ספר לנו על עצמך...',
      experience: 'ניסיון',
      experienceYears: '{{count}} שנים',
      
      // Countries
      countries: {
        us: 'ארצות הברית',
        uk: 'בריטניה',
        ca: 'קנדה',
        au: 'אוסטרליה',
        il: 'ישראל',
        de: 'גרמניה',
        fr: 'צרפת',
        other: 'אחר',
      },
      
      // Gender options
      gender: {
        male: 'זכר',
        female: 'נקבה',
        other: 'אחר',
      },
      
      // Interests
      interests: {
        programming: 'תכנות',
        design: 'עיצוב',
        marketing: 'שיווק',
        dataScience: 'מדע הנתונים',
        devops: 'DevOps',
      },
      
      // Preferences
      newsletter: 'הרשמה לניוזלטר',
      terms: 'אני מקבל את התנאים וההגבלות',
      
      // Hints
      passwordHint: 'חייב להיות 8+ תווים עם אותיות גדולות, קטנות ומספר',
      bioHint: 'כתוב לפחות 10 תווים (מקסימום 500)',
      rangeMin: '0 שנים',
      rangeMax: '10+ שנים',
      
      // Validation errors
      errors: {
        firstNameMin: 'שם פרטי חייב להכיל לפחות 2 תווים',
        lastNameMin: 'שם משפחה חייב להכיל לפחות 2 תווים',
        emailInvalid: 'כתובת אימייל לא תקינה',
        passwordMin: 'סיסמה חייבת להכיל לפחות 8 תווים',
        passwordUppercase: 'סיסמה חייבת להכיל לפחות אות גדולה אחת',
        passwordLowercase: 'סיסמה חייבת להכיל לפחות אות קטנה אחת',
        passwordNumber: 'סיסמה חייבת להכיל לפחות ספרה אחת',
        passwordMismatch: 'הסיסמאות אינן תואמות',
        ageMin: 'הגיל המינימלי הוא 18',
        ageMax: 'הגיל המקסימלי הוא 100',
        countryRequired: 'אנא בחר מדינה',
        genderRequired: 'אנא בחר מגדר',
        interestsMin: 'אנא בחר לפחות תחום עניין אחד',
        bioMin: 'ביוגרפיה חייבת להכיל לפחות 10 תווים',
        bioMax: 'ביוגרפיה יכולה להכיל מקסימום 500 תווים',
        termsRequired: 'עליך לקבל את התנאים וההגבלות',
      },
    },
    products: {
      catalog: 'קטלוג מוצרים',
      showing: 'מציג {{count}} מוצרים',
      productCount: 'מוצר {{count}}',
      productCount_plural: '{{count}} מוצרים',
      search: 'חפש מוצרים...',
      emptyList: 'לא נמצאו מוצרים',
      category: 'קטגוריה',
      price: 'מחיר',
      title: 'כותרת',
      image: 'תמונה',
      actions: 'פעולות',
      previous: 'הקודם',
      next: 'הבא',
      productDetail: 'פרטי מוצר',
      description: 'תיאור',
      searchInfo: 'השתמש <strong>בסרגל החיפוש</strong> למעלה כדי למצוא מוצרים לפי שם או <em>סנן לפי קטגוריה</em>.',
      allCategories: 'כל הקטגוריות',
      clearFilters: 'נקה סינונים',
      searchFor: 'עבור "{{query}}"',
      inCategory: 'בקטגוריה "{{category}}"',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('app_lang') || 'en', // Default language or from localStorage
    fallbackLng: 'en',
    ns: ['common', 'products', 'form'], // Namespaces
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // React already escapes
    },
  });

// Update document direction when language changes
i18n.on('languageChanged', (lng) => {
  const dir = i18n.dir(lng);
  document.documentElement.dir = dir;
  document.documentElement.lang = lng;
  localStorage.setItem('app_lang', lng);
});

export default i18n;
