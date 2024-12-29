import type { PDFDocument } from 'pdf-lib';
import Page, { SPACING } from './Page';
import { getLocalizedString } from '../translation';

export default class IntroductionPage extends Page {
    static #instance: IntroductionPage | null = null;

    #generalData: General = this.resumeStore.general;

    #topSkillsData: TopSkill[] = this.resumeStore.topSkills;

    public static getInstance(): IntroductionPage {
        if (this.#instance === null) {
            this.#instance = new IntroductionPage();
        }

        return this.#instance;
    }

    private constructor() {
        super();
    }

    public async initialize(pdfDoc: PDFDocument): Promise<void> {
        if (!pdfDoc) {
            throw new Error('PDFDocument is not set');
        }

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

        if (this.#generalData.region) {
            this.drawText({
                text: getLocalizedString('region'),
                size: this.textSize,
                font: this.titleFont,
                y: this.currentY,
                x: this.currentX,
            });

            this.currentY += this.drawText({
                text: this.#generalData.region,
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

        if (this.#topSkillsData.length) {
            this.currentY += SPACING;

            this.currentY += this.drawText({
                text: getLocalizedString('topSkillsTitle'),
                size: this.textSize,
                font: this.titleFont,
                y: this.currentY,
                x: this.currentX,
                centerText: true,
            });

            this.drawSkillsChart(this.#topSkillsData, this.textSize);
        }
    }

    public async drawRightColumn() {
        super.drawRightColumn();

        if (this.#generalData.name) {
            this.drawField({
                title: this.resumeStore.formattedName,
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
                title: getLocalizedString('colleaguesDescribeTitle'),
                text: this.#generalData.colleaguesDescribe,
                needsSpacing: true,
            });
        }

        if (this.#generalData.colleaguesKnow) {
            this.drawField({
                title: getLocalizedString('colleaguesKnowTitle'),
                text: this.#generalData.colleaguesKnow,
                needsSpacing: true,
            });
        }
    }
}
