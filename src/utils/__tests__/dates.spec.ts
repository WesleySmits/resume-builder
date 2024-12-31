import { describe, it, expect, vi, beforeEach } from 'vitest';
import { formatDateToLocale, parseDateFromString } from '../dates';

describe('Utils', () => {
    describe('parseDateFromString', () => {
        it('should correctly parse a valid date string', () => {
            const date = parseDateFromString('2024-08-01');
            expect(date).toBeInstanceOf(Date);
            expect(date.getFullYear()).toBe(2024);
            expect(date.getMonth()).toBe(7);
            expect(date.getDate()).toBe(1);
        });

        it('should throw an error for an invalid date string', () => {
            expect(() => parseDateFromString('invalid-date')).toThrow('Invalid date string: invalid-date');
        });

        it('should throw an error for a partially invalid date string', () => {
            expect(() => parseDateFromString('2024-13-01')).toThrow('Invalid date string: 2024-13-01');
        });

        it('should throw an error for an empty string', () => {
            expect(() => parseDateFromString('')).toThrow('Invalid date string: ');
        });
    });

    describe('formatDateToLocale', () => {
        beforeEach(() => {
            vi.stubGlobal('navigator', { language: 'en-US' });
        });

        it('should format a Date object correctly using the default locale', () => {
            const date = new Date('2024-08-01');
            const result = formatDateToLocale(date);
            expect(result).toBe('Aug 2024');
        });

        it('should format a string date correctly using the default locale', () => {
            const result = formatDateToLocale('2024-08-01');
            expect(result).toBe('Aug 2024');
        });

        it('should format a Date object correctly using a provided locale', () => {
            const date = new Date('2024-08-01');
            const result = formatDateToLocale(date, 'nl-NL');
            expect(result).toBe('aug 2024');
        });

        it('should format a string date correctly using a provided locale', () => {
            const result = formatDateToLocale('2024-08-01', 'nl-NL');
            expect(result).toBe('aug 2024');
        });

        it('should fallback to "en-US" if locale is undefined and navigator.language is unavailable', () => {
            vi.stubGlobal('navigator', { language: undefined });
            const date = new Date('2024-08-01');
            const result = formatDateToLocale(date);
            expect(result).toBe('Aug 2024');
        });

        it('should handle invalid string dates by throwing an error', () => {
            expect(() => formatDateToLocale('invalid-date')).toThrow('Invalid date string: invalid-date');
        });
    });
});
