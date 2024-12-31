import type { PDFDocument } from 'pdf-lib';
import Page from './Page';
import { getLocalizedString } from '../translation';
import { formatDateToLocale } from '../dates';
import { INNER_PAGE_WIDTH, SPACING } from './constants';

export default class EducationPage extends Page {
    static #instance: EducationPage | null = null;

    public static getInstance(): EducationPage {
        if (this.#instance === null) {
            this.#instance = new EducationPage();
        }

        return this.#instance;
    }

    private constructor() {
        super();
    }

    public async initialize(pdfDoc: PDFDocument): Promise<void> {
        await super.initialize(pdfDoc);

        await this.drawFullWidth();
    }

    public drawFullWidth(): void {
        super.drawFullWidth();

        this.#renderEducationTable();
        this.#renderCertificationsList();
    }

    #renderCertificationsList(): void {
        const certifications = this.resumeStore.certifications;
        const xPosition = this.currentX + 5;

        this.drawUnderlinedTitle(getLocalizedString('certifications'));

        const certificationItems = certifications.map((certification) => {
            const { title, provider, completed, year } = certification;
            return `${title}${completed ? '' : ` - (${getLocalizedString('inProgress')})`} - ${provider} - ${year}`;
        });

        this.currentY += this.drawBulletedList({
            items: certificationItems,
            x: xPosition,
            y: this.currentY,
            size: this.textSize,
            font: this.fontData.regular,
        });
    }

    #renderEducationTable(): void {
        const educations = this.resumeStore.education;

        this.drawUnderlinedTitle(getLocalizedString('education'));

        for (const education of educations) {
            this.#renderEducation(education);
        }
    }

    #renderEducation(education: Education): void {
        const { degree, institution, startDate, endDate, description } = education;

        const start = startDate ? formatDateToLocale(startDate) : null;
        const end = endDate ? formatDateToLocale(endDate) : getLocalizedString('present');

        const middleColumnX = this.currentX + 194;
        const rightColumnX = this.currentX + 352;

        this.drawText({
            text: degree,
            x: this.currentX,
            y: this.currentY,
            size: this.textSize,
            font: this.fontData.bold,
        });

        this.drawText({
            text: institution,
            x: middleColumnX,
            y: this.currentY,
            size: this.textSize,
            font: this.fontData.bold,
        });

        const heightOfRow = this.drawText({
            text: `${start} - ${end}`,
            x: rightColumnX,
            y: this.currentY,
            size: this.textSize,
            font: this.fontData.regular,
        });
        this.currentY += heightOfRow;

        if (description) {
            this.currentY += this.drawText({
                text: description,
                x: this.currentX,
                y: this.currentY,
                size: this.textSize,
                font: this.fontData.regular,
                maxWidth: INNER_PAGE_WIDTH,
            });

            this.currentY += SPACING;
        }
    }
}
