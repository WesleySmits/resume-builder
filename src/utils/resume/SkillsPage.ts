import { getLocalizedString } from '../translation';
import Page from './Page';
import { HORIZONTAL_EDGE_SPACING, RIGHT_COLUMN_START, SPACING, VERTICAL_EDGE_SPACING } from './constants';
import { type PDFDocument } from 'pdf-lib';

export default class SkillsPage extends Page {
    static #instance: SkillsPage | null = null;

    #data: Skills = this.resumeStore.skills;

    public static getInstance(): SkillsPage {
        if (this.#instance === null) {
            this.#instance = new SkillsPage();
        }

        return this.#instance;
    }

    private constructor() {
        super();
    }

    public async initialize(pdfDoc: PDFDocument): Promise<void> {
        await super.initialize(pdfDoc);

        await this.drawFullWidth();
        await this.drawLeftColumn();
        await this.drawRightColumn();
    }

    public drawFullWidth(): void {
        super.drawFullWidth();

        this.drawUnderlinedTitle(getLocalizedString('technicalSkills'));
    }

    public drawLeftColumn(): void {
        this.currentX = HORIZONTAL_EDGE_SPACING;
        this.currentY = VERTICAL_EDGE_SPACING + 25.4;

        this.#renderSkillsTable(getLocalizedString('programmingLanguages'), this.#data.languages);
        this.#renderSkillsTable(getLocalizedString('platforms'), this.#data.platforms);
        this.#renderSkillsTable(getLocalizedString('tools'), this.#data.tools);
    }

    public drawRightColumn(): void {
        this.currentX = RIGHT_COLUMN_START;
        this.currentY = VERTICAL_EDGE_SPACING + 25.4;

        this.#renderSkillsTable(getLocalizedString('frameworks'), this.#data.frameworks, 60);
        this.#renderSkillsTable(getLocalizedString('methodologies'), this.#data.methodologies, 60);
        this.#renderSkillsTable(getLocalizedString('databases'), this.#data.databases, 60);
        this.#renderSkillsTable(getLocalizedString('operatingSystems'), this.#data.operatingSystems, 60);
    }

    #renderSkillsTable(title: string, skills: string[], lineEnd = 315.28): void {
        this.drawUnderlinedTitle(title, lineEnd);

        const skills1 = skills.slice(0, Math.ceil(skills.length / 2));
        const skills2 = skills.slice(Math.ceil(skills.length / 2));
        const secondColumnX = this.currentX + 125;

        const height1 = this.drawBulletedList({
            items: skills1,
            x: this.currentX,
            y: this.currentY,
            font: this.textFont,
            size: this.textSize,
        });

        const height2 = this.drawBulletedList({
            items: skills2,
            x: secondColumnX,
            y: this.currentY,
            font: this.textFont,
            size: this.textSize,
        });

        const height = Math.max(height1, height2);
        this.currentY += height + SPACING;
    }
}
