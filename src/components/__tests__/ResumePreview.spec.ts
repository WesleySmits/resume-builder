import { describe, it, expect, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import ResumePreview from '@/components/ResumePreview.vue';
import { createTestingPinia } from '@pinia/testing';
import { useResumeStore } from '@/stores/resume';
import { generateResume } from '@/utils/resume/resume';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.min.mjs';
import './setupTests';
import { type Ref } from 'vue';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { getDummyResume } from '@/utils/dummyResume';

vi.mock('pdfjs-dist/build/pdf.min.mjs', () => ({
    GlobalWorkerOptions: { workerSrc: '' },
    getDocument: vi.fn().mockReturnValue({
        promise: Promise.resolve({
            numPages: 3,
            getPage: vi.fn().mockReturnValue(
                Promise.resolve({
                    render: vi.fn().mockReturnValue({
                        promise: Promise.resolve(),
                    }),
                    getViewport: vi.fn().mockReturnValue({ width: 100, height: 100 }),
                }),
            ),
        }),
    }),
}));

vi.mock('@/utils/resume/Page', () => ({
    getLocalizedString: vi.fn().mockReturnValue('Resume Preview'),
}));

vi.mock('@/utils/resume/resume', () => ({
    generateResume: vi.fn().mockResolvedValue(new Uint8Array()),
    loadResumeData: vi.fn().mockReturnValue({}),
}));

interface ResumePreviewInstance {
    pageCount: Ref<number>;
    pageNum: Ref<number>;
    renderPDF: () => Promise<void>;
    prevPage: () => void;
    nextPage: () => void;
}

describe('ResumePreview.vue', () => {
    const resumeInitialState = getDummyResume();

    it('renders the component', async () => {
        const wrapper = mount(ResumePreview, {
            global: {
                plugins: [
                    createTestingPinia({
                        createSpy: vi.fn,
                        initialState: {
                            resume: resumeInitialState,
                        },
                    }),
                ],
            },
        });

        await wrapper.vm.$nextTick();
        expect(wrapper.find('h2').text()).toBe('Resume Preview');
    });

    it('renders PDF and navigates pages', async () => {
        const mockPdf = {
            numPages: 5,
            getPage: vi.fn().mockResolvedValue({
                getViewport: vi.fn().mockReturnValue({ width: 100, height: 100, scale: 1.5 }),
                render: vi.fn().mockReturnValue({ promise: Promise.resolve() }),
            }),
        };

        vi.spyOn(pdfjsLib, 'getDocument').mockReturnValue({
            promise: Promise.resolve(mockPdf as unknown as PDFDocumentProxy),
        } as never);

        const wrapper = mount(ResumePreview, {
            global: {
                plugins: [
                    createTestingPinia({
                        createSpy: vi.fn,
                        initialState: {
                            resume: resumeInitialState,
                        },
                    }),
                ],
            },
        });

        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();

        const instance = wrapper.vm as unknown as ResumePreviewInstance;

        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();

        expect(instance.pageCount).toBe(5);
        expect(instance.pageNum).toBe(1);

        const previousButton = wrapper.find<HTMLButtonElement>('button:nth-of-type(1)');
        const nextButton = wrapper.find<HTMLButtonElement>('button:nth-of-type(2)');

        expect(previousButton.exists()).toBe(true);
        expect(nextButton.exists()).toBe(true);

        await nextButton.element.dispatchEvent(new Event('click'));
        expect(instance.pageNum).toBe(2);

        await nextButton.element.dispatchEvent(new Event('click'));
        expect(instance.pageNum).toBe(3);

        await nextButton.element.dispatchEvent(new Event('click'));
        expect(instance.pageNum).toBe(4);

        await nextButton.element.dispatchEvent(new Event('click'));
        expect(instance.pageNum).toBe(5);
        expect(nextButton.element.disabled).toBeTruthy();

        await previousButton.element.dispatchEvent(new Event('click'));
        await previousButton.element.dispatchEvent(new Event('click'));
        await previousButton.element.dispatchEvent(new Event('click'));
        await previousButton.element.dispatchEvent(new Event('click'));
        expect(instance.pageNum).toBe(1);
        expect(previousButton.element.disabled).toBeTruthy();
        expect(nextButton.element.disabled).toBeFalsy();
    });

    it('re-renders PDF when resume changes', async () => {
        vi.mocked(generateResume).mockReset();

        const mockPdf = {
            numPages: 5,
            getPage: vi.fn().mockResolvedValue({
                getViewport: vi.fn().mockReturnValue({ width: 100, height: 100, scale: 1.5 }),
                render: vi.fn().mockReturnValue({ promise: Promise.resolve() }),
            }),
        };

        vi.spyOn(pdfjsLib, 'getDocument').mockReturnValue({
            promise: Promise.resolve(mockPdf as unknown as PDFDocumentProxy),
        } as never);

        const wrapper = mount(ResumePreview, {
            global: {
                plugins: [
                    createTestingPinia({
                        createSpy: vi.fn,
                        initialState: {
                            resume: resumeInitialState,
                        },
                    }),
                ],
            },
        });

        const resumeStore = useResumeStore();

        expect(generateResume).toHaveBeenCalledTimes(1);

        resumeStore.general.name.firstName = 'Arya';
        await wrapper.vm.$nextTick();

        expect(generateResume).toHaveBeenCalledTimes(2);
    });

    it('should throw an error when PDF generation fails', async () => {
        console.error = vi.fn();
        expect(console.error).toHaveBeenCalledTimes(0);

        vi.spyOn(pdfjsLib, 'getDocument').mockReturnValue({
            promise: Promise.resolve(),
        } as never);

        const wrapper = mount(ResumePreview, {
            global: {
                plugins: [
                    createTestingPinia({
                        createSpy: vi.fn,
                        initialState: {
                            resume: resumeInitialState,
                        },
                    }),
                ],
            },
        });

        const instance = wrapper.vm as unknown as ResumePreviewInstance;
        await expect(instance.renderPDF()).rejects.toThrowError();

        // mock console.error
        // const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(console.error).toHaveBeenCalledTimes(3);

        const resumeStore = useResumeStore();
        resumeStore.general.name.firstName = 'Arya';
        await wrapper.vm.$nextTick();

        await flushPromises();

        expect(console.error).toHaveBeenCalledTimes(5);
    });

    it('should not follow the previous page when the current page is 1', async () => {
        const mockPdf = {
            numPages: 5,
            getPage: vi.fn().mockResolvedValue({
                getViewport: vi.fn().mockReturnValue({ width: 100, height: 100, scale: 1.5 }),
                render: vi.fn().mockReturnValue({ promise: Promise.resolve() }),
            }),
        };

        vi.spyOn(pdfjsLib, 'getDocument').mockReturnValue({
            promise: Promise.resolve(mockPdf as unknown as PDFDocumentProxy),
        } as never);

        const wrapper = mount(ResumePreview, {
            global: {
                plugins: [
                    createTestingPinia({
                        createSpy: vi.fn,
                        initialState: {
                            resume: resumeInitialState,
                        },
                    }),
                ],
            },
        });

        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();

        const instance = wrapper.vm as unknown as ResumePreviewInstance;

        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();

        expect(instance.pageCount).toBe(5);
        expect(instance.pageNum).toBe(1);

        const previousButton = wrapper.find<HTMLButtonElement>('button:nth-of-type(1)');
        const nextButton = wrapper.find<HTMLButtonElement>('button:nth-of-type(2)');

        expect(previousButton.exists()).toBe(true);
        expect(nextButton.exists()).toBe(true);

        await nextButton.element.dispatchEvent(new Event('click'));
        expect(instance.pageNum).toBe(2);

        instance.prevPage();
        expect(instance.pageNum).toBe(1);

        instance.prevPage();
        expect(instance.pageNum).toBe(1);
    });

    it('should not follow the next page when the current page is 5', async () => {
        const mockPdf = {
            numPages: 5,
            getPage: vi.fn().mockResolvedValue({
                getViewport: vi.fn().mockReturnValue({ width: 100, height: 100, scale: 1.5 }),
                render: vi.fn().mockReturnValue({ promise: Promise.resolve() }),
            }),
        };

        vi.spyOn(pdfjsLib, 'getDocument').mockReturnValue({
            promise: Promise.resolve(mockPdf as unknown as PDFDocumentProxy),
        } as never);

        const wrapper = mount(ResumePreview, {
            global: {
                plugins: [
                    createTestingPinia({
                        createSpy: vi.fn,
                        initialState: {
                            resume: resumeInitialState,
                        },
                    }),
                ],
            },
        });

        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();

        const instance = wrapper.vm as unknown as ResumePreviewInstance;

        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();

        expect(instance.pageCount).toBe(5);
        expect(instance.pageNum).toBe(1);

        const previousButton = wrapper.find<HTMLButtonElement>('button:nth-of-type(1)');
        const nextButton = wrapper.find<HTMLButtonElement>('button:nth-of-type(2)');

        expect(previousButton.exists()).toBe(true);
        expect(nextButton.exists()).toBe(true);

        await nextButton.element.dispatchEvent(new Event('click'));
        await nextButton.element.dispatchEvent(new Event('click'));
        await nextButton.element.dispatchEvent(new Event('click'));
        await nextButton.element.dispatchEvent(new Event('click'));
        expect(instance.pageNum).toBe(5);

        instance.nextPage();
        expect(instance.pageNum).toBe(5);
    });
});
