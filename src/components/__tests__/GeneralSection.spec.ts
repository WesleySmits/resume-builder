import { describe, it, expect, vi } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import GeneralSection from '@/components/ResumeFormSections/GeneralSection.vue';
import { NameFields } from '@/enums/name';
import { createTestingPinia } from '@pinia/testing';
import { useResumeStore } from '@/stores/resume';
import { PersonalInfoFields } from '@/enums/personalInfo';
import FormField from '@/components/FormField.vue';
import { AboutFields } from '@/enums/about';
import { testFormField } from './utils';

describe('GeneralSection.vue', () => {
    const resumeInitialState: ResumeData = {
        general: {
            name: {
                firstName: 'Jon',
                middleName: '',
                lastName: 'Snow',
                displayName: '',
            },
            profilePhoto: '',
            region: 'The Wall',
            contact: {
                email: 'jon.snow@resume-maker.io',
                phone: '123123123',
            },
            drivingLicense: 'Car',
            functionTitle: 'Watch Commander',
            achievements: ['Defeated the Night King', 'Knows nothing', 'King in the North'],
        },
        skills: {
            languages: [],
            frameworks: [],
            platforms: [],
            methodologies: [],
            databases: [],
            tools: [],
            operatingSystems: [],
        },
        topSkills: [],
        education: [],
        certifications: [],
    };

    function getMountedComponent(): VueWrapper {
        return mount(GeneralSection, {
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

    describe('Test name fields', () => {
        it('renders name fields correctly including pre-filled data', () => {
            const wrapper = getMountedComponent();

            const nameFields = wrapper.findAll<HTMLElement>('fieldset:first-of-type .form-field');
            expect(nameFields.length).toBe(4);

            const nameInputs = wrapper.findAll<HTMLInputElement>('fieldset:first-of-type .form-field input');
            const nameLabels = wrapper.findAll<HTMLLabelElement>('fieldset:first-of-type .form-field label');
            const nameHelperTexts = wrapper.findAll<HTMLElement>('fieldset:first-of-type .form-field .help-text');

            testFormField(
                nameInputs[0].element,
                nameLabels[0],
                nameHelperTexts[0],
                NameFields.FIRST_NAME,
                'John',
                resumeInitialState.general.name?.firstName,
                true,
            );

            testFormField(nameInputs[1].element, nameLabels[1], nameHelperTexts[1], NameFields.MIDDLE_NAME, 'Robert');

            testFormField(
                nameInputs[2].element,
                nameLabels[2],
                nameHelperTexts[2],
                NameFields.LAST_NAME,
                'Smith',
                resumeInitialState.general.name?.lastName,
                true,
            );

            testFormField(
                nameInputs[3].element,
                nameLabels[3],
                nameHelperTexts[3],
                NameFields.DISPLAY_NAME,
                'Johnny Smith',
            );
        });

        it('handles name changes well', async () => {
            const wrapper = getMountedComponent();
            const store = useResumeStore();

            const nameFields = wrapper
                .findAllComponents(FormField)
                .filter((field) => field.vm.$props.id.includes('Name'));
            expect(nameFields.length).toBe(4);

            expect(store.updateName).toHaveBeenCalledTimes(0);

            const nameData = ['Eddard', '', 'Stark', 'Ned Stark'];
            for (let i = 0; i < nameFields.length; i++) {
                await nameFields[i].vm.$emit('valid', nameData[i]);
                expect(nameFields[i].emitted().valid).toBeTruthy();
                expect(store.updateName).toHaveBeenCalledTimes(i + 1);
            }
        });
    });

    describe('Test personal info fields', () => {
        it('renders personal data fields correctly including pre-filled data', () => {
            const wrapper = getMountedComponent();
            const query = 'fieldset:nth-child(2) .form-field';

            const personalDataFields = wrapper.findAll<HTMLElement>(query);
            expect(personalDataFields.length).toBe(6);

            const inputs = wrapper.findAll<HTMLInputElement>(`${query} input`);
            const labels = wrapper.findAll<HTMLLabelElement>(`${query} label`);
            const helpTexts = wrapper.findAll<HTMLElement>(`${query} .help-text`);

            testFormField(
                inputs[0].element,
                labels[0],
                helpTexts[0],
                PersonalInfoFields.PROFILE_PHOTO,
                '',
                resumeInitialState.general.profilePhoto,
                true,
            );
            testFormField(
                inputs[1].element,
                labels[1],
                helpTexts[1],
                PersonalInfoFields.PHONE_NUMBER,
                '',
                resumeInitialState.general.contact?.phone,
            );
            testFormField(
                inputs[2].element,
                labels[2],
                helpTexts[2],
                PersonalInfoFields.EMAIL_ADDRESS,
                '',
                resumeInitialState.general.contact?.email,
                true,
            );
            testFormField(
                inputs[3].element,
                labels[3],
                helpTexts[3],
                PersonalInfoFields.REGION,
                '',
                resumeInitialState.general.region,
            );
            testFormField(
                inputs[4].element,
                labels[4],
                helpTexts[4],
                PersonalInfoFields.DRIVING_LICENSE,
                '',
                resumeInitialState.general.drivingLicense,
            );
            testFormField(
                inputs[5].element,
                labels[5],
                helpTexts[5],
                PersonalInfoFields.FUNCTION_TITLE,
                '',
                resumeInitialState.general.functionTitle,
                true,
            );
        });

        it('handles personal data changes well', async () => {
            const wrapper = getMountedComponent();
            const store = useResumeStore();

            const fieldsToTest: string[] = [
                PersonalInfoFields.PROFILE_PHOTO,
                PersonalInfoFields.PHONE_NUMBER,
                PersonalInfoFields.EMAIL_ADDRESS,
                PersonalInfoFields.REGION,
                PersonalInfoFields.DRIVING_LICENSE,
                PersonalInfoFields.FUNCTION_TITLE,
            ];

            const fields = wrapper
                .findAllComponents(FormField)
                .filter((field) => fieldsToTest.includes(field.vm.$props.id));
            expect(fields.length).toBe(6);

            expect(store.updateProfilePhoto).toHaveBeenCalledTimes(0);
            expect(store.updateContact).toHaveBeenCalledTimes(0);
            expect(store.updateRegion).toHaveBeenCalledTimes(0);
            expect(store.updateDrivingLicense).toHaveBeenCalledTimes(0);
            expect(store.updateFunctionTitle).toHaveBeenCalledTimes(0);

            const data = [
                'https://www.resume-maker.io/profile-photo.jpg',
                '123456789',
                'jon.snow@resume-maker.io',
                'The North',
                'Truck',
                'King in the North',
            ];
            for (let i = 0; i < fields.length; i++) {
                await fields[i].vm.$emit('valid', data[i]);
                expect(fields[i].emitted().valid).toBeTruthy();
            }

            expect(store.updateProfilePhoto).toHaveBeenCalledTimes(1);
            expect(store.updateContact).toHaveBeenCalledTimes(2);
            expect(store.updateRegion).toHaveBeenCalledTimes(1);
            expect(store.updateDrivingLicense).toHaveBeenCalledTimes(1);
            expect(store.updateFunctionTitle).toHaveBeenCalledTimes(1);
        });
    });

    describe('Test about fields', () => {
        it('renders about fields correctly including pre-filled data', () => {
            const wrapper = getMountedComponent();
            const query = 'fieldset:nth-child(3) .form-field';

            const aboutFields = wrapper.findAll<HTMLElement>(query);
            expect(aboutFields.length).toBe(6);

            const inputs = wrapper.findAll<HTMLInputElement>(`${query} textarea`);
            const labels = wrapper.findAll<HTMLLabelElement>(`${query} label`);
            const helpTexts = wrapper.findAll<HTMLElement>(`${query} .help-text`);

            testFormField(
                inputs[0].element,
                labels[0],
                helpTexts[0],
                AboutFields.INTRODUCTION,
                '',
                resumeInitialState.general.introduction,
                true,
            );
            testFormField(
                inputs[1].element,
                labels[1],
                helpTexts[1],
                AboutFields.ACHIEVEMENT + '1',
                null,
                resumeInitialState.general.achievements[0],
                false,
                'Achievement 1',
                'Enter your first achievement here.',
            );
            testFormField(
                inputs[2].element,
                labels[2],
                helpTexts[2],
                AboutFields.ACHIEVEMENT + '2',
                null,
                resumeInitialState.general.achievements[1],
                false,
                'Achievement 2',
                'Enter your second achievement here.',
            );

            testFormField(
                inputs[3].element,
                labels[3],
                helpTexts[3],
                AboutFields.ACHIEVEMENT + '3',
                null,
                resumeInitialState.general.achievements[2],
                false,
                'Achievement 3',
                'Enter your third achievement here.',
            );

            testFormField(
                inputs[4].element,
                labels[4],
                helpTexts[4],
                AboutFields.COLLEAGUES_DESCRIPTION,
                '',
                resumeInitialState.general.colleaguesDescribe,
                true,
            );
            testFormField(
                inputs[5].element,
                labels[5],
                helpTexts[5],
                AboutFields.COLLEAGUES_SHOULD_KNOW,
                '',
                resumeInitialState.general.colleaguesKnow,
                true,
            );
        });

        it('handles about changes well', async () => {
            const wrapper = getMountedComponent();
            const store = useResumeStore();

            const fieldsToTest: string[] = [
                AboutFields.INTRODUCTION,
                AboutFields.ACHIEVEMENT + '1',
                AboutFields.ACHIEVEMENT + '2',
                AboutFields.ACHIEVEMENT + '3',
                AboutFields.COLLEAGUES_DESCRIPTION,
                AboutFields.COLLEAGUES_SHOULD_KNOW,
            ];

            const fields = wrapper
                .findAllComponents(FormField)
                .filter((field) => fieldsToTest.includes(field.vm.$props.id));
            expect(fields.length).toBe(6);

            expect(store.updateIntroduction).toHaveBeenCalledTimes(0);
            expect(store.updateAchievement).toHaveBeenCalledTimes(0);
            expect(store.updateColleaguesDescribe).toHaveBeenCalledTimes(0);
            expect(store.updateColleaguesKnow).toHaveBeenCalledTimes(0);

            const data = [
                'I am Jon Snow, the King in the North.',
                'I know nothing.',
                'I am the watcher on the walls.',
                'I am the shield that guards the realms of men.',
                'Colleagues describe me as a loyal friend.',
                'Colleagues should know that I am a good listener.',
            ];
            for (let i = 0; i < fields.length; i++) {
                await fields[i].vm.$emit('valid', data[i]);
                expect(fields[i].emitted().valid).toBeTruthy();
            }

            expect(store.updateIntroduction).toHaveBeenCalledTimes(1);
            expect(store.updateAchievement).toHaveBeenCalledTimes(3);
            expect(store.updateColleaguesDescribe).toHaveBeenCalledTimes(1);
            expect(store.updateColleaguesKnow).toHaveBeenCalledTimes(1);
        });
    });
});
