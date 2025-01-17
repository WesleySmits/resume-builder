import { mount, VueWrapper } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import AdditionalSection from '../ResumeFormSections/AdditionalSection.vue';
import { createTestingPinia } from '@pinia/testing';
import { getDummyResume } from '@/utils/dummyResume';

describe('AdditionalSection.vue', () => {
    const resumeInitialState = getDummyResume();

    function getMountedComponent(): VueWrapper {
        return mount(AdditionalSection, {
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
    });

    it('renders the correct static content', () => {
        const wrapper = getMountedComponent();

        const heading = wrapper.find('h1');
        expect(heading.exists()).toBe(true);
        expect(heading.text()).toBe('Additional Information');

        const paragraph = wrapper.find('p');
        expect(paragraph.exists()).toBe(true);
        expect(paragraph.text()).toBe('Provide any additional information here.');
    });

    it('matches the snapshot', () => {
        const wrapper = mount(AdditionalSection);
        expect(wrapper.html()).toMatchSnapshot();
    });
});
