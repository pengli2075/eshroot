<script setup lang="ts">
    import { computed } from 'vue';
    import { RouterView } from 'vue-router';
    import { ElConfigProvider } from 'element-plus';
    import en from 'element-plus/es/locale/lang/en';
    import zhCn from 'element-plus/es/locale/lang/zh-cn';
    import { storeToRefs } from 'pinia';
    import { useAppStore } from './stores/app';

    const appStore = useAppStore();
    const { locale } = storeToRefs(appStore);

    const elementLocale = computed(() => (locale.value === 'en-US' ? en : zhCn));
</script>

<template>
    <el-config-provider :locale="elementLocale">
        <RouterView />
    </el-config-provider>
</template>
