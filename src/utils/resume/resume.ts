import { type ResumeData } from '@/stores/resume';
import { PDFDocument } from 'pdf-lib';
import IntroductionPage from './IntroductionPage';
import SkillsPage from './skillsPage';

export async function generateResume(resumeData: ResumeData): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();

    // Generate each page
    const introductionPage = IntroductionPage.getInstance(resumeData.general);
    await introductionPage.initialize(pdfDoc);

    // Generate the skills page
    const skillsPage = SkillsPage.getInstance(resumeData.skills);
    await skillsPage.initialize(pdfDoc);

    // Additional pages (placeholder for future logic)
    // await generatePageTwo(pdfDoc, data);
    // await generatePageThree(pdfDoc, data);

    // Save and return the PDF
    return pdfDoc.save();
}
