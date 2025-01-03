import type { PDFDocument } from 'pdf-lib';
import Page from './Page';
import { getLocalizedString } from '../translation';
import { INNER_PAGE_WIDTH, SPACING } from './constants';
import { formatDateToLocale } from '../dates';
import { capitalize } from '../text';

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

        this.currentY += this.drawUnderlinedTitle(getLocalizedString('overviewWorkExperience'));
        this.currentY += this.drawText({
            text: getLocalizedString('descriptionWorkExperience', {
                name: this.resumeStore.general.name.firstName,
            }),
            x: this.currentX,
            y: this.currentY,
            size: this.textSize,
            font: this.textFont,
            maxWidth: INNER_PAGE_WIDTH,
        });

        this.currentY += SPACING;

        if (this.resumeStore.jobs.length === 0) {
            return;
        }

        this.#renderJobs();
    }

    #renderJobs(): void {
        const jobs = this.resumeStore.jobs;
        const firstJob = this.resumeStore.jobs[0];
        const otherJobs = jobs.slice(1);

        this.#renderJob(firstJob);

        for (const job of otherJobs) {
            this.page = this.addPage();
            this.#renderJob(job);
        }
    }

    #renderJob(job: Job): void {
        const title = job.company + (job.location ? ` (${job.location})` : '');
        this.currentY += this.drawUnderlinedTitle(title);

        const start = job.period.startDate ? formatDateToLocale(job.period.startDate) : null;
        const end = job.period.endDate ? formatDateToLocale(job.period.endDate) : getLocalizedString('present');

        const jobPeriod = `${start} - ${end}`;
        this.currentY += this.#drawDLRow(getLocalizedString('period'), jobPeriod);

        this.currentY += this.#drawDLRow(getLocalizedString('role'), job.role);
        this.currentY += this.#drawDLRow(getLocalizedString('industry'), job.industry);

        this.currentY += this.#drawDLRow(getLocalizedString('programmingLanguages'), job.skills.languages.join(', '));
        this.currentY += this.#drawDLRow(getLocalizedString('frameworks'), job.skills.frameworks.join(', '));
        this.currentY += this.#drawDLRow(getLocalizedString('platforms'), job.skills.platforms.join(', '));
        this.currentY += this.#drawDLRow(getLocalizedString('methodologies'), job.skills.methodologies.join(', '));
        this.currentY += this.#drawDLRow(
            getLocalizedString('operatingSystems'),
            job.skills.operatingSystems.join(', '),
        );

        this.currentY += this.#drawDLRow(getLocalizedString('databases'), job.skills.databases.join(', '));
        this.currentY += this.#drawDLRow(getLocalizedString('tools'), job.skills.tools.join(', '));

        this.currentY += this.drawText({
            text: job.description,
            x: this.currentX,
            y: this.currentY,
            size: this.textSize,
            font: this.fontData.regular,
            maxWidth: INNER_PAGE_WIDTH,
        });

        this.drawField({
            title: 'Responsibilities',
            bulletList: job.responsibilities,
            needsSpacing: true,
            centerText: false,
        });
    }

    #drawDLRow(term: string, definition: string): number {
        if (!term || !definition) {
            return 0;
        }

        const rightColumnX = this.currentX + 194;
        this.drawText({
            text: capitalize(term),
            x: this.currentX,
            y: this.currentY,
            size: this.textSize,
            font: this.fontData.bold,
        });

        const height = this.drawText({
            text: definition,
            x: rightColumnX,
            y: this.currentY,
            size: this.textSize,
            font: this.fontData.regular,
        });

        return height;
    }
}
