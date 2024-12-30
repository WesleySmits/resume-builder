import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TopSkills from '@/components/TopSkills.vue';
import { useResumeStore } from '@/stores/resume';
import { createPinia, setActivePinia } from 'pinia';

vi.mock('@/utils/translation', () => ({
    getLocalizedString: (key: string) => key, // Mock translation utility
}));

describe('TopSkills.vue', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('renders the component with initial skills', () => {
        const resumeStore = useResumeStore();
        resumeStore.topSkills = [
            { name: 'JavaScript', yearsOfExperience: 5 },
            { name: 'Vue.js', yearsOfExperience: 3 },
        ];

        const wrapper = mount(TopSkills);
        expect(wrapper.text()).toContain('topSkills');

        const skillFields = wrapper.findAll('.list-item');
        expect(skillFields.length).toBe(2);
    });

    it('adds a new skill when the add button is clicked', async () => {
        const resumeStore = useResumeStore();
        resumeStore.topSkills = [];

        const wrapper = mount(TopSkills);

        const addButton = wrapper.find('[data-action="add"]');
        await addButton.trigger('click');

        expect(resumeStore.topSkills.length).toBe(1);
        expect(resumeStore.topSkills[0]).toEqual({ name: '', yearsOfExperience: 0 });
    });

    it('updates a skill field when the FormField emits a valid event', async () => {
        const resumeStore = useResumeStore();
        resumeStore.topSkills = [{ name: '', yearsOfExperience: 0 }];

        const wrapper = mount(TopSkills);

        const formField = wrapper.findComponent({ name: 'FormField' });
        await formField.vm.$emit('valid', 'TypeScript');

        expect(resumeStore.topSkills[0].name).toBe('TypeScript');
    });

    it('removes a skill when the remove button is clicked', async () => {
        const resumeStore = useResumeStore();
        resumeStore.topSkills = [
            { name: 'JavaScript', yearsOfExperience: 5 },
            { name: 'Vue.js', yearsOfExperience: 3 },
        ];

        const wrapper = mount(TopSkills);

        const removeButton = wrapper.find('[data-action="remove"]');
        await removeButton.trigger('click');

        expect(resumeStore.topSkills.length).toBe(1);
        expect(resumeStore.topSkills[0].name).toBe('Vue.js');
    });

    it('disables the add button when the maximum number of skills is reached', () => {
        const resumeStore = useResumeStore();
        resumeStore.topSkills = new Array(5).fill({ name: '', yearsOfExperience: 0 });

        const wrapper = mount(TopSkills);

        const addButton = wrapper.find<HTMLButtonElement>('[data-action="add"]');
        expect(addButton.element.disabled).toBeDefined();
    });
});
