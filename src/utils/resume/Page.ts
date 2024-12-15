import type { PDFDocument, PDFFont, PDFPage } from 'pdf-lib';
import { rgb, StandardFonts } from 'pdf-lib';

import * as en from '@/locales/en.json';
import * as nl from '@/locales/nl.json';
import { base64ToUint8Array } from '../base64';

const locales: Record<Locales, Record<string, string>> = {
    en: en,
    nl: nl,
};

export function getLocalizedString(key: string, lang: Locales = 'en'): string {
    return locales[lang][key] || key;
}

const SPACING = 10;
const VERTICAL_EDGE_SPACING = 100;
const HORIZONTAL_EDGE_SPACING = 60;
const RIGHT_COLUMN_START = 295;

export default class Page {
    #document: PDFDocument | null = null;
    protected page: PDFPage = null as unknown as PDFPage;

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
        this.fontData.regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
        this.fontData.bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        this.textFont = this.fontData.regular;
        this.titleFont = this.fontData.bold;

        this.currentX = HORIZONTAL_EDGE_SPACING;
        this.currentY = VERTICAL_EDGE_SPACING;

        this.#document = pdfDoc;
        this.page = this.addPage();
    }

    protected drawField(props: FieldData): void {
        if (this.page === null) {
            throw new Error('Page not initialized');
        }

        if (this.titleFont === null || this.textFont === null) {
            throw new Error('Fonts not initialized');
        }

        if (props.needsSpacing) {
            this.currentY += SPACING;
        }

        if (props.title) {
            this.currentY += this.drawText({
                text: props.title,
                size: this.titleSize,
                font: this.titleFont,
                centerText: props.centerText,
            });
        }

        if (props.text) {
            this.currentY += this.drawText({
                text: props.text,
                size: this.textSize,
                font: this.textFont,
                centerText: props.centerText,
            });
        }

        if (props.bulletList) {
            this.currentY += this.drawBulletedList({
                items: props.bulletList,
                size: this.textSize,
                font: this.textFont,
            });
        }
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

        return this.#document.addPage([595.28, 841.89]);
    }

    protected async drawImage(src: string, width: number = 140, height: number = 140): Promise<void> {
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
        console.log('location', this.currentY, actualY, width, height);
        this.page.drawImage(image, {
            x: this.currentX,
            y: actualY,
            width,
            height,
        });
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
