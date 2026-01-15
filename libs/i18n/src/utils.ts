/**
 * Check if a language uses right-to-left (RTL) text direction
 * @param lang Language code (e.g., 'en', 'he', 'ar')
 * @returns true if the language is RTL, false otherwise
 */
export function isRtlLang(lang: string): boolean {
  // RTL languages: Hebrew, Arabic, Persian/Farsi, Urdu
  const rtlLanguages = ['he', 'ar', 'fa', 'ur'];
  return rtlLanguages.includes(lang.toLowerCase());
}

/**
 * Get the available languages in the app
 */
export const availableLanguages = [
  { code: 'en', label: 'English' },
  { code: 'he', label: 'עברית' },
] as const;

export type LanguageCode = typeof availableLanguages[number]['code'];
