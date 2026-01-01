import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources organized by namespace
const resources = {
  en: {
    common: {
      home: 'Home',
      counter: 'Counter',
      register: 'Register',
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
    ns: ['common', 'products'], // Namespaces
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
