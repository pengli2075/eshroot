import { createI18n } from 'vue-i18n';
import { defaultLocale, localeStorageKey, messages, type AppLocale } from './messages';

function resolveLocale(): AppLocale {
    if (typeof window === 'undefined') {
        return defaultLocale;
    }

    const savedLocale = window.localStorage.getItem(localeStorageKey) as AppLocale | null;
    return savedLocale && savedLocale in messages ? savedLocale : defaultLocale;
}

export const i18n = createI18n({
    legacy: false,
    locale: resolveLocale(),
    fallbackLocale: defaultLocale,
    messages,
});
