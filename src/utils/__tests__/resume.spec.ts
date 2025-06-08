import { describe, expect, it, vi, type Mock } from 'vitest';
import IntroductionPage from '../resume/IntroductionPage';
import SkillsPage from '../resume/SkillsPage';
import EducationPage from '../resume/EducationPage';
import JobPage from '../resume/JobPage';
import {
    generateResume,
    shouldGenerateAdditionalPage,
    shouldGenerateEducationPage,
    shouldGenerateIntroductionPage,
    shouldGenerateJobPage,
    shouldGenerateSkillsPage,
} from '../resume/resume';
import { PDFDocument } from 'pdf-lib';
import { beforeEach } from 'vitest';
import AdditionalPage from '../resume/AdditionalPage';
import { useResumeStore } from '@/stores/resume';

vi.mock('@/stores/resume');

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
vi.mock('../resume/AdditionalPage', () => {
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
        (AdditionalPage.getInstance().initialize as Mock).mockReset();
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
        expect(AdditionalPage.getInstance().initialize).toHaveBeenCalledOnce();
    });
});

describe('should render pages when they have the correct data', () => {
    it('should render the introduction page if the first and last names are set', () => {
        const store = useResumeStore();
        const originalName = store.general.name;
        store.general.name = {
            firstName: '',
            lastName: '',
            middleName: '',
            displayName: '',
        };
        expect(shouldGenerateIntroductionPage()).toBeFalsy();

        store.general.name = originalName;
        expect(shouldGenerateIntroductionPage()).toBeTruthy();
    });

    it('should render the skills page if there are any skills set', () => {
        const store = useResumeStore();
        const originalSkills = store.skills;

        store.skills = {
            languages: [],
            frameworks: [],
            platforms: [],
            methodologies: [],
            databases: [],
            tools: [],
            operatingSystems: [],
        };
        expect(shouldGenerateSkillsPage()).toBeFalsy();

        store.skills = originalSkills;
        expect(shouldGenerateSkillsPage()).toBeTruthy();
    });

    it('should render the education page if there are any educations or certificates set', () => {
        const store = useResumeStore();
        const originalEducations = store.education;
        const originalCertificates = store.certifications;

        store.education = [];
        store.certifications = [];
        expect(shouldGenerateEducationPage()).toBeFalsy();

        store.education = originalEducations;
        store.certifications = originalCertificates;
        expect(shouldGenerateEducationPage()).toBeTruthy();
    });

    it('should render the jobs page if there are any jobs or projects set', () => {
        const store = useResumeStore();
        const originalJobs = store.jobs;
        const originalProjects = store.personalProjects;

        store.jobs = [];
        store.personalProjects = [];
        expect(shouldGenerateJobPage()).toBeFalsy();

        store.jobs = originalJobs;
        store.personalProjects = originalProjects;
        expect(shouldGenerateJobPage()).toBeTruthy();
    });

    it('should render the additional page if there are any languages or competencies set', () => {
        const store = useResumeStore();
        const originalLanguages = store.languages;
        const originalCompetencies = store.competencies;

        store.languages = [];
        store.competencies = [];
        expect(shouldGenerateAdditionalPage()).toBeFalsy();

        store.languages = originalLanguages;
        store.competencies = originalCompetencies;
        expect(shouldGenerateAdditionalPage()).toBeTruthy();
    });
});
