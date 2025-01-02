import type { PDFDocument } from 'pdf-lib';
import Page from './Page';

export default class JobPage extends Page {
    static #instance: JobPage | null = null;

    public static getInstance(): JobPage {
        if (this.#instance === null) {
            this.#instance = new JobPage();
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
    }
}
