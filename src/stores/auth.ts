import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { normalizeLocale } from '@/locales';
import {
    getCurrentUserInfo,
    getLoginPageInfo,
    loginByPassword,
    type CurrentUser,
    type LoginPageInfo,
    type LoginPageInfoResponse,
} from '@/pages/login/api';

const sessionCurrentUserKey = 'eshroot-current-user';
const demoAccount = 'admin';
const demoPassword = '123456';
const fallbackLoginPageInfo: LoginPageInfo = {
    systemName: '环境、健康和安全管理工具套件',
    demoAccount,
    demoPassword,
    copyrightText: '版权所有 © 2010-2026',
    companyName: '上海欧萨数据技术有限公司',
};

function getStoredCurrentUser(): CurrentUser | null {
    if (typeof window === 'undefined') {
        return null;
    }

    const storedCurrentUser = window.sessionStorage.getItem(sessionCurrentUserKey);

    if (!storedCurrentUser) {
        return null;
    }

    try {
        return JSON.parse(storedCurrentUser) as CurrentUser;
    } catch {
        window.sessionStorage.removeItem(sessionCurrentUserKey);
        return null;
    }
}

function normalizeLoginPageInfo(response: LoginPageInfoResponse): LoginPageInfo {
    const customResources = response.serverDomainNameCustomResMap ?? {};

    return {
        ...fallbackLoginPageInfo,
        ...response,
        systemName:
            response.systemName ??
            response.ehsManagementToolSuite ??
            fallbackLoginPageInfo.systemName,
        locale: response.locale ? normalizeLocale(response.locale) : undefined,
        loginLogo:
            response.loginLogo ??
            customResources.SDOMNCRT_MFE_LOGIN_LOGO ??
            customResources.SDOMNCRT_MFE_LOGO,
        loginBackground: response.loginBackground ?? customResources.SDOMNCRT_MFE_BGIMG,
    };
}

export const useAuthStore = defineStore('auth', () => {
    const currentUser = ref<CurrentUser | null>(getStoredCurrentUser());
    const hasCheckedSession = ref(false);
    const loginPageInfo = ref<LoginPageInfo>(fallbackLoginPageInfo);
    const loadingLoginPageInfo = ref(false);
    const isAuthenticated = computed(() => Boolean(currentUser.value));

    async function fetchLoginPageInfo() {
        loadingLoginPageInfo.value = true;

        try {
            loginPageInfo.value = normalizeLoginPageInfo(await getLoginPageInfo());
        } catch {
            loginPageInfo.value = fallbackLoginPageInfo;
        } finally {
            loadingLoginPageInfo.value = false;
        }
    }

    async function login(payload: { account: string; password: string; remember: boolean }) {
        const result = await loginByPassword({
            USERNAME: payload.account,
            PASSWORD: payload.password,
            JavaScriptEnabled: 'Y',
        });

        if (result.LOGIN_REDIRECT === 'requirePasswordChange') {
            return result;
        }

        if (result.LOGIN_REDIRECT === 'userLoginSecondAuth') {
            return result;
        }

        await fetchCurrentUser();

        return result;
    }

    async function fetchCurrentUser() {
        const nextCurrentUser = await getCurrentUserInfo();

        if (!nextCurrentUser || typeof nextCurrentUser !== 'object') {
            clearSession();
            throw new Error('Failed to fetch current user.');
        }

        currentUser.value = nextCurrentUser;
        hasCheckedSession.value = true;
        window.sessionStorage.setItem(sessionCurrentUserKey, JSON.stringify(nextCurrentUser));

        return nextCurrentUser;
    }

    async function ensureAuthenticated() {
        if (currentUser.value && hasCheckedSession.value) {
            return true;
        }

        try {
            await fetchCurrentUser();
            return true;
        } catch {
            clearSession();
            return false;
        }
    }

    function clearSession() {
        currentUser.value = null;
        hasCheckedSession.value = false;
        window.sessionStorage.removeItem(sessionCurrentUserKey);
    }

    function logout() {
        clearSession();
    }

    return {
        currentUser,
        loginPageInfo,
        loadingLoginPageInfo,
        isAuthenticated,
        fetchLoginPageInfo,
        fetchCurrentUser,
        ensureAuthenticated,
        clearSession,
        login,
        logout,
    };
});
