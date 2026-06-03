import './assets/main.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import { i18n } from './i18n';
import router from './router';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// 挂载全局 i18n 实例后，组件中就可以使用 useI18n() 获取 t() 翻译函数。
app.use(i18n);

app.mount('#app');
