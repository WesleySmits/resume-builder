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

        expect(page.drawText).not.toHaveBeenCalledWith('Languages', expect.any(Object));
    });

    it('should draw the competencies if they are filled in', async () => {
        const additionalPage = AdditionalPage.getInstance();
        const pdfDoc = await getPdfDocumentWithMocks();

        await additionalPage.initialize(pdfDoc);

        const page = pdfDoc.addPage();

        expect(page.drawText).toHaveBeenCalledWith('Competencies', expect.any(Object));

        expect(page.drawText).toHaveBeenCalledWith('• Problem Solving', expect.any(Object));
        expect(page.drawText).toHaveBeenCalledWith('• Teamwork', expect.any(Object));
        expect(page.drawText).not.toHaveBeenCalledWith('• ', expect.any(Object));
        expect(page.drawText).toHaveBeenCalledWith('• Analytical Thinking', expect.any(Object));
    });

    it('should not draw anything if there are no competencies', async () => {
        const resumeStore = useResumeStore();
        resumeStore.competencies = [];
        resumeStore.languages = [
            {
                name: 'English',
                experience: 'Beginner',
            },
        ];

        const additionalPage = AdditionalPage.getInstance();
        const pdfDoc = await getPdfDocumentWithMocks();

        await additionalPage.initialize(pdfDoc);

        const page = pdfDoc.addPage();

        expect(page.drawText).not.toHaveBeenCalledWith('Competencies', expect.any(Object));

        expect(page.drawText).toHaveBeenCalledWith('• Programming', expect.any(Object));
        expect(page.drawText).toHaveBeenCalledWith('• Star Wars', expect.any(Object));
        expect(page.drawText).toHaveBeenCalledWith('• Game of Thrones', expect.any(Object));
    });

    it('should draw the interests in several columns if they are filled in', async () => {
        const additionalPage = AdditionalPage.getInstance();
        const pdfDoc = await getPdfDocumentWithMocks();

        await additionalPage.initialize(pdfDoc);

        const page = pdfDoc.addPage();

        expect(page.drawText).toHaveBeenCalledWith('Interests', expect.any(Object));
    });

    it('should draw the interests in a single columns if they are filled in', async () => {
        const resumeStore = useResumeStore();
        resumeStore.interests = ['Golf'];

        const additionalPage = AdditionalPage.getInstance();
        const pdfDoc = await getPdfDocumentWithMocks();

        await additionalPage.initialize(pdfDoc);

        const page = pdfDoc.addPage();

        expect(page.drawText).toHaveBeenCalledWith('Interests', expect.any(Object));
    });

    it('should not draw anything if there are no interests', async () => {
        const resumeStore = useResumeStore();
        resumeStore.interests = [];
        resumeStore.languages = [
            {
                name: 'English',
                experience: 'Beginner',
            },
        ];

        const additionalPage = AdditionalPage.getInstance();
        const pdfDoc = await getPdfDocumentWithMocks();

        await additionalPage.initialize(pdfDoc);

        const page = pdfDoc.addPage();

        expect(page.drawText).not.toHaveBeenCalledWith('Interests', expect.any(Object));
    });

    it('should not draw anything if there is not data for the page at all', async () => {
        const resumeStore = useResumeStore();
        resumeStore.competencies = [];
        resumeStore.languages = [];
        resumeStore.interests = [];

        const additionalPage = AdditionalPage.getInstance();
        const pdfDoc = await getPdfDocumentWithMocks();

        await additionalPage.initialize(pdfDoc);

        const page = pdfDoc.addPage();

        expect(page.drawText).not.toHaveBeenCalledWith('Languages', expect.any(Object));
        expect(page.drawText).not.toHaveBeenCalledWith('Competencies', expect.any(Object));
        expect(page.drawText).not.toHaveBeenCalledWith('Interests', expect.any(Object));
    });
});
