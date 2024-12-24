import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import TabBar from '../TabBar.vue';

describe('TabBar.vue', () => {
    const tabs = [
        { id: 'tab1', name: 'Tab 1' },
        { id: 'tab2', name: 'Tab 2' },
    ];

    it('renders correctly', () => {
        const wrapper = mount(TabBar, {
            props: { tabs },
        });
        expect(wrapper.exists()).toBe(true);
    });

    it('renders tabs based on the tabs prop', () => {
        const wrapper = mount(TabBar, {
            props: { tabs },
        });
        const buttons = wrapper.findAll('button');
        expect(buttons.length).toBe(tabs.length);
        expect(buttons[0].text()).toBe(tabs[0].name);
        expect(buttons[1].text()).toBe(tabs[1].name);
    });

    it('sets the initial active tab correctly', () => {
        const wrapper = mount(TabBar, {
            props: { tabs, initialTab: 'tab2' },
        });
        const activeButton = wrapper.find('button.active');
        expect(activeButton.exists()).toBe(true);
        expect(activeButton.text()).toBe('Tab 2');
    });

    it('updates the active tab and emits the correct event on tab click', async () => {
        const wrapper = mount(TabBar, {
            props: { tabs },
        });
        const buttons = wrapper.findAll('button');
        await buttons[1].trigger('click');
        expect(wrapper.emitted('update:activeTab')).toBeTruthy();
        expect(wrapper.emitted('update:activeTab')![0]).toEqual(['tab2']);
        const activeButton = wrapper.find('button.active');
        expect(activeButton.exists()).toBe(true);
        expect(activeButton.text()).toBe('Tab 2');
    });
});
