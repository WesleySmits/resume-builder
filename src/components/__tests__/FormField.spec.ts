import { DOMWrapper, mount, VueWrapper } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import FormField from '../FormField.vue';

describe('FormField.vue', () => {
    async function checkComponentError(
        wrapper: VueWrapper,
        input: DOMWrapper<HTMLInputElement>,
        value: string | string[] | number,
        valid: boolean,
        isTagInput = false,
    ) {
        await input.setValue(value);

        if (isTagInput) {
            input.trigger('keydown', {
                key: 'Enter',
            });
        }

        vi.advanceTimersByTime(750);
        await wrapper.vm.$nextTick();

        let emitted = wrapper.emitted('valid')?.[0]?.[0];
        if (typeof emitted === 'string' && emitted === '') {
            emitted = true;
        }

        expect(!!emitted).toBe(valid);

        if (valid) {
            expect(wrapper.classes()).not.toContain('form-field--error');
        } else {
            expect(wrapper.classes()).toContain('form-field--error');
        }

        return valid;
    }

    it('renders input field correctly', () => {
        const wrapper = mount(FormField, {
            props: {
                id: 'formField',
                label: 'Form Field',
                placeholder: 'Some data...',
                type: 'text',
                required: true,
                helperText: 'Some helper text',
                errorText: 'Some error text',
                modelValue: 'Some model value',
            },
        });

        const label = wrapper.find('label');
        expect(label.text()).toBe('Form Field');
        expect(label.attributes('for')).toBe('formField');

        const input = wrapper.find('input').element;
        expect(input.id).toBe('formField');
        expect(input.placeholder).toBe('Some data...');
        expect(input.type).toBe('text');
        expect(input.required).toBe(true);
        expect(input.value).toBe('Some model value');
        expect(input.getAttribute('aria-describedby')).toBe('formField-helper');
        expect(input.getAttribute('aria-labelledby')).toBe('formField');
    });

    it('emits an input event with the correct value when input changes', async () => {
        vi.useFakeTimers();

        const wrapper = mount(FormField, {
            props: {
                id: 'formField',
                label: 'Form Field',
                placeholder: 'Some data...',
                type: 'text',
                required: true,
                helperText: 'Some helper text',
                errorText: 'Some error text',
                modelValue: 'Some model value',
            },
        });

        const input = wrapper.find('input');
        const value = 'EMITTED VALUE';

        await input.setValue(value);
        await process.nextTick(() => {});
        vi.advanceTimersByTime(7500);

        expect(wrapper.emitted('update:modelValue')?.[0]).toContain(value);
        expect(wrapper.emitted('valid')?.[0]).toContain(value);
    });

    it('applies the correct class when error prop is true', async () => {
        vi.useFakeTimers();

        const wrapper = mount(FormField, {
            props: {
                id: 'formField',
                label: 'Form Field',
                placeholder: 'Some data...',
                type: 'email',
                required: true,
                helperText: 'Some helper text',
                errorText: 'Some error text',
                modelValue: 'Some model value',
            },
        });

        const input = wrapper.find('input');
        const test1 = await checkComponentError(wrapper, input, 'Not an email address', false);
        const test2 = await checkComponentError(wrapper, input, 'jon.snow@resume-maker.io', true);

        expect(test1).toBe(false);
        expect(test2).toBe(true);
    });

    it('correctly sets an input to empty', async () => {
        vi.useFakeTimers();

        const wrapper = mount(FormField, {
            props: {
                id: 'formField',
                label: 'Form Field',
                placeholder: 'Some data...',
                type: 'email',
                required: false,
                helperText: 'Some helper text',
                errorText: 'Some error text',
                modelValue: 'jon.snow@resume-maker.ai',
            },
        });

        const input = wrapper.find('input');
        const test = await checkComponentError(wrapper, input, '', true);

        expect(test).toBe(true);
    });

    it('correctly renders a textarea', async () => {
        vi.useFakeTimers();

        const wrapper = mount(FormField, {
            props: {
                id: 'formField',
                label: 'Form Field',
                placeholder: 'Some data...',
                type: 'textarea',
                required: false,
                helperText: 'Some helper text',
                errorText: 'Some error text',
                modelValue: 'jon.snow@resume-maker.ai',
            },
        });

        const input = wrapper.find('input');
        const textarea = wrapper.find('textarea');

        expect(input.exists()).toBe(false);
        expect(textarea.exists()).toBe(true);
    });

    it('correctly renders a select', async () => {
        vi.useFakeTimers();

        const wrapper = mount(FormField, {
            props: {
                id: 'formField',
                label: 'Form Field',
                type: 'select',
                required: false,
                helperText: 'Some helper text',
                errorText: 'Some error text',
                modelValue: 'jon.snow@resume-maker.ai',
                options: [
                    { value: '1', text: 'Option 1' },
                    { value: '2', text: 'Option 2' },
                    { value: '3', text: 'Option 3' },
                ],
            },
        });

        const input = wrapper.find('input');
        const select = wrapper.find('select');

        expect(input.exists()).toBe(false);
        expect(select.exists()).toBe(true);
    });

    it('correctly renders a tags input', async () => {
        vi.useFakeTimers();

        const wrapper = mount(FormField, {
            props: {
                id: 'formField',
                label: 'Form Field',
                type: 'tags',
                required: false,
                helperText: 'Some helper text',
                errorText: 'Some error text',
                modelValue: ['Skill 1', 'Skill 2', 'Skill 3'],
            },
        });

        const input = wrapper.find('input');

        expect(input.exists()).toBe(true);
    });

    it('correctly validates a tags input', async () => {
        vi.useFakeTimers();

        const wrapper = mount(FormField, {
            props: {
                id: 'formField',
                label: 'Form Field',
                type: 'tags',
                required: false,
                helperText: 'Some helper text',
                errorText: 'Some error text',
                modelValue: ['Skill 1', 'Skill 2', 'Skill 3'],
            },
        });

        const input = wrapper.find('input');

        const test = await checkComponentError(wrapper, input, ['HTML', 'CSS'], true, true);
        expect(test).toBe(true);
    });

    it('correctly validates a number input', async () => {
        vi.useFakeTimers();

        const wrapper = mount(FormField, {
            props: {
                id: 'formField',
                label: 'Form Field',
                type: 'number',
                required: false,
                helperText: 'Some helper text',
                errorText: 'Some error text',
                modelValue: 7,
            },
        });

        const input = wrapper.find('input');

        const test1 = await checkComponentError(wrapper, input, 'Not a number', false);
        const test2 = await checkComponentError(wrapper, input, 123, true);

        expect(test1).toBe(false);
        expect(test2).toBe(true);
    });

    it('correctly validates a YesNo input', async () => {
        vi.useFakeTimers();

        const wrapper = mount(FormField, {
            props: {
                id: 'formField',
                label: 'Form Field',
                type: 'yesno',
                required: true,
                helperText: 'Some helper text',
                modelValue: false,
            },
        });

        const input = wrapper.find<HTMLInputElement>('input[type="checkbox"]');
        expect(input).toBeTruthy();

        input.element.checked = true;
        input.trigger('input');

        vi.advanceTimersByTime(750);
        await wrapper.vm.$nextTick();

        input.element.checked = true;
        input.trigger('change');
        vi.advanceTimersByTime(750);
        await wrapper.vm.$nextTick();

        const emitted = wrapper.emitted('valid')?.[0]?.[0];
        const emitted2 = wrapper.emitted('valid')?.[1]?.[0];

        expect(emitted).toBeTruthy();
        expect(emitted2).toBeTruthy();
    });

    it('correctly validates a file input', async () => {
        vi.useFakeTimers();

        const wrapper = mount(FormField, {
            props: {
                id: 'formField',
                label: 'Form Field',
                type: 'file',
                required: false,
                helperText: 'Some helper text',
                errorText: 'Some error text',
                modelValue: '',
            },
        });

        const input = wrapper.find<HTMLInputElement>('input[type="file"]');
        const file = new File(['dummy content'], 'image.jpeg', { type: 'image/jpeg' });

        const event = new Event('change', { bubbles: true });
        Object.defineProperty(event, 'target', {
            writable: true,
            value: { files: [file] },
        });
        input.element.dispatchEvent(event);

        await wrapper.vm.$emit('update:modelValue');

        vi.advanceTimersByTime(750);
        await input.trigger('change');
        await wrapper.vm.$nextTick();

        const inputEvent = new Event('input', { bubbles: true });
        input.element.dispatchEvent(inputEvent);
        expect(wrapper.emitted('valid')).toBeTruthy();
    });
});
