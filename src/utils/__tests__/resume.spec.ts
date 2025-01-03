import { describe, expect, it, vi, type Mock } from 'vitest';
import IntroductionPage from '../resume/IntroductionPage';
import SkillsPage from '../resume/SkillsPage';
import EducationPage from '../resume/EducationPage';
import JobPage from '../resume/JobPage';
import { generateResume } from '../resume/resume';
import { PDFDocument } from 'pdf-lib';
import { beforeEach } from 'vitest';

vi.mock('pdf-lib', () => {
    return {
        PDFDocument: {
            create: vi.fn().mockResolvedValue({
                save: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
            }),
        },
    };
});

vi.mock('../resume/IntroductionPage', () => {
    return {
        default: {
            getInstance: vi.fn().mockReturnValue({
                initialize: vi.fn(),
            }),
        },
    };
});

vi.mock('../resume/SkillsPage', () => {
    return {
        default: {
            getInstance: vi.fn().mockReturnValue({
                initialize: vi.fn(),
            }),
        },
    };
});

vi.mock('../resume/EducationPage', () => {
    return {
        default: {
            getInstance: vi.fn().mockReturnValue({
                initialize: vi.fn(),
            }),
        },
    };
});

vi.mock('../resume/JobPage', () => {
    return {
        default: {
            getInstance: vi.fn().mockReturnValue({
                initialize: vi.fn(),
            }),
        },
    };
});

describe('generateResume', () => {
    beforeEach(() => {
        (IntroductionPage.getInstance().initialize as Mock).mockReset();
        (SkillsPage.getInstance().initialize as Mock).mockReset();
        (EducationPage.getInstance().initialize as Mock).mockReset();
        (JobPage.getInstance().initialize as Mock).mockReset();
    });

    it('should create and save a PDF', async () => {
        await generateResume();

        const pdfDoc = await PDFDocument.create();
        expect((await pdfDoc).save).toHaveBeenCalledOnce();
    });

    it('should do initialize the page classes', async () => {
        const introductionPage = IntroductionPage.getInstance();
        const skillsPage = SkillsPage.getInstance();
        const educationPage = EducationPage.getInstance();
        const jobPage = JobPage.getInstance();

        await generateResume();

        expect(introductionPage.initialize).toHaveBeenCalledOnce();
        expect(skillsPage.initialize).toHaveBeenCalledOnce();
        expect(educationPage.initialize).toHaveBeenCalledOnce();
        expect(jobPage.initialize).toHaveBeenCalledOnce();
    });
});
