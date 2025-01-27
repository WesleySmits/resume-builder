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

interface DrawRectangleProps {
    x: number;
    y: number;
    width: number;
    height: number;
    color: RGB;
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

interface Education {
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
}

interface Certification {
    title: string;
    provider: string;
    completed: boolean;
    year?: number;
}

interface Period {
    startDate: string;
    endDate?: string;
}

interface Job {
    company: string;
    location?: string;
    period: Period;
    role: string;
    industry: string;
    skills: Skills;
    description: string;
    responsibilities: string[];
}

interface PersonalProject {
    title: string;
    skills: Skills;
    description: string;
    period?: Period;
}

type LanguageExperienceLevel = 'Fluent/Native' | 'Advanced' | 'Intermediate' | 'Beginner';

interface Language {
    name: string;
    experience: LanguageExperienceLevel;
}
interface ResumeData {
    general: General;
    skills: Skills;
    topSkills: TopSkill[];
    education: Education[];
    certifications: Certification[];
    jobs: Job[];
    personalProjects: PersonalProject[];
    languages: Language[];
    competencies: string[];
    interests: string[];
}
