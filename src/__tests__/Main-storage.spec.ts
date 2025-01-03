import { describe, it, vi, expect, afterEach, beforeEach } from 'vitest';
import { setActivePinia } from 'pinia';
import { useResumeStore } from '@/stores/resume';
import { nextTick } from 'vue';
import { createdPinia } from '@/pinia.ts';

vi.mock('@/App.vue', () => {
    return {
        default: {
            template: '<div>Mocked App</div>',
        },
    };
});

describe('main.ts', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="app"></div>';
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('should subscribe to the resumeStore and saves data to localStorage', async () => {
        const mockSetItem = vi.spyOn(Storage.prototype, 'setItem');

        await import('../main');

        setActivePinia(createdPinia);

        const resumeStore = useResumeStore();
        resumeStore.updateName({
            displayName: 'New Display Name',
            firstName: 'New First Name',
            lastName: 'New Last Name',
            middleName: 'New Middle Name',
        });

        await nextTick();

        expect(mockSetItem).toHaveBeenCalledTimes(1);
        expect(mockSetItem).toHaveBeenCalledWith('resumeData', JSON.stringify(resumeStore.$state));
    });
});
