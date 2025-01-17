import { getDummyResume } from '@/utils/dummyResume';
import { mount, VueWrapper } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import PersonalProjectFields from '../PersonalProjectFields.vue';
import { createTestingPinia } from '@pinia/testing';
import FormField from '@/components/FormField.vue';
import { PersonalProjectFieldTypes } from '@/enums/personalProjects';

vi.mock('@/stores/resume');

describe('PersonalProjectFields.vue', () => {
    const resumeInitialState = getDummyResume();

    function getMountedComponent(): VueWrapper {
        return mount(PersonalProjectFields, {
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
        expect(legend.text()).toBe('Personal Projects');

        const button = wrapper.find<HTMLButtonElement>('fieldset#personalProjects button[data-action="add"]');
        expect(button).toBeTruthy();
        button.trigger('click');

        const allFields = wrapper.findAll<HTMLElement>('fieldset#personalProject-0 .form-field');
        const fieldsToTest: string[] = [
            PersonalProjectFieldTypes.TITLE + '-0',
            PersonalProjectFieldTypes.SKILLS + '-0',
            PersonalProjectFieldTypes.DESCRIPTION + '-0',
        ];

        const fields = wrapper
            .findAllComponents(FormField)
            .filter((field) => fieldsToTest.includes(field.vm.$props.id));

        expect(allFields.length).toBe(11);
        expect(fields.length).toBe(2);
    });
});
