import { getDummyResume } from '@/utils/dummyResume';
import { mount, VueWrapper } from '@vue/test-utils';
import { describe, expect, it, vi, type Mock } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import FormField from '@/components/FormField.vue';
import LanguageFields from '../LanguageFields.vue';
import { LanguageFieldTypes } from '@/enums/language';
import { useResumeStore } from '@/stores/resume';

vi.mock('@/stores/resume');

describe('EducationFields.vue', () => {
    const resumeInitialState = getDummyResume();

    function getMountedComponent(): VueWrapper {
        return mount(LanguageFields, {
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

    it('renders language fields correctly including pre-filled data', () => {
        const wrapper = getMountedComponent();

        const legend = wrapper.find<HTMLLegendElement>('fieldset#languages legend');
        expect(legend.text()).toBe('Languages');

        const allFields = wrapper.findAll<HTMLElement>('fieldset#language-fieldset-0 .form-field');
        const fieldsToTest: string[] = [LanguageFieldTypes.NAME + '-0', LanguageFieldTypes.EXPERIENCE + '-0'];

        const fields = wrapper
            .findAllComponents(FormField)
            .filter((field) => fieldsToTest.includes(field.vm.$props.id));

        expect(allFields.length).toBe(2);
        expect(fields.length).toBe(2);
    });

    it.only('should successfully add a new language', async () => {
        const store = useResumeStore();

        const wrapper = getMountedComponent();
        (store.setLanguages as Mock).mockReset();
        expect(store.setJobs).not.toHaveBeenCalled();

        const button = wrapper.find<HTMLButtonElement>('fieldset#languages button[data-action="add"]');
        expect(button).toBeTruthy();
        await button.trigger('click');

        const allFieldsets = wrapper.findAll<HTMLElement>('fieldset#languages fieldset');
        expect(allFieldsets.length).toBe(2);

        const field = wrapper.find<HTMLInputElement>('#language-0');
        expect(field).toBeTruthy();
        expect(store.setJobs).not.toHaveBeenCalled();

        field.element.value = 'Spanish';
        await field.trigger('input');

        expect(store.setLanguages).toHaveBeenCalled();
    });
});
