declare module 'pdfjs-dist/build/pdf.worker.min.mjs';
declare module 'pdfjs-dist/legacy/build/pdf';

type FontData = {
    regular: PDFFont;
    bold: PDFFont;
};

type Locales = 'en' | 'nl';

type FieldData = {
    text?: string;
    title?: string;
    bulletList?: string[];
    needsSpacing?: boolean;
    centerText?: boolean;
};

interface DrawFieldProps {
    text: string;
    size: number;
    font: PDFFont;
    x?: number;
    y?: number;
    maxWidth?: number;
    centerText?: boolean;
}

interface DrawBulletedListProps {
    items: string[];
    size: number;
    font: PDFFont;
    x?: number;
    y?: number;
}

type RoundImageProps = {
    image: PDFImage;
    x: number;
    y: number;
    width: number;
    height: number;
};
