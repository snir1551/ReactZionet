import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    common: {
      products: 'Products',
      productDetail: 'Product Detail',
      languageSwitch: 'Switch to Hebrew',
      themeSwitch: 'Toggle Dark Mode',
      loading: 'Loading...',
      error: 'Error',
      backToProducts: 'Back to Products',
    },
    products: {
      showing: 'Showing {{count}} products',
      productCount_one: '{{count}} product',
      productCount_other: '{{count}} products',
      image: 'Image',
      title: 'Title',
      price: 'Price',
      category: 'Category',
      actions: 'Actions',
      viewDetails: 'View Details',
      brand: 'Brand',
      stock: 'Stock',
      rating: 'Rating',
      description: 'Description',
      noProductFound: 'Product not found',
    },
  },
  he: {
    common: {
      products: 'מוצרים',
      productDetail: 'פרטי מוצר',
      languageSwitch: 'עבור לאנגלית',
      themeSwitch: 'החלף למצב כהה',
      loading: 'טוען...',
      error: 'שגיאה',
      backToProducts: 'חזור למוצרים',
    },
    products: {
      showing: 'מציג {{count}} מוצרים',
      productCount_one: 'מוצר {{count}}',
      productCount_other: '{{count}} מוצרים',
      image: 'תמונה',
      title: 'כותרת',
      price: 'מחיר',
      category: 'קטגוריה',
      actions: 'פעולות',
      viewDetails: 'צפה בפרטים',
      brand: 'מותג',
      stock: 'מלאי',
      rating: 'דירוג',
      description: 'תיאור',
      noProductFound: 'מוצר לא נמצא',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('app_lang') || 'en',
    fallbackLng: 'en',
    ns: ['common', 'products'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
  });

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('app_lang', lng);
  document.documentElement.dir = lng === 'he' ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
});

document.documentElement.dir = i18n.language === 'he' ? 'rtl' : 'ltr';
document.documentElement.lang = i18n.language;

export default i18n;
