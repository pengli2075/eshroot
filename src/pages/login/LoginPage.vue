<script setup lang="ts">
    import { computed, onMounted, reactive, ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { storeToRefs } from 'pinia';
    import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
    import {
        ArrowDown,
        Connection,
        Compass,
        Lock,
        Menu,
        Message,
        User,
    } from '@element-plus/icons-vue';
    import { useI18n } from 'vue-i18n';
    import loginBg from '@/assets/images/login_bg.png';
    import loginLogo from '@/assets/images/login_logo.png';
    import { useAppStore } from '@/stores/app';
    import { useAuthStore } from '@/stores/auth';

    type LoginForm = {
        account: string;
        password: string;
        remember: boolean;
    };

    const router = useRouter();
    const route = useRoute();
    const { t } = useI18n();
    const appStore = useAppStore();
    const authStore = useAuthStore();
    const { locale, languageOptions } = storeToRefs(appStore);
    const { loginPageInfo, loadingLoginPageInfo } = storeToRefs(authStore);

    const formRef = ref<FormInstance>();
    const submitting = ref(false);
    const form = reactive<LoginForm>({
        account: '',
        password: '',
        remember: true,
    });

    const rules = computed<FormRules<LoginForm>>(() => ({
        account: [
            {
                required: true,
                message: t('login.requiredAccount'),
                trigger: 'blur',
            },
        ],
        password: [
            {
                required: true,
                message: t('login.requiredPassword'),
                trigger: 'blur',
            },
        ],
    }));
    const pageBackground = computed(() => loginPageInfo.value.loginBackground || loginBg);
    const pageLogo = computed(() => loginPageInfo.value.loginLogo || loginLogo);
    const pageStyle = computed(() => ({
        backgroundImage: `url("${pageBackground.value}")`,
    }));
    const currentLanguageLabel = computed(
        () => languageOptions.value.find((item) => item.value === locale.value)?.label ?? '',
    );

    onMounted(async () => {
        await authStore.fetchLoginPageInfo();

        if (loginPageInfo.value.locale) {
            appStore.setLocale(loginPageInfo.value.locale, { syncServer: false });
        }
    });

    function handleSystemIntro() {
        ElMessage.info(t('login.systemIntroComingSoon'));
    }

    function handleForgotPassword() {
        ElMessage.info(t('login.forgotPasswordComingSoon'));
    }

    function handleOtherLogin(type: string) {
        ElMessage.info(t('login.otherLoginComingSoon', { type }));
    }

    async function handleSubmit() {
        const valid = await formRef.value?.validate().catch(() => false);
        if (!valid) {
            return;
        }

        submitting.value = true;

        try {
            const result = await authStore.login(form);

            if (result.LOGIN_REDIRECT === 'requirePasswordChange') {
                ElMessage.warning(t('login.requirePasswordChange'));
                return;
            }

            if (result.LOGIN_REDIRECT === 'userLoginSecondAuth') {
                ElMessage.warning(t('login.secondAuthRequired'));
                return;
            }

            ElMessage.success(result._EVENT_MESSAGE_ || t('login.success'));
            const redirect =
                typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard';
            router.push(redirect);
        } catch (error) {
            ElMessage.error(error instanceof Error ? error.message : t('login.invalidCredentials'));
        } finally {
            submitting.value = false;
        }
    }
</script>

<template>
    <div class="login-shell">
        <main v-loading="loadingLoginPageInfo" class="login-container" :style="pageStyle">
            <header class="top-wrapper">
                <div class="logo-wrapper">
                    <img class="logo-image" :src="pageLogo" :alt="loginPageInfo.systemName" />
                    <span>{{ loginPageInfo.systemName }}</span>
                </div>

                <nav class="menu-wrapper" aria-label="login page menu">
                    <el-dropdown trigger="click" @command="appStore.setLocale">
                        <button class="menu-action lang-action" type="button">
                            <el-icon><Compass /></el-icon>
                            <span>{{ currentLanguageLabel }}</span>
                            <el-icon><ArrowDown /></el-icon>
                        </button>

                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item
                                    v-for="item in languageOptions"
                                    :key="item.value"
                                    :command="item.value"
                                >
                                    {{ item.label }}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>

                    <span class="menu-divider"></span>

                    <button class="menu-action" type="button" @click="handleSystemIntro">
                        <el-icon><Menu /></el-icon>
                        <span>{{ t('login.systemIntro') }}</span>
                    </button>
                </nav>
            </header>

            <section class="login-block">
                <div class="login-content">
                    <div class="login-title">
                        <h1>{{ t('login.loginButton') }}</h1>
                        <p>{{ t('login.registeredUser') }}</p>
                    </div>

                    <el-form
                        ref="formRef"
                        :model="form"
                        :rules="rules"
                        class="login-form"
                        @submit.prevent
                    >
                        <el-form-item prop="account">
                            <el-input
                                v-model="form.account"
                                :placeholder="t('login.accountPlaceholder')"
                                size="large"
                                @keyup.enter="handleSubmit"
                            >
                                <template #prefix>
                                    <el-icon><User /></el-icon>
                                </template>
                            </el-input>
                        </el-form-item>

                        <el-form-item prop="password">
                            <el-input
                                v-model="form.password"
                                :placeholder="t('login.passwordPlaceholder')"
                                show-password
                                size="large"
                                type="password"
                                @keyup.enter="handleSubmit"
                            >
                                <template #prefix>
                                    <el-icon><Lock /></el-icon>
                                </template>
                            </el-input>
                        </el-form-item>

                        <el-button
                            class="submit-button"
                            :loading="submitting"
                            size="large"
                            type="primary"
                            @click="handleSubmit"
                        >
                            {{ t('login.loginButton') }}
                        </el-button>
                    </el-form>

                    <button class="forgot-password" type="button" @click="handleForgotPassword">
                        {{ t('login.forgotPassword') }}
                    </button>

                    <div class="login-type-wrapper">
                        <div class="login-type-title">
                            <span></span>
                            <em>{{ t('login.otherLoginMethods') }}</em>
                            <span></span>
                        </div>

                        <div class="login-type-icons">
                            <button
                                class="login-type-icon"
                                type="button"
                                @click="handleOtherLogin('message')"
                            >
                                <el-icon><Message /></el-icon>
                            </button>
                            <button
                                class="login-type-icon"
                                type="button"
                                @click="handleOtherLogin('sso')"
                            >
                                <el-icon><Connection /></el-icon>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <footer class="login-footer">
            <span>{{ loginPageInfo.copyrightText }}</span>
            <a v-if="loginPageInfo.companyName" :href="loginPageInfo.companyUrl" rel="noreferrer">
                {{ loginPageInfo.companyName }}
            </a>
        </footer>
    </div>
</template>

<style scoped lang="scss">
    .login-shell {
        min-height: 100vh;
        background: #f6f7f9;
    }

    .login-container {
        min-height: calc(100vh - 70px);
        overflow: auto;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
    }

    .top-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 20px;
    }

    .logo-wrapper {
        display: flex;
        align-items: center;
        min-width: 0;
        margin-left: 50px;
        color: var(--brand-primary);
        font-weight: 700;
        font-size: 28px;
        line-height: 28px;
        white-space: nowrap;
    }

    .logo-image {
        width: 70px;
        height: auto;
        object-fit: contain;
    }

    .logo-wrapper span {
        margin-left: 16px;
    }

    .menu-wrapper {
        display: flex;
        align-items: center;
        margin-right: 10%;
        color: #999;
        font-size: 16px;
    }

    .menu-action {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 0;
        border: 0;
        background: transparent;
        color: inherit;
        font: inherit;
        line-height: 1;
        cursor: pointer;
    }

    .menu-action:hover {
        color: var(--brand-primary);
    }

    .lang-action {
        outline: none;
    }

    .menu-divider {
        width: 1px;
        height: 18px;
        margin: 0 18px;
        background: #c7c7c7;
    }

    .login-block {
        min-height: calc(100vh - 150px);
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-right: 10%;
    }

    .login-content {
        width: 430px;
        padding: 44px 40px 50px;
        border-radius: 10px;
        background: #fff;
        color: var(--brand-primary);
        text-align: center;
        box-shadow: 0 18px 45px rgba(38, 52, 77, 0.08);
    }

    .login-title h1 {
        margin: 0 0 8px;
        color: var(--brand-primary);
        font-weight: 700;
        font-size: 28px;
        line-height: 1.2;
    }

    .login-title p {
        margin: 0 0 36px;
        color: var(--brand-primary);
        font-size: 18px;
    }

    .login-form {
        :deep(.el-form-item) {
            margin-bottom: 20px;
        }

        :deep(.el-input__wrapper) {
            height: 44px;
            border-radius: 0;
            box-shadow: 0 0 0 1px #d6dce3 inset;
        }

        :deep(.el-input__wrapper.is-focus) {
            box-shadow: 0 0 0 1px var(--brand-primary) inset;
        }

        :deep(.el-input__prefix) {
            color: var(--brand-primary);
            font-size: 18px;
        }
    }

    .submit-button {
        width: 100%;
        height: 46px;
        margin-top: 16px;
        border-radius: 3px;
        font-size: 16px;
        letter-spacing: 4px;
    }

    .forgot-password {
        margin-top: 20px;
        padding: 0;
        border: 0;
        background: transparent;
        color: var(--brand-primary);
        font-size: 14px;
        cursor: pointer;
    }

    .login-type-wrapper {
        margin-top: 36px;
    }

    .login-type-title {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        gap: 16px;
        color: #999;
        font-style: normal;
        font-size: 14px;
    }

    .login-type-title span {
        height: 1px;
        background: #edf0f5;
    }

    .login-type-title em {
        font-style: normal;
        white-space: nowrap;
    }

    .login-type-icons {
        display: flex;
        justify-content: center;
        gap: 14px;
        margin-top: 20px;
    }

    .login-type-icon {
        width: 38px;
        height: 38px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #e4e8ef;
        border-radius: 50%;
        background: #fff;
        color: var(--brand-primary);
        font-size: 20px;
        cursor: pointer;
    }

    .login-type-icon:hover {
        border-color: var(--brand-primary);
        box-shadow: 0 8px 20px rgba(22, 140, 255, 0.16);
    }

    .login-footer {
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 14px;
        background: #fff;
        color: #333;
        font-size: 16px;
    }

    .login-footer a {
        color: var(--brand-primary);
        text-decoration: none;
    }

    @media (max-width: 1180px) {
        .logo-wrapper {
            margin-left: 28px;
            font-size: 24px;
        }

        .menu-wrapper {
            margin-right: 28px;
        }

        .login-block {
            padding: 48px 28px;
        }
    }

    @media (max-width: 768px) {
        .login-container {
            min-height: auto;
        }

        .top-wrapper {
            align-items: flex-start;
            gap: 20px;
            padding: 18px 20px 0;
        }

        .logo-wrapper {
            margin-left: 0;
            align-items: flex-start;
            font-size: 20px;
            line-height: 1.25;
            white-space: normal;
        }

        .logo-image {
            width: 56px;
            flex: 0 0 auto;
        }

        .menu-wrapper {
            margin-right: 0;
            font-size: 14px;
        }

        .login-block {
            min-height: calc(100vh - 188px);
            justify-content: center;
            padding: 36px 20px 48px;
        }

        .login-content {
            width: min(100%, 430px);
            padding: 34px 24px 38px;
        }

        .login-footer {
            height: auto;
            min-height: 70px;
            flex-wrap: wrap;
            gap: 8px;
            padding: 16px 20px;
            text-align: center;
            font-size: 14px;
        }
    }
</style>
