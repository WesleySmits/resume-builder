import type { PDFDocument } from 'pdf-lib';
import Page from './Page';
import { getLocalizedString } from '../translation';
import { toCamelCase } from '../text';
import { SPACING } from './constants';

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
        if (
            this.resumeStore.languages.length === 0 &&
            this.resumeStore.competencies.length === 0 &&
            this.resumeStore.interests.length === 0
        ) {
            return;
        }

        super.drawFullWidth();

        this.#renderLanguages();
        this.currentY += SPACING;

        this.#renderCompetencies();
        this.currentY += SPACING;

        this.#renderInterests();
        this.currentY += SPACING;
    }

    #renderLanguages(): void {
        const languages = this.resumeStore.languages.filter((l) => l.name);
        if (!languages.length) {
            return;
        }

        this.currentY += this.drawUnderlinedTitle(getLocalizedString('languages'));

        this.currentY += this.drawBulletedList({
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

    #renderCompetencies(): void {
        const competencies = this.resumeStore.competencies;
        if (!competencies.length) {
            return;
        }

        this.currentY += this.drawUnderlinedTitle(getLocalizedString('competencies'));
        this.#renderBulletedListInColumns(competencies);
    }

    #renderInterests(): void {
        const interests = this.resumeStore.interests;
        if (!interests.length) {
            return;
        }

        this.currentY += this.drawUnderlinedTitle(getLocalizedString('interests'));
        this.#renderBulletedListInColumns(interests);
    }

    #renderBulletedListInColumns(items: string[]): void {
        const MIN_ITEMS_PER_COLUMN = 10;
        const MAX_COLUMNS = 4;
        const columnWidth = 125;

        const numColumns = Math.min(MAX_COLUMNS, Math.ceil(items.length / MIN_ITEMS_PER_COLUMN));

        const columns: string[][] = Array.from({ length: numColumns }, () => []);

        let currentIndex = 0;

        for (let i = 0; i < numColumns; i++) {
            const itemsToTake = Math.min(MIN_ITEMS_PER_COLUMN, items.length - currentIndex);
            columns[i] = items.slice(currentIndex, currentIndex + itemsToTake);
            currentIndex += itemsToTake;
        }

        let maxHeight = 0;

        columns.forEach((column, index) => {
            const xPosition = this.currentX + index * columnWidth;
            const height = this.drawBulletedList({
                items: column,
                x: xPosition,
                y: this.currentY,
                font: this.textFont,
                size: this.textSize,
            });
            maxHeight = Math.max(maxHeight, height);
        });

        this.currentY += maxHeight + SPACING;
    }
}
