import { getDummyResume } from '@/utils/dummyResume';
import { mount, VueWrapper } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import FormField from '@/components/FormField.vue';
import InterestsFields from '@/components/InterestsFields.vue';
import { nextTick } from 'vue';
import { useResumeStore } from '@/stores/resume';

vi.mock('@/stores/resume');

describe('InterestsFields.vue', () => {
    const resumeInitialState = getDummyResume();

    function getMountedComponent(): VueWrapper {
        return mount(InterestsFields, {
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

    it('renders interests fields correctly including pre-filled data', () => {
        const wrapper = getMountedComponent();

        const legend = wrapper.find<HTMLLegendElement>('fieldset#interests legend');
        expect(legend.text()).toBe('Interests');

        const allFields = wrapper.findAll<HTMLElement>('fieldset#interests .form-field');
        const fieldsToTest: string[] = ['interests'];

        const fields = wrapper
            .findAllComponents(FormField)
            .filter((field) => fieldsToTest.includes(field.vm.$props.id));

        expect(allFields.length).toBe(1);
        expect(fields.length).toBe(1);
    });

    it('succesfully updates the interests in the store when data is filled', async () => {
        vi.useFakeTimers();
        const store = useResumeStore();
        const currentInterests = store.interests;
        const wrapper = getMountedComponent();
        const field = wrapper.find<HTMLInputElement>('fieldset#interests input');

        const newTag = 'Breakfast';
        await field.setValue(newTag);

        await field.trigger('keydown', {
            key: 'Enter',
        });

        vi.advanceTimersByTime(750);
        nextTick();

        const newInterests = [...currentInterests, newTag];
        expect(store.setInterests).toHaveBeenCalledWith(newInterests);
    });
});
