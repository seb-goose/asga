// The Contentstack stack only has "en-us" configured as a locale, while the
// site's routes use next-intl codes ("en", "es", ...) - map between them here.
const CONTENTSTACK_LOCALES = {
  en: 'en-us',
};

export function resolveContentstackLocale(locale) {
  return CONTENTSTACK_LOCALES[locale] || locale || 'en-us';
}
