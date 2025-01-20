import type { PDFDocument } from 'pdf-lib';
import Page from './Page';
import { getLocalizedString } from '../translation';
import { SPACING } from './constants';

export default class IntroductionPage extends Page {
    static #instance: IntroductionPage | null = null;

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
        await super.initialize(pdfDoc);

        await this.drawLeftColumn();
        await this.drawRightColumn();
    }

    public async drawLeftColumn() {
        super.drawLeftColumn();

        await this.#drawProfilePhoto();
        this.#drawDefinitionColumn();
        this.#drawTopSkills();
    }

    public async drawRightColumn() {
        super.drawRightColumn();

        this.#drawName();
        this.#drawFunctionTitle();
        this.#drawIntroduction();
        this.#drawAchievements();
        this.#drawColleaguesDescribe();
        this.#drawColleaguesKnow();
    }

    async #drawProfilePhoto(): Promise<void> {
        if (!this.resumeStore.general.profilePhoto) {
            return;
        }

        this.currentY += await this.drawImage(this.resumeStore.general.profilePhoto, 140, 140);
    }

    #drawDefinitionColumn(): void {
        const DEFINITION_COLUMN_X = 172;

        if (this.resumeStore.general.name?.firstName) {
            this.drawText({
                text: getLocalizedString('firstName'),
                size: this.textSize,
                font: this.titleFont,
                y: this.currentY,
                x: this.currentX,
            });

            this.currentY += this.drawText({
                text: this.resumeStore.general.name.firstName,
                size: this.textSize,
                font: this.textFont,
                y: this.currentY,
                x: DEFINITION_COLUMN_X,
            });
        }

        if (this.resumeStore.general.region) {
            this.drawText({
                text: getLocalizedString('region'),
                size: this.textSize,
                font: this.titleFont,
                y: this.currentY,
                x: this.currentX,
            });

            this.currentY += this.drawText({
                text: this.resumeStore.general.region,
                size: this.textSize,
                font: this.textFont,
                y: this.currentY,
                x: DEFINITION_COLUMN_X,
            });
        }

        if (this.resumeStore.general.drivingLicense) {
            this.drawText({
                text: getLocalizedString('drivingLicense'),
                size: this.textSize,
                font: this.titleFont,
                y: this.currentY,
                x: this.currentX,
            });

            this.currentY += this.drawText({
                text: this.resumeStore.general.drivingLicense,
                size: this.textSize,
                font: this.textFont,
                y: this.currentY,
                x: DEFINITION_COLUMN_X,
            });
        }
    }

    #drawTopSkills(): void {
        if (this.resumeStore.topSkills.length === 0) {
            return;
        }

        this.currentY += SPACING;

        this.currentY += this.drawText({
            text: getLocalizedString('topSkillsTitle'),
            size: this.textSize,
            font: this.titleFont,
            y: this.currentY,
            x: this.currentX,
            centerText: true,
        });

        this.drawSkillsChart(this.resumeStore.topSkills, this.textSize);
    }

    #drawName(): void {
        if (this.resumeStore.general.name) {
            this.drawField({
                title: this.resumeStore.formattedName,
                text: '',
                needsSpacing: false,
                centerText: true,
            });
        }
    }

    #drawFunctionTitle(): void {
        if (this.resumeStore.general.functionTitle) {
            this.drawField({
                title: this.resumeStore.general.functionTitle,
                centerText: true,
            });
        }
    }

    #drawIntroduction(): void {
        if (this.resumeStore.general.introduction) {
            this.drawField({
                text: this.resumeStore.general.introduction,
                needsSpacing: true,
            });
        }
    }

    #drawAchievements(): void {
        const achievements = this.resumeStore.general.achievements.filter((achievement) => achievement !== '');

        if (achievements.length) {
            this.drawField({
                title: getLocalizedString('achievements'),
                bulletList: achievements,
                needsSpacing: true,
            });
        }
    }

    #drawColleaguesDescribe(): void {
        if (this.resumeStore.general.colleaguesDescribe) {
            this.drawField({
                title: getLocalizedString('colleaguesDescribeTitle'),
                text: this.resumeStore.general.colleaguesDescribe,
                needsSpacing: true,
            });
        }
    }

    #drawColleaguesKnow(): void {
        if (this.resumeStore.general.colleaguesKnow) {
            this.drawField({
                title: getLocalizedString('colleaguesKnowTitle'),
                text: this.resumeStore.general.colleaguesKnow,
                needsSpacing: true,
            });
        }
    }
}
