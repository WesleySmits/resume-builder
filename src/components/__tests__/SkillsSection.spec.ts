import { useResumeStore } from '@/stores/resume';
import { describe, it, expect, vi } from 'vitest';
import SkillsSection from '../ResumeFormSections/SkillsSection.vue';
import { createTestingPinia } from '@pinia/testing';
import { mount, VueWrapper } from '@vue/test-utils';
import { SkillFields } from '@/enums/skills';
import { testFormField } from './utils';
import FormField from '@/components/FormField.vue';

describe('SkillsSection.vue', () => {
    const resumeInitialState: ResumeData = {
        general: {
            name: {
                firstName: 'Jon',
                middleName: '',
                lastName: 'Snow',
                displayName: '',
            },
            contact: {
                email: 'jon.snow@resume-maker.io',
                phone: '123123123',
            },
            achievements: ['Defeated the Night King', 'Knows nothing', 'King in the North'],
        },
        skills: {
            languages: ['HTML', 'CSS', 'JavaScript'],
            frameworks: ['Vue.js'],
            platforms: ['Node.js'],
            methodologies: ['Agile'],
            databases: ['MongoDB'],
            tools: ['Git'],
            operatingSystems: ['MacOS'],
        },
        topSkills: [],
    };

    function getMountedComponent(): VueWrapper {
        return mount(SkillsSection, {
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

    it('renders skill fields correctly including pre-filled data', () => {
        const wrapper = getMountedComponent();

        const fields = wrapper.findAll<HTMLElement>('fieldset:first-of-type .form-field');
        expect(fields.length).toBe(7);

        const inputs = wrapper.findAll<HTMLInputElement>('fieldset:first-of-type .form-field input');
        const labels = wrapper.findAll<HTMLLabelElement>('fieldset:first-of-type .form-field label');
        const helperTexts = wrapper.findAll<HTMLElement>('fieldset:first-of-type .form-field .help-text');

        testFormField(
            inputs[0].element,
            labels[0],
            helperTexts[0],
            SkillFields.PROGRAMMING_LANGUAGES,
            '',
            resumeInitialState.skills.languages.join(','),
            false,
        );

        testFormField(
            inputs[1].element,
            labels[1],
            helperTexts[1],
            SkillFields.FRAMEWORKS,
            '',
            resumeInitialState.skills.frameworks.join(','),
            false,
        );

        testFormField(
            inputs[2].element,
            labels[2],
            helperTexts[2],
            SkillFields.PLATFORMS,
            '',
            resumeInitialState.skills.platforms.join(','),
            false,
        );

        testFormField(
            inputs[3].element,
            labels[3],
            helperTexts[3],
            SkillFields.METHODOLOGIES,
            '',
            resumeInitialState.skills.methodologies.join(','),
            false,
        );

        testFormField(
            inputs[4].element,
            labels[4],
            helperTexts[4],
            SkillFields.OPERATING_SYSTEMS,
            '',
            resumeInitialState.skills.operatingSystems.join(','),
            false,
        );

        testFormField(
            inputs[5].element,
            labels[5],
            helperTexts[5],
            SkillFields.DATABASES,
            '',
            resumeInitialState.skills.databases.join(','),
            false,
        );

        testFormField(
            inputs[6].element,
            labels[6],
            helperTexts[6],
            SkillFields.TOOLS,
            '',
            resumeInitialState.skills.tools.join(','),
            false,
        );
    });

    it('handles skill changes well', async () => {
        const wrapper = getMountedComponent();
        const store = useResumeStore();

        const skillFields = wrapper.findAll<HTMLElement>('fieldset:first-of-type .form-field');
        expect(skillFields.length).toBe(7);

        const fieldsToTest: string[] = [
            SkillFields.PROGRAMMING_LANGUAGES,
            SkillFields.FRAMEWORKS,
            SkillFields.PLATFORMS,
            SkillFields.METHODOLOGIES,
            SkillFields.OPERATING_SYSTEMS,
            SkillFields.DATABASES,
            SkillFields.TOOLS,
        ];

        const fields = wrapper
            .findAllComponents(FormField)
            .filter((field) => fieldsToTest.includes(field.vm.$props.id));
        expect(fields.length).toBe(7);

        expect(store.updateSkillsLanguages).toHaveBeenCalledTimes(0);
        expect(store.updateSkillsFrameworks).toHaveBeenCalledTimes(0);
        expect(store.updateSkillsPlatforms).toHaveBeenCalledTimes(0);
        expect(store.updateSkillsMethodologies).toHaveBeenCalledTimes(0);
        expect(store.updateSkillsOperatingSystems).toHaveBeenCalledTimes(0);
        expect(store.updateSkillsDatabases).toHaveBeenCalledTimes(0);
        expect(store.updateSkillsTools).toHaveBeenCalledTimes(0);

        const data = [['HTML, CSS, JavaScript'], ['Vue.js'], ['Node.js'], ['Agile'], ['MacOS'], ['MongoDB'], ['Git']];

        for (let i = 0; i < fields.length; i++) {
            await fields[i].vm.$emit('valid', data[i]);
            expect(fields[i].emitted().valid).toBeTruthy();
        }

        expect(store.updateSkillsLanguages).toHaveBeenCalledTimes(1);
        expect(store.updateSkillsFrameworks).toHaveBeenCalledTimes(1);
        expect(store.updateSkillsPlatforms).toHaveBeenCalledTimes(1);
        expect(store.updateSkillsMethodologies).toHaveBeenCalledTimes(1);
        expect(store.updateSkillsOperatingSystems).toHaveBeenCalledTimes(1);
        expect(store.updateSkillsDatabases).toHaveBeenCalledTimes(1);
        expect(store.updateSkillsTools).toHaveBeenCalledTimes(1);
    });
});
