import en from './en';
import zhCN from './zh_CN';
import zhTW from './zh_TW';

// localStorage 中保存当前语言的 key，i18n 初始化和语言切换都会使用它。
export const localeStorageKey = 'eshroot-locale';

// vue-i18n 的 messages 配置。对象的 key 就是系统内部使用的语言标识。
// 新增语言时，一般需要新增语言包文件，并在这里注册。
export const messages = {
    zh_CN: zhCN,
    zh_TW: zhTW,
    en,
} as const;

// 根据 messages 自动推导语言类型，避免代码里传入不存在的语言 key。
export type AppLocale = keyof typeof messages;

// 默认语言：首次进入系统或本地缓存无效时使用。
export const defaultLocale: AppLocale = 'zh_CN';
