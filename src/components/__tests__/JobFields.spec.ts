import { getDummyResume } from '@/utils/dummyResume';
import { mount, VueWrapper } from '@vue/test-utils';
import { describe, expect, it, vi, type Mock } from 'vitest';
import JobFields from '../JobFields.vue';
import { createTestingPinia } from '@pinia/testing';
import FormField from '@/components/FormField.vue';
import { JobFieldTypes } from '@/enums/jobs';
import { useResumeStore } from '@/stores/resume';

vi.mock('@/stores/resume');

describe('JobFields.vue', () => {
    const resumeInitialState = getDummyResume();

    function getMountedComponent(): VueWrapper {
        return mount(JobFields, {
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

    it('renders jobs fields correctly including pre-filled data', () => {
        const wrapper = getMountedComponent();

        const legend = wrapper.find<HTMLLegendElement>('fieldset:first-of-type legend');
        expect(legend.text()).toBe('Work Experience');

        const button = wrapper.find<HTMLButtonElement>('fieldset#jobs button[data-action="add"]');
        expect(button).toBeTruthy();
        button.trigger('click');

        const allFields = wrapper.findAll<HTMLElement>('fieldset#job-0 .form-field');
        const fieldsToTest: string[] = [
            JobFieldTypes.COMPANY + '-0',
            JobFieldTypes.LOCATION + '-0',
            JobFieldTypes.ROLE + '-0',
            JobFieldTypes.INDUSTRY + '-0',
            JobFieldTypes.DESCRIPTION + '-0',
            JobFieldTypes.RESPONSIBILITIES + '-0',
            JobFieldTypes.PERIOD + '-0',
            JobFieldTypes.SKILLS + '-0',
        ];

        const fields = wrapper
            .findAllComponents(FormField)
            .filter((field) => fieldsToTest.includes(field.vm.$props.id));

        expect(allFields.length).toBe(15);
        expect(fields.length).toBe(5);
    });

    it('should update responsibilities correctly', async () => {
        const store = useResumeStore();
        const wrapper = getMountedComponent();

        (store.setJobs as Mock).mockReset();

        expect(store.setJobs).not.toHaveBeenCalled();

        const button = wrapper.find<HTMLButtonElement>('fieldset#jobResponsibilities button[data-action="add"]');
        expect(button).toBeTruthy();
        button.trigger('click');

        const field = wrapper.find<HTMLInputElement>('#responsibility-0');
        expect(field).toBeTruthy();

        field.element.value = 'Test responsibility';
        await field.trigger('input');
        await field.trigger('blur');

        expect(store.setJobs).toHaveBeenCalledOnce();
    });
});
