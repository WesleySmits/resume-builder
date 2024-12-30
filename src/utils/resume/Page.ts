import type { PDFDocument, PDFFont, PDFPage } from 'pdf-lib';
import { rgb, StandardFonts } from 'pdf-lib';

import { base64ToUint8Array } from '../image';
import { useResumeStore } from '@/stores/resume';
import {
    COLUMN_WIDTH,
    HORIZONTAL_EDGE_SPACING,
    MAX_TOP_SKILLS,
    PAGE_HEIGHT,
    PAGE_WIDTH,
    RIGHT_COLUMN_START,
    SPACING,
    VERTICAL_EDGE_SPACING,
} from './constants';

export default class Page {
    #document: PDFDocument | null = null;
    protected page: PDFPage = null as unknown as PDFPage;

    protected resumeStore = useResumeStore();

    public currentX = 0;
    public currentY = 0;

    public titleSize = 9;
    public titleFont: PDFFont | null = null;

    public textSize = 8;
    public textFont: PDFFont | null = null;

    public fontData: FontData = {
        regular: null,
        bold: null,
    };

    public async initialize(pdfDoc: PDFDocument): Promise<void> {
        if (!pdfDoc) {
            throw new Error('PDFDocument is not set');
        }

        this.#document = pdfDoc;
        this.page = this.addPage();

        this.fontData.regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
        this.fontData.bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        this.textFont = this.fontData.regular;
        this.titleFont = this.fontData.bold;

        this.currentX = HORIZONTAL_EDGE_SPACING;
        this.currentY = VERTICAL_EDGE_SPACING;
    }

    protected drawLine(props: LineProps): number {
        const actualY = {
            start: this.page.getHeight() - props.vertical.start + 10,
            end: this.page.getHeight() - props.vertical.end + 10,
        };

        this.page.drawLine({
            start: { x: props.horizontal.start, y: actualY.start },
            end: { x: props.horizontal.end, y: actualY.end },
            thickness: props.thickness,
            color: props.color,
        });

        this.currentY += props.thickness + SPACING;

        return props.thickness + SPACING;
    }

    protected drawField(props: FieldData): number {
        let totalAddedHeight = 0;

        if (props.needsSpacing) {
            this.currentY += SPACING;
            totalAddedHeight += SPACING;
        }

        if (props.title) {
            const addedHeight = this.drawText({
                text: props.title,
                size: this.titleSize,
                font: this.titleFont,
                centerText: props.centerText,
            });

            this.currentY += addedHeight;
            totalAddedHeight += addedHeight;
        }

        if (props.text) {
            const addedHeight = this.drawText({
                text: props.text,
                size: this.textSize,
                font: this.textFont,
                centerText: props.centerText,
            });

            this.currentY += addedHeight;
            totalAddedHeight += addedHeight;
        }

        if (props.bulletList) {
            const addedHeight = this.drawBulletedList({
                items: props.bulletList,
                size: this.textSize,
                font: this.textFont,
            });

            this.currentY += addedHeight;
            totalAddedHeight += addedHeight;
        }

        return totalAddedHeight;
    }

    protected drawFullWidth(): void {
        this.currentX = HORIZONTAL_EDGE_SPACING;
    }

    protected drawLeftColumn() {
        this.currentX = HORIZONTAL_EDGE_SPACING;
        this.currentY = VERTICAL_EDGE_SPACING;
    }

    protected drawRightColumn() {
        this.currentX = RIGHT_COLUMN_START;
        this.currentY = VERTICAL_EDGE_SPACING;
    }

