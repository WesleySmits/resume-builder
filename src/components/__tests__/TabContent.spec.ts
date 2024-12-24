import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import TabContent from '../TabContent.vue';

describe('TabContent.vue', () => {
    it('renders correctly', () => {
        const wrapper = mount(TabContent, {
            props: {
                activeTab: 'tab1',
            },
        });
        expect(wrapper.exists()).toBe(true);
    });

    it('renders slot content when activeTab is provided', () => {
        const wrapper = mount(TabContent, {
            props: {
                activeTab: 'tab1',
            },
            slots: {
                default: '<div class="slot-content">Slot Content</div>',
            },
        });
        expect(wrapper.find('.slot-content').exists()).toBe(true);
    });

    it('does not render slot content when activeTab is not provided', () => {
        const wrapper = mount(TabContent, {
            props: {
                activeTab: '',
            },
            slots: {
                default: '<div class="slot-content">Slot Content</div>',
            },
        });
        expect(wrapper.find('.slot-content').exists()).toBe(false);
    });
});
