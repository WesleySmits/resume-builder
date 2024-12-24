import { mount } from '@vue/test-utils';
import ResumeForm from '../ResumeForm.vue';
import { describe, expect, it } from 'vitest';

describe('ResumeForm.vue', () => {
    it('renders the slot content', () => {
        const wrapper = mount(ResumeForm, {
            slots: {
                default: '<div class="slot-content">Slot Content</div>',
            },
        });
        expect(wrapper.find('.slot-content').exists()).toBe(true);
        expect(wrapper.find('.slot-content').text()).toBe('Slot Content');
    });

    it('prevents form submission', async () => {
        const wrapper = mount(ResumeForm);
        const form = wrapper.find('form');
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        form.element.dispatchEvent(submitEvent);
        await wrapper.vm.$nextTick();
        expect(submitEvent.defaultPrevented).toBe(true);
    });
});
