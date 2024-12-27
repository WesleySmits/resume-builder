declare module 'pdfjs-dist/build/pdf.min.mjs';

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

type LineProps = {
    horizontal: {
        start: number;
        end: number;
    };
    vertical: {
        start: number;
        end: number;
    };
    thickness: number;
    color: RGB;
};
interface FormField extends Partial<HTMLInputElement>, Partial<HTMLTextAreaElement>, Partial<HTMLSelectElement> {
    id: string;
    label: string;
    placeholder: string;
    helperText: string;
    required: boolean;
    modelValue?: string | string[];
    handleChange: (e: string | string[] | File, id?: string) => void;
    options?: { value: string; text: string }[];
}

interface FormFields {
    [key: string]: FormField;
}

interface Name {
    firstName: string;
    middleName: string;
    lastName: string;
    displayName: string;
}

interface Contact {
    email: string;
    phone: string;
}

type DrivingLicense = 'Car' | 'Motorcycle' | 'Truck' | 'Bus';

interface General {
    profilePhoto?: string;
    name: Name;
    region?: string;
    drivingLicense?: DrivingLicense;
    functionTitle?: string;
    introduction?: string;
    achievements: string[];
    colleaguesDescribe?: string;
    colleaguesKnow?: string;
    contact: Contact;
}

interface Skills {
    languages: string[];
    frameworks: string[];
    platforms: string[];
    methodologies: string[];
    operatingSystems: string[];
    databases: string[];
    tools: string[];
}

interface TopSkill {
    name: string;
    yearsOfExperience: number;
}

interface ResumeData {
    general: General;
    skills: Skills;
    topSkills: TopSkill[];
}
