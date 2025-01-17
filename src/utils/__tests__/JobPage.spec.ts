import { PDFDocument } from 'pdf-lib';
import { setActivePinia, createPinia } from 'pinia';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import JobPage from '../resume/JobPage';
import { PAGE_HEIGHT, PAGE_WIDTH } from '../resume/constants';
import { useResumeStore } from '@/stores/resume';

vi.mock('@/stores/resume');

describe('JobPage', () => {
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
        const jobPage = JobPage.getInstance();
        await expect(async () => {
            await jobPage.initialize(null as unknown as PDFDocument);
        }).rejects.toThrow('PDFDocument is not set');
    });

    it('should add a page on initialize', async () => {
        const jobPage = JobPage.getInstance();
        const pdfDoc = await getPdfDocumentWithMocks();

        await jobPage.initialize(pdfDoc);

        expect(pdfDoc.addPage).toHaveBeenCalledTimes(3);
        expect(pdfDoc.addPage).toHaveBeenCalledWith([PAGE_WIDTH, PAGE_HEIGHT]);
    });

    it('should draw a title with an underline across the full width of the page', async () => {
        const jobPage = JobPage.getInstance();
        const pdfDoc = await getPdfDocumentWithMocks();

        await jobPage.initialize(pdfDoc);

        const page = pdfDoc.addPage();
        expect(page.drawLine).toHaveBeenCalledTimes(4);
    });

    it('should draw all the job options to the screen', async () => {
        const resumeStore = useResumeStore();
        const jobs: Job[] = [
            {
                company: 'University of the Banana',
                location: 'Online',
                period: {
                    startDate: '2001-01-01',
                    endDate: '2023-01-01',
                },
                description: 'This was a very tough 5-minute job.',
                role: '',
                responsibilities: ['Being awesome'],
                industry: 'Education',
                skills: {
                    languages: ['JavaScript', 'TypeScript'],
                    frameworks: ['Vue.js', 'React'],
                    platforms: ['Node.js', 'Docker'],
                    methodologies: ['Agile', 'Scrum'],
                    databases: ['MongoDB', 'PostgreSQL'],
                    tools: ['Git', 'Docker'],
                    operatingSystems: ['Windows', 'Linux'],
                },
            },
            {
                company: 'University of the Internet',
                location: 'Online',

                period: {
                    startDate: '2001-01-01',
                    endDate: '2023-01-01',
                },
                description: 'This was a very tough 5-minute job.',

                role: 'Bachelor of Awesomeness',
                responsibilities: ['Being awesome'],
                industry: 'Education',
                skills: {
                    languages: ['JavaScript', 'TypeScript'],
                    frameworks: ['Vue.js', 'React'],
                    platforms: ['Node.js', 'Docker'],
                    methodologies: ['Agile', 'Scrum'],
                    databases: ['MongoDB', 'PostgreSQL'],
                    tools: ['Git', 'Docker'],
                    operatingSystems: ['Windows', 'Linux'],
                },
            },
        ];
        resumeStore.jobs = jobs;

        const jobPage = JobPage.getInstance();
        const pdfDoc = await getPdfDocumentWithMocks();

        await jobPage.initialize(pdfDoc);

        const page = pdfDoc.addPage();

        expect(page.drawLine).toHaveBeenCalledTimes(5);
        expect(page.drawText).toHaveBeenCalledWith('University of the Internet (Online)', expect.any(Object));
        expect(page.drawText).toHaveBeenCalledWith('University of the Banana (Online)', expect.any(Object));
        expect(page.drawText).toHaveBeenCalledWith('Bachelor of Awesomeness', expect.any(Object));
    });

    it('should not draw anything if there are no jobs', async () => {
        const resumeStore = useResumeStore();
        resumeStore.jobs = [];

        const jobPage = JobPage.getInstance();
        const pdfDoc = await getPdfDocumentWithMocks();

        await jobPage.initialize(pdfDoc);

        const page = pdfDoc.addPage();

        expect(page.drawLine).toHaveBeenCalledTimes(3);
        expect(page.drawText).toHaveBeenCalledTimes(26);
    });

    it('should draw all the personal projects to the screen', async () => {
        const jobPage = JobPage.getInstance();
        const pdfDoc = await getPdfDocumentWithMocks();

        await jobPage.initialize(pdfDoc);

        const page = pdfDoc.addPage();

        expect(page.drawLine).toHaveBeenCalledTimes(3);
        expect(page.drawText).toHaveBeenCalledTimes(26);
    });

    it('should not draw anything if there are no jobs or personal projects', async () => {
        const resumeStore = useResumeStore();
        resumeStore.jobs = [];
        resumeStore.personalProjects = [];

        const jobPage = JobPage.getInstance();
        const pdfDoc = await getPdfDocumentWithMocks();

        await jobPage.initialize(pdfDoc);

        const page = pdfDoc.addPage();

        expect(page.drawLine).toHaveBeenCalledTimes(1);
        expect(page.drawText).toHaveBeenCalledTimes(2);
    });
});
