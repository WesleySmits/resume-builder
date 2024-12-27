import { mount, VueWrapper } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import TopSkills from '@/components/TopSkills.vue';
import { useResumeStore } from '@/stores/resume';
import { createTestingPinia } from '@pinia/testing';
import FormField from '../FormField.vue';

describe('TopSkills.vue', () => {
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
        topSkills: [
            {
                name: 'JavaScript',
                yearsOfExperience: 1,
            },
            {
                name: 'Vue.js',
                yearsOfExperience: 2,
            },
            {
                name: 'Node.js',
                yearsOfExperience: 3,
            },
        ],
    };

    function getMountedComponent(): VueWrapper {
        return mount(TopSkills, {
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

    it('should add a skill', async () => {
        const wrapper = getMountedComponent();
        const resumeStore = useResumeStore();

        await wrapper.find('button[data-action="add"]').trigger('click');

        expect(resumeStore.addTopSkill).toHaveBeenCalledWith({ name: '', yearsOfExperience: 0 });
    });

    it('should update a skill', async () => {
        const wrapper = getMountedComponent();
        const resumeStore = useResumeStore();

        expect(resumeStore.updateTopSkill).toHaveBeenCalledTimes(0);

        const fields = wrapper.findAllComponents(FormField);
        expect(fields).toHaveLength(6);

        expect(resumeStore.updateTopSkill).toHaveBeenCalledTimes(0);
        await fields[0].vm.$emit('valid', 'TypeScript');
        expect(resumeStore.updateTopSkill).toHaveBeenCalledTimes(1);

        expect(resumeStore.updateTopSkill).toHaveBeenCalledWith(0, { name: 'TypeScript', yearsOfExperience: 1 });
    });

    it('should remove a skill', async () => {
        const wrapper = getMountedComponent();
        const resumeStore = useResumeStore();

        expect(resumeStore.updateTopSkill).toHaveBeenCalledTimes(0);

        const buttons = wrapper.findAll('button[data-action="remove"]');
        expect(buttons).toHaveLength(3);

        expect(resumeStore.removeTopSkill).toHaveBeenCalledTimes(0);
        await buttons[0].trigger('click');
        expect(resumeStore.removeTopSkill).toHaveBeenCalledTimes(1);

        expect(resumeStore.removeTopSkill).toHaveBeenCalledWith(0);
    });

    it('should sort skills', async () => {
        const wrapper = getMountedComponent();
        const resumeStore = useResumeStore();

        expect(resumeStore.updateTopSkill).toHaveBeenCalledTimes(0);

        const button = wrapper.find('button[data-action="sort"]');

        expect(resumeStore.sortTopSkills).toHaveBeenCalledTimes(0);
        button.trigger('click');
        expect(resumeStore.sortTopSkills).toHaveBeenCalledTimes(1);
    });
});
