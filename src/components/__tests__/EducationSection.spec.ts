import { mount, VueWrapper } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import EducationSection from '../ResumeFormSections/EducationSection.vue';
import EducationFields from '@/components/EducationFields.vue';
import CertificationFields from '../CertificationFields.vue';
import { createTestingPinia } from '@pinia/testing';
import { getDummyResume } from '@/utils/dummyResume';

describe('EducationSection.vue', () => {
    const resumeInitialState = getDummyResume();

    function getMountedComponent(): VueWrapper {
        return mount(EducationSection, {
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

        expect(wrapper.findComponent(EducationFields).exists()).toBe(true);
        expect(wrapper.findComponent(CertificationFields).exists()).toBe(true);
    });

    it('matches the snapshot', () => {
        const wrapper = getMountedComponent();
        expect(wrapper.html()).toMatchSnapshot();
    });
});
