import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { PDFDocument } from 'pdf-lib';
import { PAGE_HEIGHT, PAGE_WIDTH } from '../resume/constants';
import EducationPage from '../resume/EducationPage';
import { useResumeStore } from '@/stores/resume';

vi.mock('@/stores/resume');

describe('EducationPage', () => {
    async function getPdfDocumentWithMocks(): Promise<PDFDocument> {
        const pdfDoc = await PDFDocument.create();
        const page = {
            drawText: vi.fn().mockResolvedValue({}),
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
        const educationPage = EducationPage.getInstance();
        await expect(async () => {
            await educationPage.initialize(null as unknown as PDFDocument);
        }).rejects.toThrow('PDFDocument is not set');
    });

    it('should add a page on initialize', async () => {
        const educationPage = EducationPage.getInstance();
        const pdfDoc = await getPdfDocumentWithMocks();

        await educationPage.initialize(pdfDoc);

        expect(pdfDoc.addPage).toHaveBeenCalledOnce();
        expect(pdfDoc.addPage).toHaveBeenCalledWith([PAGE_WIDTH, PAGE_HEIGHT]);
    });

    it('should draw a title with an underline across the full width of the page', async () => {
        const educationPage = EducationPage.getInstance();
        const pdfDoc = await getPdfDocumentWithMocks();

        await educationPage.initialize(pdfDoc);

        const page = pdfDoc.addPage();
        expect(page.drawLine).toHaveBeenCalledTimes(2);
    });

    it('should draw all the education options to the screen', async () => {
        const resumeStore = useResumeStore();
        resumeStore.education = [
            {
                institution: 'University of the Internet',
                degree: 'Bachelor of Awesomeness',
                startDate: '2000-01-01',
                endDate: '2024-01-01',
            },
            {
                institution: 'University of the Internet',
                degree: 'Bachelor of Lazyness',
                startDate: '2001-01-01',
                endDate: '2023-01-01',
                description: 'This was a very tough 5-minute education.',
            },
        ];

        const educationPage = EducationPage.getInstance();
        const pdfDoc = await getPdfDocumentWithMocks();

        await educationPage.initialize(pdfDoc);

        const page = pdfDoc.addPage();

        expect(page.drawLine).toHaveBeenCalledTimes(2);
        expect(page.drawText).toHaveBeenCalledWith('University of the Internet', expect.any(Object));
        expect(page.drawText).toHaveBeenCalledWith('Bachelor of Awesomeness', expect.any(Object));
        expect(page.drawText).toHaveBeenCalledWith('Bachelor of Lazyness', expect.any(Object));

        expect(page.drawText).toHaveBeenCalledWith('Jan 2000 - Jan 2024', expect.any(Object));
        expect(page.drawText).toHaveBeenCalledWith('Jan 2001 - Jan 2023', expect.any(Object));

        expect(page.drawText).toHaveBeenCalledWith('This was a very tough 5-minute education.', expect.any(Object));
    });

    it('should draw all the certification options to the screen', async () => {
        const resumeStore = useResumeStore();
        resumeStore.education = [];
        resumeStore.certifications = [
            {
                provider: 'University of the Internet',
                title: 'Certificate of Awesomeness',
                completed: true,
                year: 2024,
            },
            {
                provider: 'University of the Internet',
                title: 'Certificate of Lazyness',
                completed: false,
                year: 2023,
            },
        ];

        const educationPage = EducationPage.getInstance();
        const pdfDoc = await getPdfDocumentWithMocks();

        await educationPage.initialize(pdfDoc);

        const page = pdfDoc.addPage();

        expect(page.drawLine).toHaveBeenCalledTimes(2);
    });
});
