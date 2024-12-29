import './setupTests';
import { mount, VueWrapper } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import TopSkills from '@/components/TopSkills.vue';
import { useResumeStore } from '@/stores/resume';
import { createTestingPinia } from '@pinia/testing';
import FormField from '../FormField.vue';
import { createPinia } from 'pinia';
import { nextTick } from 'vue';

interface TopSkillsInstance {
    allSkills: string[];
}

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

    function getMountedComponentWithActualStore(): VueWrapper {
        localStorage.setItem('resumeData', JSON.stringify(resumeInitialState));
        return mount(TopSkills, {
            global: {
                plugins: [createPinia()],
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

    it('should update allSkills when the store changes', async () => {
        const wrapper = getMountedComponentWithActualStore();
        const resumeStore = useResumeStore();

        const instance = wrapper.vm as unknown as TopSkillsInstance;

        expect(instance.allSkills.length).toBe(9);

        resumeStore.updateSkillsDatabases(['MySQL', 'PostgreSQL']);

        await nextTick();
        const testAllSkills = [
            ...resumeStore.skills.languages,
            ...resumeStore.skills.frameworks,
            ...resumeStore.skills.platforms,
            ...resumeStore.skills.methodologies,
            ...resumeStore.skills.operatingSystems,
            ...resumeStore.skills.databases,
            ...resumeStore.skills.tools,
        ];
        expect(testAllSkills.length).toEqual(10);
        expect(instance.allSkills.length).toBe(10);

        expect(1).toBe(1);
    });
});
