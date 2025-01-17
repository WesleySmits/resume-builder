import { getDummyResume } from '@/utils/dummyResume';
import { mount, VueWrapper } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import CertificationFields from '../CertificationFields.vue';
import { createTestingPinia } from '@pinia/testing';
import { CertificationFieldTypes } from '@/enums/certifications';
import FormField from '@/components/FormField.vue';

describe('CertificationFields.vue', () => {
    const resumeInitialState = getDummyResume();

    function getMountedComponent(): VueWrapper {
        return mount(CertificationFields, {
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

    it('renders certification fields correctly including pre-filled data', () => {
        const wrapper = getMountedComponent();

        const legend = wrapper.find<HTMLLegendElement>('fieldset:first-of-type legend');
        expect(legend.text()).toBe('Certifications');

        const button = wrapper.find<HTMLButtonElement>('fieldset#certifications button[data-action="add"]');
        expect(button).toBeTruthy();
        button.trigger('click');

        const allFields = wrapper.findAll<HTMLElement>('fieldset#certification-0 .form-field');
        const fieldsToTest: string[] = [
            CertificationFieldTypes.TITLE + '-0',
            CertificationFieldTypes.PROVIDER + '-0',
            CertificationFieldTypes.COMPLETED + '-0',
            CertificationFieldTypes.YEAR + '-0',
        ];

        const fields = wrapper
            .findAllComponents(FormField)
            .filter((field) => fieldsToTest.includes(field.vm.$props.id));

        expect(allFields.length).toBe(4);
        expect(fields.length).toBe(4);
    });
});
