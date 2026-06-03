import { computed } from 'vue';
import { defineStore } from 'pinia';
import { i18n } from '@/i18n';
import { setSessionLocale } from '@/api/locale';
import {
    languageOptions as localeLanguageOptions,
    normalizeLocale,
    saveLocale,
    type AppLocale,
} from '@/locales';

export const useAppStore = defineStore('app', () => {
    // i18n 实例本身就是响应式的语言状态，这里只做一层 store 出口，避免再维护第二份 locale。
    const locale = computed(() => i18n.global.locale.value as AppLocale);
    const languageOptions = computed(() => localeLanguageOptions);

    // 切换语言时先更新前端显示，再通知服务端写入 session。
    // 登录页初始化应用后端语言时，可以传 syncServer: false，避免重复调用保存接口和刷新页面。
    function setLocale(
        nextLocale: string,
        options: { reload?: boolean; syncServer?: boolean } = {},
    ) {
        const normalizedLocale = normalizeLocale(nextLocale);
        i18n.global.locale.value = normalizedLocale;
        saveLocale(normalizedLocale);

        if (options.syncServer === false) {
            return;
        }

        setSessionLocale({ newLocale: normalizedLocale })
            .then(() => {
                if (options.reload !== false) {
                    window.location.reload();
                }
            })
            .catch((error: unknown) => {
                console.warn('Failed to save session locale.', error);
            });
    }

    return {
        locale,
        languageOptions,
        setLocale,
    };
});
