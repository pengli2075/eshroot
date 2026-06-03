<script setup lang="ts">
    import { useRouter } from 'vue-router';
    import { useI18n } from 'vue-i18n';
    import { storeToRefs } from 'pinia';
    import { useAppStore } from '@/stores/app';
    import { useAuthStore } from '@/stores/auth';

    const router = useRouter();
    const { t } = useI18n();
    const appStore = useAppStore();
    const authStore = useAuthStore();
    const { currentUser } = storeToRefs(authStore);
    const { locale, languageOptions } = storeToRefs(appStore);

    function logout() {
        authStore.logout();
        router.push('/login');
    }

    const learningCards = [{ key: 'router' }, { key: 'pinia' }, { key: 'request' }] as const;
</script>

<template>
    <div class="dashboard-page">
        <header class="topbar">
            <div>
                <p class="eyebrow">{{ t('common.appName') }}</p>
                <h1>{{ t('dashboard.title') }}</h1>
                <p class="welcome">{{ t('dashboard.welcome') }}</p>
            </div>

            <div class="toolbar">
                <el-select
                    :model-value="locale"
                    class="toolbar-select"
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
                <el-button plain size="large" @click="logout">{{ t('common.logout') }}</el-button>
            </div>
        </header>

        <section class="hero-card">
            <div>
                <span class="status-pill">
                    {{ currentUser?.userName || currentUser?.userLoginId }}
                </span>
                <h2>{{ t('dashboard.summaryTitle') }}</h2>
            </div>
        </section>

        <section class="card-grid">
            <article v-for="item in learningCards" :key="item.key" class="learning-card">
                <h3>{{ t(`dashboard.cards.${item.key}.title`) }}</h3>
                <p>{{ t(`dashboard.cards.${item.key}.description`) }}</p>
            </article>
        </section>
    </div>
</template>

<style scoped lang="scss">
    .dashboard-page {
        min-height: 100vh;
        padding: 28px;
    }

    .topbar,
    .hero-card,
    .learning-card {
        background: var(--panel-bg);
        border: 1px solid var(--panel-border);
        border-radius: 24px;
        box-shadow: var(--shadow-soft);
    }

    .topbar {
        display: flex;
        justify-content: space-between;
        gap: 24px;
        padding: 28px;
    }

    .eyebrow {
        margin: 0 0 8px;
        color: var(--brand-primary);
        font-size: 0.84rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
    }

    .topbar h1,
    .hero-card h2,
    .learning-card h3 {
        margin: 0;
    }

    .welcome {
        margin: 12px 0 0;
        color: var(--text-secondary);
    }

    .toolbar {
        display: flex;
        align-items: flex-start;
        gap: 12px;
    }

    .toolbar-select {
        width: 140px;
    }

    .hero-card {
        margin-top: 24px;
        padding: 28px;
        background:
            linear-gradient(135deg, rgba(37, 99, 235, 0.12), rgba(14, 165, 233, 0.08)),
            var(--panel-bg);
    }

    .status-pill {
        display: inline-flex;
        margin-bottom: 14px;
        padding: 6px 10px;
        border-radius: 999px;
        background: var(--brand-soft);
        color: var(--brand-deep);
        font-size: 0.9rem;
        font-weight: 600;
    }

    .card-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 20px;
        margin-top: 24px;
    }

    .learning-card {
        padding: 24px;
    }

    .learning-card p {
        margin: 12px 0 0;
        color: var(--text-secondary);
    }

    @media (max-width: 960px) {
        .dashboard-page {
            padding: 20px;
        }

        .topbar {
            flex-direction: column;
        }

        .toolbar {
            align-items: stretch;
            flex-direction: column;
        }

        .toolbar-select {
            width: 100%;
        }

        .card-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