    protected addPage(): PDFPage {
        if (this.#document === null) {
            throw new Error('Document not initialized');
        }

        return this.#document.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    }

    protected async drawImage(src: string, width: number = 140, height: number = 140): Promise<number> {
        if (this.#document === null) {
            throw new Error('Document not initialized');
        }

        const imageBytes = base64ToUint8Array(src);
        let image;

        if (src.startsWith('data:image/jpeg') || src.startsWith('data:image/jpg')) {
            image = await this.#document.embedJpg(imageBytes);
        } else if (src.startsWith('data:image/png')) {
            image = await this.#document.embedPng(imageBytes);
        } else {
            throw new Error('Unsupported image format');
        }

        const actualY = this.page.getHeight() - this.currentY - height;

        this.page.drawImage(image, {
            x: this.currentX,
            y: actualY,
            width,
            height,
        });

        return Promise.resolve(height + SPACING * 2);
    }

    protected drawRectangle(props: DrawRectangleProps): number {
        const { x, y, width, height, color } = props;

        const actualY = this.page.getHeight() - y;

        this.page.drawRectangle({
            x,
            y: actualY,
            width,
            height,
            color,
        });

        return height;
    }

    protected drawText(props: DrawFieldProps): number {
        const { text, x = this.currentX, y = this.currentY, size, font, maxWidth = 240, centerText = false } = props;

        const actualY = this.page.getHeight() - y;
        const textOptions = { x, y: actualY, size, font, color: rgb(0, 0, 0), lineHeight: size * 1.6, maxWidth };

        const { paragraphs, emptyLineHeight } = this.#processParagraphs(text, size);
        let currentY = actualY;
        let totalHeight = emptyLineHeight;

        paragraphs.forEach((paragraph, index) => {
            const lines = paragraph.replace(/\n/g, ' ').split(' ');
            let line = '';
            lines.forEach((word) => {
                const testLine = line + word + ' ';
                const width = font.widthOfTextAtSize(testLine, size);
                if (width > maxWidth && line !== '') {
                    const centeredX = centerText ? x + (maxWidth - font.widthOfTextAtSize(line.trim(), size)) / 2 : x;

                    this.page.drawText(line.trim(), { ...textOptions, x: centeredX, y: currentY });
                    line = word + ' ';
                    currentY -= size * 1.6;
                    totalHeight += size * 1.6;
                } else {
                    line = testLine;
                }
            });

            const centeredX = centerText ? x + (maxWidth - font.widthOfTextAtSize(line.trim(), size)) / 2 : x;
            this.page.drawText(line.trim(), { ...textOptions, x: centeredX, y: currentY });

            currentY -= size * 1.6;
            totalHeight += size * 1.6;

            if (index < paragraphs.length - 1) {
                currentY -= size * 1.6; // Add extra space between paragraphs
            }
        });

        return totalHeight;
    }

    protected drawBulletedList(props: DrawBulletedListProps): number {
        const { items, size, font, x = this.currentX, y = this.currentY } = props;
        const bullet = '• ';
        const lineHeight = size * 1.6;
        const actualY = this.page.getHeight() - y;
        let currentY = actualY;
        let totalHeight = 0;

        items.forEach((item) => {
            if (item === '') {
                return;
            }

            const { paragraphs, emptyLineHeight } = this.#processParagraphs(item, size);
            totalHeight += emptyLineHeight;
            paragraphs.forEach((paragraph, index) => {
                const lines = this.#splitTextIntoLines(paragraph, size, font);
                lines.forEach((line, lineIndex) => {
                    const text = lineIndex === 0 ? bullet + line : '   ' + line; // Add bullet only to the first line

                    this.page.drawText(text, { x, y: currentY, size, font, color: rgb(0, 0, 0) });
                    currentY -= lineHeight;
                    totalHeight += lineHeight;
                });

                if (index < paragraphs.length - 1) {
                    currentY -= lineHeight; // Add extra line height between paragraphs
                    totalHeight += lineHeight;
                }
            });
        });

        return totalHeight;
    }

    protected drawSkillsChart(skills: TopSkill[], textSize: number): void {
        const barWidth = COLUMN_WIDTH;
        const barHeight = 10;
        const barGap = 5;
        const maxYears = 10;

        let counter = 0;

        for (let index = 0; index < skills.length; index++) {
            if (counter >= MAX_TOP_SKILLS) {
                return;
            }

            const skill = skills[index];
            if (!skill.yearsOfExperience || !skill.name) {
                continue;
            }

            this.currentY += barGap;

            this.drawRectangle({
                x: this.currentX,
                y: this.currentY,
                width: barWidth,
                height: barHeight,
                color: rgb(0.9, 0.9, 0.9),
            });

            const filledWidth = Math.min((skill.yearsOfExperience / maxYears) * barWidth, barWidth);
            this.currentY += this.drawRectangle({
                x: this.currentX,
                y: this.currentY,
                width: filledWidth,
                height: barHeight,
                color: rgb(0.2, 0.2, 0.2),
            });

            this.currentY += this.drawText({
                text: skill.name,
                size: textSize,
                font: this.textFont,
                y: this.currentY,
                x: this.currentX,
            });

            this.currentY += barGap;

            counter++;
        }
    }

    #processParagraphs(text: string, size: number): { paragraphs: string[]; emptyLineHeight: number } {
        const paragraphs = text
            .replace(/\r\n/g, '\n')
            .replace(/\n{2,}/g, '\n\n')
            .split('\n\n');

        const emptyLines = (text.match(/\n{2,}/g) || []).length;
        const emptyLineHeight = emptyLines * size * 1.6;

        return { paragraphs, emptyLineHeight };
    }

    #splitTextIntoLines(text: string, size: number, font: PDFFont, maxWidth: number = 240): string[] {
        const words = text.replace(/\n/g, ' ').split(' '); // Replace newline characters with spaces
        const lines: string[] = [];
        let currentLine = '';

        words.forEach((word) => {
            const testLine = currentLine + word + ' ';
            const testWidth = font.widthOfTextAtSize(testLine, size);
            if (testWidth > maxWidth && currentLine !== '') {
                lines.push(currentLine.trim());
                currentLine = word + ' ';
            } else {
                currentLine = testLine;
            }
        });

        if (currentLine) {
            lines.push(currentLine.trim());
        }

        return lines;
    }
}
