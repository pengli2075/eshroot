import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { i18n } from '@/i18n';
import { defaultLocale, localeStorageKey, messages, type AppLocale } from '@/locales';

// app store 也需要知道初始语言，这样页面上的语言选择框能和 i18n 实例保持一致。
function getInitialLocale(): AppLocale {
    if (typeof window === 'undefined') {
        return defaultLocale;
    }

    const savedLocale = window.localStorage.getItem(localeStorageKey) as AppLocale | null;
    return savedLocale && savedLocale in messages ? savedLocale : defaultLocale;
}

export const useAppStore = defineStore('app', () => {
    // 当前系统语言。页面和 App.vue 都通过这个状态响应式更新。
    const locale = ref<AppLocale>(getInitialLocale());

    // 语言下拉框选项。value 必须和 src/locales/index.ts 中 messages 的 key 一致。
    const languageOptions = computed(() => [
        { label: '简体中文', value: 'zh_CN' },
        { label: '繁體中文', value: 'zh_TW' },
        { label: 'English', value: 'en' },
    ]);

    // 切换语言时需要同时更新三处：
    // 1. Pinia 状态：让页面上的语言选择框和 App.vue 响应式更新。
    // 2. vue-i18n 实例：让 useI18n().t() 读取新的语言包。
    // 3. localStorage：刷新页面后还能保持用户选择。
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
