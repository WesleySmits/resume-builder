import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig({
    define: {
        __VUE_OPTIONS_API__: false,
    },
    esbuild: {
        target: 'esnext', // Use ESNext to support private fields
    },
    plugins: [vue(), vueDevTools()],
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
