import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/pages/login/store';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/dashboard',
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/pages/login/LoginPage.vue'),
            meta: {
                guestOnly: true,
            },
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: () => import('@/pages/dashboard/DashboardPage.vue'),
            meta: {
                requiresAuth: true,
            },
        },
    ],
});

router.beforeEach((to) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        return {
            path: '/login',
            query: {
                redirect: to.fullPath,
            },
        };
    }

    if (to.meta.guestOnly && authStore.isAuthenticated) {
        return '/dashboard';
    }

    return true;
});

export default router;
