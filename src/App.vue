<script setup lang="ts">
    import { computed } from 'vue';
    import { RouterView } from 'vue-router';
    import { ElConfigProvider } from 'element-plus';
    import en from 'element-plus/es/locale/lang/en';
    import zhCn from 'element-plus/es/locale/lang/zh-cn';
    import zhTw from 'element-plus/es/locale/lang/zh-tw';
    import { storeToRefs } from 'pinia';
    import type { AppLocale } from '@/locales';
    import { useAppStore } from './stores/app';

    const elementLocaleMap = {
        zh_CN: zhCn,
        zh_TW: zhTw,
        en,
    } satisfies Record<AppLocale, typeof zhCn>;

    const appStore = useAppStore();
    const { locale } = storeToRefs(appStore);

    // Element Plus 有自己的组件文案语言包，例如分页、日期选择器、表单校验等。
    // 这里把系统语言 key 映射成 Element Plus 对应的 locale 对象。
    const elementLocale = computed(() => elementLocaleMap[locale.value]);
</script>

<template>
    <!-- 让 Element Plus 组件文案跟随系统语言切换。 -->
    <el-config-provider :locale="elementLocale">
        <RouterView />
    </el-config-provider>
</template>
