import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import App from '../App.vue';
import { createRouter, createWebHistory, RouterView } from 'vue-router';

const mockRouter = createRouter({
    history: createWebHistory(),
    routes: [{ path: '/', component: { template: '<div>Home</div>' } }],
});
describe('App.vue', () => {
    it('renders without crashing', () => {
        const wrapper = mount(App, {
            global: {
                plugins: [mockRouter],
            },
        });
        expect(wrapper.exists()).toBe(true);
    });

    it('contains a RouterView component', () => {
        const wrapper = mount(App, {
            global: {
                plugins: [mockRouter],
            },
        });
        expect(wrapper.findComponent(RouterView).exists()).toBe(true);
    });
});
