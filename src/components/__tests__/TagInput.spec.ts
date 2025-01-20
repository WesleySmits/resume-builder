import './setupTests';
import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import TagInput from '../TagInput.vue';
import { createTestingPinia } from '@pinia/testing';
import { setupDummyResume } from '@/utils/dummyResume';
import { useResumeStore } from '@/stores/resume';

vi.mock('@/stores/resume');

describe('TagInput.vue', () => {
    const resumeInitialState = setupDummyResume();

    it('renders correctly', () => {
        const wrapper = mount(TagInput, {
            props: {
                modelValue: [],
                id: 'test-id',
                value: '',
            },
        });
        expect(wrapper.find('.tag-input').exists()).toBe(true);
        expect(wrapper.find('input').attributes('id')).toBe('test-id');
    });

    it('adds a tag correctly', async () => {
        const wrapper = mount(TagInput, {
            props: {
                modelValue: [],
                id: 'test-id',
                value: '',
            },
        });
        const input = wrapper.find('input');
        await input.setValue('new tag');
        await input.trigger('keydown.Enter');

        wrapper.vm.$nextTick();

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([['new tag']]);
        expect(wrapper.findAll('.tag').length).toBe(1);
    });

    it('removes a tag correctly', async () => {
        const wrapper = mount(TagInput, {
            props: {
                modelValue: ['existing tag'],
                id: 'test-id',
                value: '',
            },
        });
        await wrapper.find('.remove').trigger('click');
        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([[]]);
        expect(wrapper.findAll('.tag').length).toBe(0);
    });

    it('emits input event correctly', async () => {
        const wrapper = mount(TagInput, {
            props: {
                modelValue: [],
                id: 'test-id',
                value: '',
            },
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
        const input = wrapper.find('input');
        await input.setValue('new tag');
        await input.trigger('keydown', {
            key: 'T',
        });
        await input.trigger('keydown', {
            key: 'Enter',
        });
        expect(wrapper.emitted().input[0]).toEqual([['new tag']]);
    });

    it('emits input event correctly with a fieldType', async () => {
        const store = useResumeStore();

        const wrapper = mount(TagInput, {
            props: {
                modelValue: [],
                id: 'test-id',
                value: '',
                dataList: store.skills.languages,
            },
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
        const input = wrapper.find('input');
        await input.setValue('new tag');
        await input.trigger('input');
        expect(wrapper.emitted().input).toBeUndefined();

        const existingLanguage = resumeInitialState.skills.languages[0];
        await input.setValue(existingLanguage);
        await input.trigger('input');
        expect(wrapper.emitted().input[0]).toEqual([[existingLanguage]]);
    });
});
