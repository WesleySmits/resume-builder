import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
    define: {
        __VUE_OPTIONS_API__: false,
    },
    esbuild: {
        target: 'esnext',
    },
    plugins: [
        vue(),
        vueDevTools(),
        visualizer({
            filename: './dist/stats.html',
            template: 'treemap',
            open: true,
        }),
    ],
    base: './',
    optimizeDeps: {
        exclude: ['pdfjs-dist'],
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    server: {
        port: 7777,
    },
    preview: {
        port: 7776,
    },
});
