import { getFormattedName, type General } from '@/stores/resume';
import type { PDFDocument } from 'pdf-lib';
import Page from './Page';

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

        if (this.#generalData.profilePhoto) {
            await this.drawImage(this.#generalData.profilePhoto);
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
                title: 'Achievements',
                bulletList: this.#generalData.achievements,
                needsSpacing: true,
            });
        }

        if (this.#generalData.colleaguesDescribe) {
            this.drawField({
                title: 'How would colleagues describe you?',
                text: this.#generalData.colleaguesDescribe,
                needsSpacing: true,
            });
        }

        if (this.#generalData.colleaguesKnow) {
            this.drawField({
                title: 'What should colleagues know about you?',
                text: this.#generalData.colleaguesKnow,
                needsSpacing: true,
            });
        }
    }
}
