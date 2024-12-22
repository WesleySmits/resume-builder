// import { PDFFont, PDFPage, rgb } from 'pdf-lib';

// export function addPage(pdfDoc: PDFDocument) {
//     return pdfDoc.addPage([595.28, 841.89]);
// }

// export function drawText(
//     text: string,
//     x: number,
//     y: number,
//     size = 12,
//     font: PDFFont,
//     page: PDFPage,
//     maxWidth: number = 240,
// ): number {
//     const actualY = page.getHeight() - y;
//     const textOptions = { x, y: actualY, size, font, color: rgb(0, 0, 0), lineHeight: size * 1.6, maxWidth };

//     const { paragraphs, emptyLineHeight } = processParagraphs(text, size);
//     let currentY = actualY;
//     let totalHeight = emptyLineHeight;

//     paragraphs.forEach((paragraph, index) => {
//         const lines = paragraph.replace(/\n/g, ' ').split(' ');
//         let line = '';
//         lines.forEach((word) => {
//             const testLine = line + word + ' ';
//             const width = font.widthOfTextAtSize(testLine, size);
//             if (width > maxWidth && line !== '') {
//                 page.drawText(line.trim(), { ...textOptions, y: currentY });
//                 line = word + ' ';
//                 currentY -= size * 1.6;
//                 totalHeight += size * 1.6;
//             } else {
//                 line = testLine;
//             }
//         });
//         page.drawText(line.trim(), { ...textOptions, y: currentY });
//         currentY -= size * 1.6;
//         totalHeight += size * 1.6;

//         if (index < paragraphs.length - 1) {
//             currentY -= size * 1.6; // Add extra space between paragraphs
//         }
//     });

//     return totalHeight;
// }

// export function drawBulletedList(
//     items: string[],
//     x: number,
//     y: number,
//     size: number,
//     font: PDFFont,
//     page: PDFPage,
// ): number {
//     const bullet = '• ';
//     const lineHeight = size * 1.6;
//     const actualY = page.getHeight() - y;
//     let currentY = actualY;
//     let totalHeight = 0;

//     items.forEach((item) => {
//         if (item === '') {
//             return;
//         }

//         const { paragraphs, emptyLineHeight } = processParagraphs(item, size);
//         totalHeight += emptyLineHeight;
//         paragraphs.forEach((paragraph, index) => {
//             const lines = splitTextIntoLines(paragraph, size, font);
//             lines.forEach((line, lineIndex) => {
//                 const text = lineIndex === 0 ? bullet + line : '   ' + line; // Add bullet only to the first line

//                 page.drawText(text, { x, y: currentY, size, font, color: rgb(0, 0, 0) });
//                 currentY -= lineHeight;
//                 totalHeight += lineHeight;
//             });

//             if (index < paragraphs.length - 1) {
//                 currentY -= lineHeight; // Add extra line height between paragraphs
//                 totalHeight += lineHeight;
//             }
//         });
//     });

//     return totalHeight;
// }

// function processParagraphs(text: string, size: number): { paragraphs: string[]; emptyLineHeight: number } {
//     const paragraphs = text
//         .replace(/\r\n/g, '\n')
//         .replace(/\n{2,}/g, '\n\n')
//         .split('\n\n');

//     const emptyLines = (text.match(/\n{2,}/g) || []).length;
//     const emptyLineHeight = emptyLines * size * 1.6;

//     return { paragraphs, emptyLineHeight };
// }

// function splitTextIntoLines(text: string, size: number, font: PDFFont, maxWidth: number = 240): string[] {
//     const words = text.replace(/\n/g, ' ').split(' '); // Replace newline characters with spaces
//     const lines: string[] = [];
//     let currentLine = '';

//     words.forEach((word) => {
//         const testLine = currentLine + word + ' ';
//         const testWidth = font.widthOfTextAtSize(testLine, size);
//         if (testWidth > maxWidth && currentLine !== '') {
//             lines.push(currentLine.trim());
//             currentLine = word + ' ';
//         } else {
//             currentLine = testLine;
//         }
//     });

//     if (currentLine) {
//         lines.push(currentLine.trim());
//     }

//     return lines;
// }
