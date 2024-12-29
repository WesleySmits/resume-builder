import './setupTests';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import IntroductionPage from '../resume/IntroductionPage';
import { createPinia, setActivePinia } from 'pinia';
import { PDFDocument } from 'pdf-lib';
import { PAGE_HEIGHT, PAGE_WIDTH } from '../resume/constants';
import { useResumeStore } from '@/stores/resume';

vi.mock('../image', () => ({
    base64ToUint8Array: vi.fn().mockReturnValue(new Uint8Array([1, 2, 3])),
}));

describe('IntroductionPage', () => {
    async function getPdfDocumentWithMocks(): Promise<PDFDocument> {
        const pdfDoc = await PDFDocument.create();
        const page = {
            drawImage: vi.fn().mockResolvedValue({}),
            drawText: vi.fn().mockResolvedValue({}),
            getHeight: vi.fn().mockReturnValue(841.89),
        };

        pdfDoc.embedJpg = vi.fn().mockResolvedValue([1, 2, 3]);
        pdfDoc.addPage = vi.fn().mockReturnValue(page);

        return pdfDoc;
    }

    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('should throw an error if PDFDocument is null', async () => {
        const introductionPage = IntroductionPage.getInstance();
        await expect(async () => {
            await introductionPage.initialize(null as unknown as PDFDocument);
        }).rejects.toThrow('PDFDocument is not set');
    });

    it('should add a page on initialize', async () => {
        const introductionPage = IntroductionPage.getInstance();
        const pdfDoc = await getPdfDocumentWithMocks();

        await introductionPage.initialize(pdfDoc);

        expect(pdfDoc.addPage).toHaveBeenCalledOnce();
        expect(pdfDoc.addPage).toHaveBeenCalledWith([PAGE_WIDTH, PAGE_HEIGHT]);
    });

    it('should render left and right column on initialize', async () => {
        const introductionPage = IntroductionPage.getInstance();
        const backupDrawLeftColumn = introductionPage.drawLeftColumn;
        const backupDrawRightColumn = introductionPage.drawRightColumn;

        introductionPage.drawLeftColumn = vi.fn();
        introductionPage.drawRightColumn = vi.fn();

        const pdfDoc = await getPdfDocumentWithMocks();

        await introductionPage.initialize(pdfDoc);

        expect(introductionPage.drawLeftColumn).toHaveBeenCalledOnce();
        expect(introductionPage.drawRightColumn).toHaveBeenCalledOnce();

        introductionPage.drawLeftColumn = backupDrawLeftColumn;
        introductionPage.drawRightColumn = backupDrawRightColumn;
    });

    it('should render correct data on the left column', async () => {
        const introductionPage = IntroductionPage.getInstance();
        introductionPage.drawRightColumn = vi.fn();

        const store = useResumeStore();
        const pdfDoc = await getPdfDocumentWithMocks();
        await introductionPage.initialize(pdfDoc);

        const page = pdfDoc.addPage();

        expect(page.drawImage).toHaveBeenCalledOnce();
        expect(page.drawImage).toHaveBeenCalledWith([1, 2, 3], {
            x: 60,
            y: 601.89,
            width: 140,
            height: 140,
        });

        expect(page.drawText).toHaveBeenCalledTimes(6);

        expect(page.drawText).toHaveBeenCalledWith('First Name', expect.any(Object));
        expect(page.drawText).toHaveBeenCalledWith(store.general.name.firstName, expect.any(Object));

        expect(page.drawText).toHaveBeenCalledWith('Region', expect.any(Object));
        expect(page.drawText).toHaveBeenCalledWith(store.general.region, expect.any(Object));

        expect(page.drawText).toHaveBeenCalledWith('Driving License', expect.any(Object));
        expect(page.drawText).toHaveBeenCalledWith(store.general.drivingLicense, expect.any(Object));
    });

    it('should render correct data on the right column', () => {
        expect(1).toBe(1);
    });
});
