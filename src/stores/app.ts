import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { i18n } from '@/i18n';
import { defaultLocale, localeStorageKey, messages, type AppLocale } from '@/i18n/messages';

function getInitialLocale(): AppLocale {
    if (typeof window === 'undefined') {
        return defaultLocale;
    }

    const savedLocale = window.localStorage.getItem(localeStorageKey) as AppLocale | null;
    return savedLocale && savedLocale in messages ? savedLocale : defaultLocale;
}

export const useAppStore = defineStore('app', () => {
    const locale = ref<AppLocale>(getInitialLocale());

    const languageOptions = computed(() => [
        { label: '中文', value: 'zh-CN' },
        { label: 'English', value: 'en-US' },
    ]);

    function setLocale(nextLocale: AppLocale) {
        locale.value = nextLocale;
        i18n.global.locale.value = nextLocale;
        window.localStorage.setItem(localeStorageKey, nextLocale);
    }

    return {
        locale,
        languageOptions,
        setLocale,
    };
});
