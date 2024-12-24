import { describe, expect, it, vi } from 'vitest';
import { debounce } from '../debounce';

describe('debounce', () => {
    it('calls the function after the specified wait time', () => {
        vi.useFakeTimers();
        const func = vi.fn();
        const debouncedFunc = debounce(func, 500);

        debouncedFunc();
        expect(func).not.toHaveBeenCalled();

        vi.advanceTimersByTime(500);
        expect(func).toHaveBeenCalled();
    });

    it('does not call the function before the wait time', () => {
        vi.useFakeTimers();
        const func = vi.fn();
        const debouncedFunc = debounce(func, 500);

        debouncedFunc();
        expect(func).not.toHaveBeenCalled();

        vi.advanceTimersByTime(499);
        expect(func).not.toHaveBeenCalled();
    });

    it('calls the function with the correct arguments', () => {
        vi.useFakeTimers();
        const func = vi.fn();
        const debouncedFunc = debounce(func, 500);

        debouncedFunc('arg1', 'arg2');
        vi.advanceTimersByTime(500);
        expect(func).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('preserves the this context', () => {
        vi.useFakeTimers();
        const context = { value: 42 };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const func = vi.fn(function (this: any) {
            return this.value;
        });
        const debouncedFunc = debounce(func.bind(context), 500);

        debouncedFunc();
        vi.advanceTimersByTime(500);
        expect(func).toHaveReturnedWith(42);
    });
});
