import './assets/main.scss';
// 服务式组件需要手动导入样式文件 例如 ElMessage ElMessageBox ElNotification 等
import 'element-plus/theme-chalk/src/message.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import { registerSessionExpiredHandler } from './api/request';
import { i18n } from './i18n';
import { useAuthStore } from './stores/auth';
import router from './router';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// 挂载全局 i18n 实例后，组件中就可以使用 useI18n() 获取 t() 翻译函数。
app.use(i18n);

registerSessionExpiredHandler(() => {
    const authStore = useAuthStore();
    const currentRoute = router.currentRoute.value;

    authStore.clearSession();

    if (currentRoute.path !== '/login') {
        router.replace({
            path: '/login',
            query: {
                redirect: currentRoute.fullPath,
            },
        });
    }
});

app.mount('#app');
