import { describe, it, vi, expect, afterEach, beforeEach, type Mock } from 'vitest';
import { createApp, nextTick } from 'vue';

vi.mock('vue', async () => {
    const originalModule = await vi.importActual('vue');
    return {
        ...originalModule,
        createApp: vi.fn(() => ({
            use: vi.fn(),
            mount: vi.fn(),
        })),
    };
});

vi.mock('pinia', () => {
    const originalModule = vi.importActual<typeof import('pinia')>('pinia');
    return {
        ...originalModule,
        createPinia: vi.fn(() => ({
            use: vi.fn(),
        })),
        setActivePinia: vi.fn(),
    };
});

vi.mock('@/stores/resume', () => {
    return {
        useResumeStore: () => {
            return {
                $subscribe: vi.fn(),
                updateName: vi.fn(),
            };
        },
    };
});

describe('main.ts', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="app"></div>';
    });

    afterEach(() => {
        document.body.innerHTML = '';

        vi.restoreAllMocks();
        vi.clearAllMocks();
        vi.resetAllMocks();
    });

    it('should mount the app to the #app div', async () => {
        await nextTick();
        const appDiv = document.getElementById('app');
        expect(appDiv).not.toBeNull();

        await import('../main');
        await nextTick();

        const mockCreateApp = createApp as Mock;
        expect(mockCreateApp).toHaveBeenCalled();
        const mockAppInstance = mockCreateApp.mock.results[0].value;
        expect(mockAppInstance.mount).toHaveBeenCalledWith('#app');

        vi.restoreAllMocks();
    });
});
