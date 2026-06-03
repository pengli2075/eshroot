import { createI18n } from 'vue-i18n';
import { defaultLocale, getStoredLocale, messages } from '@/locales';

// i18n 是整个应用共用的国际化实例，在 main.ts 中通过 app.use(i18n) 挂载。
export const i18n = createI18n({
    // 关闭 legacy 模式后，组件中可以使用 Composition API 写法：const { t } = useI18n()。
    legacy: false,
    // 当前语言，首次启动时优先读取用户上一次选择的语言。
    locale: getStoredLocale(),
    // fallbackLocale 用于兜底：当当前语言缺少某条文案时，回退到默认语言查找。
    fallbackLocale: defaultLocale,
    messages,
});
