import { PDFDocument } from 'pdf-lib';
import IntroductionPage from './IntroductionPage';
import SkillsPage from './SkillsPage';

export async function generateResume(): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();

    const introductionPage = IntroductionPage.getInstance();
    await introductionPage.initialize(pdfDoc);

    const skillsPage = SkillsPage.getInstance();
    await skillsPage.initialize(pdfDoc);

    return pdfDoc.save();
}

export function loadResumeData(): ResumeData | undefined {
    const storedResumeData = localStorage.getItem('resumeData');
    if (!storedResumeData) {
        return undefined;
    }

    try {
        return JSON.parse(storedResumeData) as ResumeData;
    } catch (error) {
        console.error('Failed to parse resume data from localStorage:', error);
        return undefined;
    }
}
