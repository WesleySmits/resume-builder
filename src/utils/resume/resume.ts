import { PDFDocument } from 'pdf-lib';
import IntroductionPage from './IntroductionPage';
import SkillsPage from './SkillsPage';

export async function generateResume(): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();

    // Generate each page
    const introductionPage = IntroductionPage.getInstance();
    await introductionPage.initialize(pdfDoc);

    // Generate the skills page
    const skillsPage = SkillsPage.getInstance();
    await skillsPage.initialize(pdfDoc);

    // Additional pages (placeholder for future logic)
    // await generatePageTwo(pdfDoc, data);
    // await generatePageThree(pdfDoc, data);

    // Save and return the PDF
    return pdfDoc.save();
}
