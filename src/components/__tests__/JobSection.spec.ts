import { mount, VueWrapper } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { getDummyResume } from '@/utils/dummyResume';
import JobSection from '../ResumeFormSections/JobSection.vue';
import JobFields from '../JobFields.vue';
import PersonalProjectFields from '../PersonalProjectFields.vue';

describe('JobSection.vue', () => {
    const resumeInitialState = getDummyResume();

    function getMountedComponent(): VueWrapper {
        return mount(JobSection, {
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

    it('renders correctly', () => {
        const wrapper = getMountedComponent();

        expect(wrapper.exists()).toBe(true);

        expect(wrapper.findComponent(JobFields).exists()).toBe(true);
        expect(wrapper.findComponent(PersonalProjectFields).exists()).toBe(true);
    });

    it('matches the snapshot', () => {
        const wrapper = getMountedComponent();
        expect(wrapper.html()).toMatchSnapshot();
    });
});
