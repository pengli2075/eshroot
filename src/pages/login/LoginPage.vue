<script setup lang="ts">
    import { computed, reactive, ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
    import { useI18n } from 'vue-i18n';
    import { storeToRefs } from 'pinia';
    import { useAppStore } from '@/stores/app';
    import { useAuthStore } from './store';

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

    const formRef = ref<FormInstance>();
    const submitting = ref(false);
    const form = reactive<LoginForm>({
        account: 'admin',
        password: '123456',
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

    async function handleSubmit() {
        const valid = await formRef.value?.validate().catch(() => false);
        if (!valid) {
            return;
        }

        submitting.value = true;

        try {
            await authStore.login(form);
            ElMessage.success(t('login.success'));
            const redirect =
                typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard';
            router.push(redirect);
        } catch {
            ElMessage.error(t('login.invalidCredentials'));
        } finally {
            submitting.value = false;
        }
    }
</script>

<template>
    <div class="login-page">
        <section class="hero-panel">
            <div class="hero-copy">
                <p class="hero-kicker">{{ t('common.appName') }}</p>
                <h1>{{ t('login.title') }}</h1>
                <p class="hero-description">{{ t('login.subtitle') }}</p>
            </div>

            <div class="hero-grid">
                <article class="hero-tip">
                    <span class="tip-label">{{ t('login.helperTitle') }}</span>
                    <p>{{ t('login.helperText') }}</p>
                    <strong>{{ t('login.demoAccount') }}</strong>
                    <strong>{{ t('login.demoPassword') }}</strong>
                </article>
            </div>
        </section>

        <section class="login-card">
            <div class="card-header">
                <h2>{{ t('login.loginButton') }}</h2>
                <el-select
                    :model-value="locale"
                    class="language-select"
                    size="large"
                    @change="appStore.setLocale"
                >
                    <el-option
                        v-for="item in languageOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </div>

            <el-form
                ref="formRef"
                :model="form"
                :rules="rules"
                label-position="top"
                @submit.prevent
            >
                <el-form-item :label="t('login.accountLabel')" prop="account">
                    <el-input
                        v-model="form.account"
                        :placeholder="t('login.accountPlaceholder')"
                        size="large"
                    />
                </el-form-item>

                <el-form-item :label="t('login.passwordLabel')" prop="password">
                    <el-input
                        v-model="form.password"
                        :placeholder="t('login.passwordPlaceholder')"
                        show-password
                        size="large"
                        type="password"
                    />
                </el-form-item>

                <div class="actions-row">
                    <el-checkbox v-model="form.remember">{{ t('login.rememberMe') }}</el-checkbox>
                </div>

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
        </section>
    </div>
</template>

<style scoped lang="scss">
    .login-page {
        min-height: 100vh;
        display: grid;
        grid-template-columns: minmax(320px, 1.15fr) minmax(320px, 0.85fr);
        gap: 28px;
        padding: 32px;
    }

    .hero-panel,
    .login-card {
        background: var(--panel-bg);
        backdrop-filter: blur(20px);
        border: 1px solid var(--panel-border);
        border-radius: 28px;
        box-shadow: var(--shadow-soft);
    }

    .hero-panel {
        position: relative;
        overflow: hidden;
        padding: 48px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background:
            linear-gradient(135deg, rgba(22, 59, 122, 0.95), rgba(37, 99, 235, 0.82)),
            linear-gradient(180deg, rgba(255, 255, 255, 0.06), transparent);
        color: #fff;
    }

    .hero-panel::after {
        content: '';
        position: absolute;
        inset: auto -60px -60px auto;
        width: 220px;
        height: 220px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.12);
        filter: blur(8px);
    }

    .hero-copy {
        position: relative;
        z-index: 1;
        max-width: 520px;
    }

    .hero-kicker {
        margin: 0 0 14px;
        font-size: 14px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        opacity: 0.72;
    }

    .hero-copy h1 {
        margin: 0 0 16px;
        font-size: clamp(2.4rem, 5vw, 4.4rem);
        line-height: 1.04;
    }

    .hero-description {
        margin: 0;
        max-width: 42rem;
        color: rgba(255, 255, 255, 0.84);
        font-size: 1.05rem;
    }

    .hero-grid {
        position: relative;
        z-index: 1;
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 18px;
        margin-top: 32px;
    }

    .hero-tip {
        width: min(100%, 360px);
        display: grid;
        gap: 8px;
        padding: 22px 24px;
        border-radius: 22px;
        background: rgba(255, 255, 255, 0.14);
        border: 1px solid rgba(255, 255, 255, 0.18);
    }

    .tip-label {
        font-size: 0.82rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        opacity: 0.72;
    }

    .hero-tip p {
        margin: 0;
        color: rgba(255, 255, 255, 0.88);
    }

    .login-card {
        padding: 32px;
        align-self: center;
    }

    .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 28px;
    }

    .card-header h2 {
        margin: 0;
        font-size: 1.5rem;
    }

    .language-select {
        width: 140px;
    }

    .actions-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        color: var(--text-secondary);
    }

    .submit-button {
        width: 100%;
        height: 46px;
    }

    @media (max-width: 960px) {
        .login-page {
            grid-template-columns: 1fr;
            padding: 20px;
        }

        .hero-panel {
            min-height: 320px;
            padding: 32px 24px;
        }

        .login-card {
            padding: 24px;
        }
    }
</style>
