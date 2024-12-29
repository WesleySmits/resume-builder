import { PDFDocument } from 'pdf-lib';
import IntroductionPage from './IntroductionPage';
import SkillsPage from './SkillsPage';

export const MAX_TOP_SKILLS = 10;

export async function generateResume(): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();

    const introductionPage = IntroductionPage.getInstance();
    await introductionPage.initialize(pdfDoc);

    const skillsPage = SkillsPage.getInstance();
    await skillsPage.initialize(pdfDoc);

    return pdfDoc.save();
}
