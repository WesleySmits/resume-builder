import { getFormattedName, type General } from '@/stores/resume';
import type { PDFDocument } from 'pdf-lib';
import Page, { getLocalizedString } from './Page';

export default class IntroductionPage extends Page {
    static #instance: IntroductionPage | null = null;

    #generalData: General;

    public static getInstance(data: General): IntroductionPage {
        if (this.#instance === null) {
            this.#instance = new IntroductionPage(data);
        }

        return this.#instance;
    }

    private constructor(data: General) {
        super();

        this.#generalData = data;
    }

    public async initialize(pdfDoc: PDFDocument): Promise<void> {
        await super.initialize(pdfDoc);

        await this.drawLeftColumn();
        await this.drawRightColumn();
    }

    public async drawLeftColumn() {
        super.drawLeftColumn();

        const DEFINITION_COLUMN_X = 172;

        if (this.#generalData.profilePhoto) {
            this.currentY += await this.drawImage(this.#generalData.profilePhoto, 140, 140);
        }

        if (this.#generalData.name?.firstName) {
            this.drawText({
                text: getLocalizedString('firstName'),
                size: this.textSize,
                font: this.titleFont,
                y: this.currentY,
                x: this.currentX,
            });

            this.currentY += this.drawText({
                text: this.#generalData.name.firstName,
                size: this.textSize,
                font: this.textFont,
                y: this.currentY,
                x: DEFINITION_COLUMN_X,
            });
        }

        if (this.#generalData.drivingLicense) {
            this.drawText({
                text: getLocalizedString('drivingLicense'),
                size: this.textSize,
                font: this.titleFont,
                y: this.currentY,
                x: this.currentX,
            });

            this.currentY += this.drawText({
                text: this.#generalData.drivingLicense,
                size: this.textSize,
                font: this.textFont,
                y: this.currentY,
                x: DEFINITION_COLUMN_X,
            });
        }
    }

    public async drawRightColumn() {
        super.drawRightColumn();

        if (this.#generalData.name) {
            this.drawField({
                title: getFormattedName(),
                text: '',
                needsSpacing: false,
                centerText: true,
            });
        }

        if (this.#generalData.functionTitle) {
            this.drawField({
                title: this.#generalData.functionTitle,
                centerText: true,
            });
        }

        if (this.#generalData.introduction) {
            this.drawField({
                text: this.#generalData.introduction,
                needsSpacing: true,
            });
        }

        if (this.#generalData.achievements) {
            this.drawField({
                title: getLocalizedString('achievements'),
                bulletList: this.#generalData.achievements,
                needsSpacing: true,
            });
        }

        if (this.#generalData.colleaguesDescribe) {
            this.drawField({
                title: getLocalizedString('colleaguesDescribe'),
                text: this.#generalData.colleaguesDescribe,
                needsSpacing: true,
            });
        }

        if (this.#generalData.colleaguesKnow) {
            this.drawField({
                title: getLocalizedString('colleaguesKnow'),
                text: this.#generalData.colleaguesKnow,
                needsSpacing: true,
            });
        }
    }
}
