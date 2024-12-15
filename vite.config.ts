import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig({
    esbuild: {
        target: 'esnext', // Use ESNext to support private fields
    },
    plugins: [vue(), vueDevTools()],
    optimizeDeps: {
        exclude: ['pdfjs-dist'],
    },
    build: {
        rollupOptions: {
            external: ['pdfjs-dist'], // Ensure pdfjs-dist isn't bundled or transpiled
            output: {
                format: 'esm', // Ensure ESM compatibility for pdfjs-dist
            },
        },
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
});
