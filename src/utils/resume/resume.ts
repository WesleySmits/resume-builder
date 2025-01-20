import { useResumeStore } from '@/stores/resume';

export async function generateResume(): Promise<Uint8Array> {
    const PDFDocument = (await import('pdf-lib')).PDFDocument;
    const IntroductionPage = (await import('./IntroductionPage')).default;
    const pdfDoc = await PDFDocument.create();

    const introductionPage = IntroductionPage.getInstance();
    await introductionPage.initialize(pdfDoc);

    if (shouldGenerateSkillsPage()) {
        const { default: SkillsPage } = await import('./SkillsPage');
        const skillsPage = SkillsPage.getInstance();
        await skillsPage.initialize(pdfDoc);
    }

    if (shouldGenerateEducationPage()) {
        const { default: EducationPage } = await import('./EducationPage');
        const educationPage = EducationPage.getInstance();
        await educationPage.initialize(pdfDoc);
    }

    if (shouldGenerateJobPage()) {
        const { default: JobPage } = await import('./JobPage');
        const jobPage = JobPage.getInstance();
        await jobPage.initialize(pdfDoc);
    }

    if (shouldGenerateAdditionalPage()) {
        const { default: AdditionalPage } = await import('./AdditionalPage');
        const additionalPage = AdditionalPage.getInstance();
        await additionalPage.initialize(pdfDoc);
    }

    return pdfDoc.save();
}

export function shouldGenerateIntroductionPage(): boolean {
    const store = useResumeStore();

    if (!store.general.name.firstName || !store.general.name.lastName) {
        return false;
    }

    return true;
}

export function shouldGenerateSkillsPage(): boolean {
    const store = useResumeStore();

    const skillCategories = [
        store.skills.languages,
        store.skills.platforms,
        store.skills.frameworks,
        store.skills.databases,
        store.skills.tools,
        store.skills.methodologies,
        store.skills.operatingSystems,
    ];

    if (skillCategories.every((category) => category.length === 0)) {
        return false;
    }

    return true;
}

export function shouldGenerateEducationPage(): boolean {
    const store = useResumeStore();

    const educationSections = [store.education, store.certifications];

    if (educationSections.every((section) => section.length === 0)) {
        return false;
    }

    return true;
}

export function shouldGenerateJobPage(): boolean {
    const store = useResumeStore();

    const jobSections = [store.jobs, store.personalProjects];

    if (jobSections.every((section) => section.length === 0)) {
        return false;
    }

    return true;
}

export function shouldGenerateAdditionalPage(): boolean {
    const store = useResumeStore();

    const additionalSections = [store.languages, store.competencies];

    if (additionalSections.every((section) => section.length === 0)) {
        return false;
    }

    return true;
}
