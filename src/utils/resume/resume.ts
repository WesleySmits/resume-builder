import { PDFDocument } from 'pdf-lib';
import IntroductionPage from './IntroductionPage';
import SkillsPage from './SkillsPage';
import EducationPage from './EducationPage';
import JobPage from './JobPage';

export async function generateResume(): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();

    const introductionPage = IntroductionPage.getInstance();
    await introductionPage.initialize(pdfDoc);

    const skillsPage = SkillsPage.getInstance();
    await skillsPage.initialize(pdfDoc);

    const educationPage = EducationPage.getInstance();
    await educationPage.initialize(pdfDoc);

    const jobPage = JobPage.getInstance();
    await jobPage.initialize(pdfDoc);

    return pdfDoc.save();
}
