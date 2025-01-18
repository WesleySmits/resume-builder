import { describe, it, expect } from 'vitest';
import { capitalize, toCamelCase } from '../text';

describe('capitalize', () => {
    it('should return an empty string if input is empty', () => {
        expect(capitalize('')).toBe('');
    });

    it('should capitalize a single character', () => {
        expect(capitalize('a')).toBe('A');
        expect(capitalize('A')).toBe('A');
    });

    it('should capitalize the first letter of an all lowercase string', () => {
        expect(capitalize('hello')).toBe('Hello');
    });

    it('should capitalize the first letter and lowercase the rest of an all uppercase string', () => {
        expect(capitalize('HELLO')).toBe('Hello');
    });

    it('should capitalize the first letter and lowercase the rest of a mixed case string', () => {
        expect(capitalize('hElLo')).toBe('Hello');
    });

    it('should handle strings with leading and trailing spaces', () => {
        expect(capitalize('  hello  ')).toBe('  hello  ');
    });

    it('should handle strings with leading and trailing spaces 2', () => {
        expect(capitalize('  Hello  ')).toBe('  hello  ');
    });
});

describe('toCamelCase', () => {
    it('should return an empty string if input is empty', () => {
        expect(toCamelCase('')).toBe('');
    });

    it('should convert a single word to the same string', () => {
        expect(toCamelCase('hello')).toBe('hello');
    });

    it('should convert a dashed word to camel-case', () => {
        expect(toCamelCase('hello-world')).toBe('helloWorld');
    });

    it('should convert a dashed word to camel-case 2', () => {
        expect(toCamelCase('hello-world-again')).toBe('helloWorldAgain');
    });

    it('should convert a slashed word to camel-case', () => {
        expect(toCamelCase('hello/world')).toBe('helloWorld');
    });

    it('should convert a spaced word to camel-case', () => {
        expect(toCamelCase('hello world')).toBe('helloWorld');
    });
});
