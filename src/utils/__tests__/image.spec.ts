import { describe, it, expect, vi } from 'vitest';
import { base64ToUint8Array, roundImage, convertImageToBase64 } from '../image';

describe('base64ToUint8Array', () => {
    it('should convert base64 string to Uint8Array', () => {
        const base64 = 'data:application/octet-stream;base64,SGVsbG8sIFdvcmxkIQ==';
        const expected = new Uint8Array([72, 101, 108, 108, 111, 44, 32, 87, 111, 114, 108, 100, 33]);
        const result = base64ToUint8Array(base64);
        expect(result).toEqual(expected);
    });

    it('should handle empty base64 string', () => {
        const base64 = 'data:application/octet-stream;base64,';
        const expected = new Uint8Array([]);
        const result = base64ToUint8Array(base64);
        expect(result).toEqual(expected);
    });
});

describe('roundImage', () => {
    it('should round the image and return a base64 string', async () => {
        const mockBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA';
        const mockImage: {
            onload: (() => void) | null;
            src: string;
        } = {
            onload: null,
            src: '',
        };
        vi.spyOn(global, 'Image').mockImplementation(() => mockImage as unknown as HTMLImageElement);

        const mockCanvas = {
            width: 0,
            height: 0,
            getContext: vi.fn().mockReturnValue({
                clearRect: vi.fn(),
                beginPath: vi.fn(),
                arc: vi.fn(),
                closePath: vi.fn(),
                clip: vi.fn(),
                drawImage: vi.fn(),
                toDataURL: vi.fn().mockReturnValue('data:image/png;base64,roundedImage'),
            }),
            toDataURL: vi.fn().mockReturnValue('data:image/png;base64,roundedImage'),
        };
        vi.spyOn(document, 'createElement').mockReturnValue(mockCanvas as unknown as HTMLCanvasElement);

        const result = roundImage(mockBase64, 100, 100);

        if (mockImage.onload) {
            mockImage.onload();
        }

        await expect(result).resolves.toBe('data:image/png;base64,roundedImage');
    });
});

describe('convertImageToBase64', () => {
    it('should convert an image file to a base64 string', async () => {
        const mockFile = new File(['dummy content'], 'example.png', { type: 'image/png' });
        const expectedBase64 = 'data:image/png;base64,ZHVtbXkgY29udGVudA==';

        const mockFileReader = {
            readAsDataURL: vi.fn(),
            result: expectedBase64,
            onload: null as ((this: FileReader, ev: ProgressEvent<FileReader>) => never) | null,
            onerror: null as ((this: FileReader, ev: ProgressEvent<FileReader>) => never) | null,
        };

        vi.spyOn(global, 'FileReader').mockImplementation(() => mockFileReader as unknown as FileReader);

        const promise = convertImageToBase64(mockFile);

        if (mockFileReader.onload) {
            mockFileReader.onload.call(
                mockFileReader as unknown as FileReader,
                {
                    target: mockFileReader as unknown as FileReader, // Explicitly cast to FileReader
                } as ProgressEvent<FileReader>,
            );
        }

        await expect(promise).resolves.toBe(expectedBase64);
    });

    it('should handle unexpected errors in the catch block', async () => {
        vi.spyOn(global, 'FileReader').mockImplementation(() => {
            throw new Error('Mocked FileReader error');
        });

        const mockFile = new File(['test content'], 'test.txt', { type: 'text/plain' });

        // Test the function
        await expect(convertImageToBase64(mockFile)).rejects.toThrow('Mocked FileReader error');
    });
});
