import { mount, VueWrapper } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import AdditionalSection from '../ResumeFormSections/AdditionalSection.vue';
import { createTestingPinia } from '@pinia/testing';
import { getDummyResume } from '@/utils/dummyResume';
import LanguageFields from '../LanguageFields.vue';

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

    it('renders the correct components', () => {
        const wrapper = getMountedComponent();
        expect(wrapper.findComponent(LanguageFields).exists()).toBe(true);
    });

    it('matches the snapshot', () => {
        const wrapper = mount(AdditionalSection);
        expect(wrapper.html()).toMatchSnapshot();
    });
});
