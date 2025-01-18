import { PDFDocument } from 'pdf-lib';
import { setActivePinia, createPinia } from 'pinia';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import AdditionalPage from '../resume/AdditionalPage';
import { PAGE_HEIGHT, PAGE_WIDTH } from '../resume/constants';
import { useResumeStore } from '@/stores/resume';

vi.mock('@/stores/resume');

describe('AdditionalPage', () => {
    async function getPdfDocumentWithMocks(): Promise<PDFDocument> {
        const pdfDoc = await PDFDocument.create();
        const page = {
            drawText: vi.fn(() => {
                return Promise.resolve({});
            }),
            drawLine: vi.fn().mockResolvedValue({}),
            getHeight: vi.fn().mockReturnValue(841.89),
            getWidth: vi.fn().mockReturnValue(595.28),
        };

        pdfDoc.addPage = vi.fn().mockReturnValue(page);

        return pdfDoc;
    }

    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('should throw an error if PDFDocument is null', async () => {
        const additionalPage = AdditionalPage.getInstance();
        await expect(async () => {
            await additionalPage.initialize(null as unknown as PDFDocument);
        }).rejects.toThrow('PDFDocument is not set');
    });

    it('should add a page on initialize', async () => {
        const additionalPage = AdditionalPage.getInstance();
        const pdfDoc = await getPdfDocumentWithMocks();

        await additionalPage.initialize(pdfDoc);

        expect(pdfDoc.addPage).toHaveBeenCalledTimes(1);
        expect(pdfDoc.addPage).toHaveBeenCalledWith([PAGE_WIDTH, PAGE_HEIGHT]);
    });

    it('should draw a title with an underline across the full width of the page', async () => {
        const additionalPage = AdditionalPage.getInstance();
        const pdfDoc = await getPdfDocumentWithMocks();

        await additionalPage.initialize(pdfDoc);

        const page = pdfDoc.addPage();
        expect(page.drawLine).toHaveBeenCalledTimes(1);
        expect(page.drawText).toHaveBeenCalledWith('Languages', expect.any(Object));
    });

    it('should draw all the languages to the screen', async () => {
        const additionalPage = AdditionalPage.getInstance();
        const pdfDoc = await getPdfDocumentWithMocks();

        await additionalPage.initialize(pdfDoc);

        const page = pdfDoc.addPage();
        expect(page.drawText).toHaveBeenCalledWith('• English - Native or near native (C1/C2)', expect.any(Object));
    });

    it('should not draw anything if there are no languages', async () => {
        const resumeStore = useResumeStore();
        resumeStore.languages = [];

        const additionalPage = AdditionalPage.getInstance();
        const pdfDoc = await getPdfDocumentWithMocks();

        await additionalPage.initialize(pdfDoc);

        const page = pdfDoc.addPage();

        expect(page.drawLine).toHaveBeenCalledTimes(0);
        expect(page.drawText).toHaveBeenCalledTimes(0);
    });
});
