import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { PDFDocument } from 'pdf-lib';
import { PAGE_HEIGHT, PAGE_WIDTH } from '../resume/constants';
import SkillsPage from '../resume/SkillsPage';

vi.mock('@/stores/resume');

describe('SkillsPage', () => {
    async function getPdfDocumentWithMocks(): Promise<PDFDocument> {
        const pdfDoc = await PDFDocument.create();
        const page = {
            drawImage: vi.fn().mockResolvedValue({}),
            drawText: vi.fn().mockResolvedValue({}),
            drawLine: vi.fn().mockResolvedValue({}),
            getHeight: vi.fn().mockReturnValue(841.89),
            getWidth: vi.fn().mockReturnValue(595.28),
        };

        pdfDoc.embedJpg = vi.fn().mockResolvedValue([1, 2, 3]);
        pdfDoc.addPage = vi.fn().mockReturnValue(page);

        return pdfDoc;
    }

    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('should throw an error if PDFDocument is null', async () => {
        const skillsPage = SkillsPage.getInstance();
        await expect(async () => {
            await skillsPage.initialize(null as unknown as PDFDocument);
        }).rejects.toThrow('PDFDocument is not set');
    });

    it('should add a page on initialize', async () => {
        const skillsPage = SkillsPage.getInstance();
        const pdfDoc = await getPdfDocumentWithMocks();

        await skillsPage.initialize(pdfDoc);

        expect(pdfDoc.addPage).toHaveBeenCalledOnce();
        expect(pdfDoc.addPage).toHaveBeenCalledWith([PAGE_WIDTH, PAGE_HEIGHT]);
    });

    it('should draw a title with an underline across the full width of the page', async () => {
        const skillsPage = SkillsPage.getInstance();

        const backupDrawLeftColumn = skillsPage.drawLeftColumn;
        const backupDrawRightColumn = skillsPage.drawRightColumn;

        skillsPage.drawLeftColumn = vi.fn();
        skillsPage.drawRightColumn = vi.fn();

        const pdfDoc = await getPdfDocumentWithMocks();

        await skillsPage.initialize(pdfDoc);

        const page = pdfDoc.addPage();

        expect(page.drawLine).toHaveBeenCalledOnce();

        expect(skillsPage.drawLeftColumn).toHaveBeenCalledOnce();
        expect(skillsPage.drawRightColumn).toHaveBeenCalledOnce();

        skillsPage.drawLeftColumn = backupDrawLeftColumn;
        skillsPage.drawRightColumn = backupDrawRightColumn;
    });

    it('should draw the correct skill categories in the left column', async () => {
        const skillsPage = SkillsPage.getInstance();

        const backupDrawRightColumn = skillsPage.drawRightColumn;
        skillsPage.drawRightColumn = vi.fn();

        const pdfDoc = await getPdfDocumentWithMocks();

        await skillsPage.initialize(pdfDoc);

        const page = pdfDoc.addPage();

        expect(page.drawLine).toHaveBeenCalledTimes(4);
        expect(page.drawText).toHaveBeenCalledTimes(9);

        skillsPage.drawRightColumn = backupDrawRightColumn;
    });

    it('should draw the correct skill categories in the right column', async () => {
        const skillsPage = SkillsPage.getInstance();

        const backupDrawLeftColumn = skillsPage.drawLeftColumn;
        skillsPage.drawLeftColumn = vi.fn();

        const pdfDoc = await getPdfDocumentWithMocks();

        await skillsPage.initialize(pdfDoc);

        const page = pdfDoc.addPage();

        expect(page.drawLine).toHaveBeenCalledTimes(5);
        expect(page.drawText).toHaveBeenCalledTimes(9);

        skillsPage.drawLeftColumn = backupDrawLeftColumn;
    });
});
