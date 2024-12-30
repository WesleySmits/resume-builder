import { describe, it, vi, expect } from 'vitest';
import { setActivePinia } from 'pinia';
import { useResumeStore } from '@/stores/resume';
import { nextTick } from 'vue';
import '@/main.ts';
import { pinia } from '@/main.ts';

describe('main.ts', () => {
    it('subscribes to the resumeStore and saves data to localStorage', async () => {
        const mockSetItem = vi.spyOn(Storage.prototype, 'setItem');

        await import('../main');
        setActivePinia(pinia);
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
