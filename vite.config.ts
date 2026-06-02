import { fileURLToPath, URL } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDevTools from 'vite-plugin-vue-devtools';
import { visualizer } from 'rollup-plugin-visualizer';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

function normalizeBase(value: string | undefined) {
    if (!value || value === '/') {
        return '/';
    }

    return `/${value.replace(/^\/+|\/+$/g, '')}/`;
}

function getOutDir(base: string) {
    return base === '/' ? 'dist' : base.replace(/^\/+|\/+$/g, '');
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const base = normalizeBase(env.VITE_APP_BASE);
    const outDir = getOutDir(base);
    const shouldAnalyze = env.ANALYZE === 'true';

    return {
        base: base, // 让打包后的静态资源路径都变成 /mfevue/...
        plugins: [
            vue(),
            vueJsx(),
            AutoImport({
                dts: 'auto-imports.d.ts',
                resolvers: [
                    ElementPlusResolver({
                        importStyle: 'sass',
                    }),
                ],
            }),
            Components({
                dts: 'components.d.ts',
                resolvers: [
                    ElementPlusResolver({
                        importStyle: 'sass',
                    }),
                ],
            }),
            vueDevTools(),
            shouldAnalyze &&
                visualizer({
                    filename: `${outDir}/bundle-analysis.html`,
                    template: 'treemap',
                    gzipSize: true,
                    brotliSize: true,
                    open: true,
                }),
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
        build: {
            outDir: outDir, // 打包输出目录
            rollupOptions: {
                onLog(level, log, handler) {
                    if (
                        log.code === 'INVALID_ANNOTATION' &&
                        log.id?.includes('/node_modules/@vueuse/core/')
                    ) {
                        return;
                    }

                    handler(level, log);
                },
            },
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@use "@/styles/element/index.scss" as *;`,
                },
            },
        },
        server: {
            proxy: {
                '/api': {
                    target: 'http://localhost:8080',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ''),
                },
            },
        },
    };
});
