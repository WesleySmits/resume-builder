import { getDummyResume } from '@/utils/dummyResume';
import { mount, VueWrapper } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import FormField from '@/components/FormField.vue';
import EducationFields from '@/components/EducationFields.vue';
import { EducationFieldTypes } from '@/enums/educations';

describe('EducationFields.vue', () => {
    const resumeInitialState = getDummyResume();

    function getMountedComponent(): VueWrapper {
        return mount(EducationFields, {
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

    it('renders education fields correctly including pre-filled data', () => {
        const wrapper = getMountedComponent();

        const legend = wrapper.find<HTMLLegendElement>('fieldset#educations legend');
        expect(legend.text()).toBe('Education');

        const button = wrapper.find<HTMLButtonElement>('fieldset#educations button[data-action="add"]');
        expect(button).toBeTruthy();
        button.trigger('click');

        const allFields = wrapper.findAll<HTMLElement>('fieldset#education-0 .form-field');
        const fieldsToTest: string[] = [
            EducationFieldTypes.INSTITUTION + '-0',
            EducationFieldTypes.DEGREE + '-0',
            EducationFieldTypes.FIELD_OF_STUDY + '-0',
            EducationFieldTypes.LOCATION + '-0',
            EducationFieldTypes.START_DATE + '-0',
            EducationFieldTypes.END_DATE + '-0',
            EducationFieldTypes.DESCRIPTION + '-0',
        ];

        const fields = wrapper
            .findAllComponents(FormField)
            .filter((field) => fieldsToTest.includes(field.vm.$props.id));

        expect(allFields.length).toBe(7);
        expect(fields.length).toBe(7);
    });
});
