import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import SkillsTagInput from '../SkillsTagInput.vue';

describe('SkillsTagInput.vue', () => {
    it('renders correctly', () => {
        const wrapper = mount(SkillsTagInput, {
            props: {
                modelValue: [],
                id: 'test-id',
                idProp: 'test-id-prop',
                value: '',
            },
        });
        expect(wrapper.find('.tag-input').exists()).toBe(true);
        expect(wrapper.find('input').attributes('id')).toBe('test-id-prop');
    });

    it('adds a tag correctly', async () => {
        const wrapper = mount(SkillsTagInput, {
            props: {
                modelValue: [],
                id: 'test-id',
                idProp: 'test-id-prop',
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
        const wrapper = mount(SkillsTagInput, {
            props: {
                modelValue: ['existing tag'],
                id: 'test-id',
                idProp: 'test-id-prop',
                value: '',
            },
        });
        await wrapper.find('.remove').trigger('click');
        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([[]]);
        expect(wrapper.findAll('.tag').length).toBe(0);
    });

    it('emits input event correctly', async () => {
        const wrapper = mount(SkillsTagInput, {
            props: {
                modelValue: [],
                id: 'test-id',
                idProp: 'test-id-prop',
                value: '',
            },
        });
        const input = wrapper.find('input');
        await input.setValue('new tag');
        await input.trigger('input');
        expect(wrapper.emitted().input[0]).toEqual([[]]);
    });
});
