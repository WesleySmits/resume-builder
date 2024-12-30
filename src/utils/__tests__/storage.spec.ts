import { describe, it, vi, expect, afterEach } from 'vitest';
import { loadResumeData } from '@/utils/resume/storage';

describe('loadResumeData', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('returns undefined when no data is in localStorage', () => {
        const mockGetItem = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

        const result = loadResumeData();

        expect(mockGetItem).toHaveBeenCalledWith('resumeData');
        expect(result).toBeUndefined();
    });

    it('returns parsed data when localStorage contains valid JSON', () => {
        const mockData = {
            general: { name: { firstName: 'John', lastName: 'Doe' } },
            skills: {},
            topSkills: [],
        };
        const mockGetItem = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify(mockData));

        const result = loadResumeData();

        expect(mockGetItem).toHaveBeenCalledWith('resumeData');
        expect(result).toEqual(mockData);
    });

    it('returns undefined and logs an error when localStorage contains invalid JSON', () => {
        const mockGetItem = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('invalid-json');
        const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

        const result = loadResumeData();

        expect(mockGetItem).toHaveBeenCalledWith('resumeData');
        expect(result).toBeUndefined();
        expect(mockConsoleError).toHaveBeenCalledWith(
            'Failed to parse resume data from localStorage:',
            expect.any(SyntaxError),
        );
    });
});
