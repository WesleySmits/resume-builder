import { fileURLToPath } from 'node:url';
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            environment: 'jsdom',
            exclude: [...configDefaults.exclude, 'e2e/**'],
            include: ['src/**/*.spec.ts'],
            root: fileURLToPath(new URL('./', import.meta.url)),
            coverage: {
                reporter: ['text', 'json', 'html'],
                exclude: ['node_modules/', 'src/**/__tests__/', 'src/**/enums/', 'src/**/router/', 'src/**/types/'],
                include: ['src/**/*.ts', 'src/**/*.vue'],
            },
            setupFiles: ['./vitest.setup.ts'],
        },
    }),
);
