import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DarkModeToggle from '@/components/DarkModeToggle.vue';

describe('DarkModeToggle.vue', () => {
    let wrapper: ReturnType<typeof mount>;

    beforeEach(() => {
        localStorage.clear();
        document.documentElement.classList.remove('dark');

        wrapper = mount(DarkModeToggle);
    });

    it('sets the theme to dark mode when toggled on', async () => {
        const toggle = wrapper.find('.dark-mode-toggle');
        await toggle.trigger('change');

        expect(document.documentElement.classList.contains('dark')).toBe(true);
        expect(localStorage.getItem('theme')).toBe('dark');
    });

    it('sets the theme to light mode when toggled off', async () => {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');

        const toggle = wrapper.find('.dark-mode-toggle');
        await toggle.trigger('change');

        expect(document.documentElement.classList.contains('dark')).toBe(false);
        expect(localStorage.getItem('theme')).toBe('light');
    });

    it('respects saved theme in localStorage on mount', () => {
        localStorage.setItem('theme', 'dark');
        wrapper = mount(DarkModeToggle);

        expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('defaults to dark mode if the system prefers dark theme', () => {
        const matchMediaMock = vi.fn().mockReturnValue({ matches: true });
        vi.stubGlobal('matchMedia', matchMediaMock);

        wrapper = mount(DarkModeToggle);

        expect(document.documentElement.classList.contains('dark')).toBe(true);

        vi.unstubAllGlobals();
    });

    it('defaults to light mode if no preference is set', () => {
        wrapper = mount(DarkModeToggle);

        expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
});
