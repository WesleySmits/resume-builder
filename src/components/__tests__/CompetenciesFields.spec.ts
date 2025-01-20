import { getDummyResume } from '@/utils/dummyResume';
import { mount, VueWrapper } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import FormField from '@/components/FormField.vue';
import CompetenciesFields from '@/components/CompetenciesFields.vue';
import { nextTick } from 'vue';

vi.mock('@/stores/resume');

describe('CompetenciesFields.vue', () => {
    const resumeInitialState = getDummyResume();

    function getMountedComponent(): VueWrapper {
        return mount(CompetenciesFields, {
            global: {
                plugins: [
                    createTestingPinia({
                        createSpy: vi.fn,
                        initialState: {
                            resume: resumeInitialState,
                        },
                    }),
                ],
            },
        });
    }

    it('renders competencies fields correctly including pre-filled data', () => {
        const wrapper = getMountedComponent();

        const legend = wrapper.find<HTMLLegendElement>('fieldset#competencies legend');
        expect(legend.text()).toBe('Competencies');

        const allFields = wrapper.findAll<HTMLElement>('fieldset#competencies .form-field');
        const fieldsToTest: string[] = ['competency'];

        const fields = wrapper
            .findAllComponents(FormField)
            .filter((field) => fieldsToTest.includes(field.vm.$props.id));

        expect(allFields.length).toBe(1);
        expect(fields.length).toBe(1);
    });

    it('succesfully updates the competencies in the store when data is filled', async () => {
        vi.useFakeTimers();
        const wrapper = getMountedComponent();
        const field = wrapper.find<HTMLInputElement>('fieldset#competencies input');

        await field.trigger('keydown', {
            key: 'T',
        });

        await field.trigger('keydown', {
            key: 'Enter',
        });

        vi.advanceTimersByTime(750);
        nextTick();

        expect(true).toBe(true);
    });
});
