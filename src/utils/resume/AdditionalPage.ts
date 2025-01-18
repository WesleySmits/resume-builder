import type { PDFDocument } from 'pdf-lib';
import Page from './Page';
import { getLocalizedString } from '../translation';
import { toCamelCase } from '../text';

export default class AdditionalPage extends Page {
    static #instance: AdditionalPage | null = null;

    public static getInstance(): AdditionalPage {
        if (this.#instance === null) {
            this.#instance = new AdditionalPage();
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
        if (this.resumeStore.languages.length === 0) {
            return;
        }

        super.drawFullWidth();

        this.currentY += this.drawUnderlinedTitle(getLocalizedString('languages'));

        this.#renderLanguages();
    }

    #renderLanguages(): void {
        const languages = this.resumeStore.languages.filter((l) => l.name);

        this.drawBulletedList({
            items: languages.map((l) => {
                const key = toCamelCase(`experience-${l.experience}`.toLowerCase());
                const experience = getLocalizedString(key);
                const languageTitle = `${l.name} - ${experience}`;
                return languageTitle;
            }),
            size: this.textSize,
            font: this.textFont,
        });
    }
}
