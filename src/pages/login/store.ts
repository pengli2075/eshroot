import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

const authTokenKey = 'eshroot-token';
const demoAccount = 'admin';
const demoPassword = '123456';

function getStoredToken() {
    if (typeof window === 'undefined') {
        return '';
    }

    return window.localStorage.getItem(authTokenKey) ?? '';
}

export const useAuthStore = defineStore('auth', () => {
    const token = ref(getStoredToken());
    const account = ref(token.value ? demoAccount : '');
    const isAuthenticated = computed(() => Boolean(token.value));

    async function login(payload: { account: string; password: string; remember: boolean }) {
        if (payload.account !== demoAccount || payload.password !== demoPassword) {
            throw new Error('INVALID_CREDENTIALS');
        }

        token.value = `token-${Date.now()}`;
        account.value = payload.account;

        if (payload.remember) {
            window.localStorage.setItem(authTokenKey, token.value);
        } else {
            window.localStorage.removeItem(authTokenKey);
        }
    }

    function logout() {
        token.value = '';
        account.value = '';
        window.localStorage.removeItem(authTokenKey);
    }

    return {
        account,
        token,
        isAuthenticated,
        login,
        logout,
    };
});
