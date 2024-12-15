import { roundImage } from '@/utils/image';
import { reactive, watch } from 'vue';

export interface Name {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    displayName?: string;
}

export interface Contact {
    email?: string;
    phone?: string;
}

export type DrivingLicense = 'Car' | 'Motorcycle' | 'Truck' | 'Bus';

export interface General {
    profilePhoto?: string;
    name?: Name;
    region?: string;
    drivingLicense?: DrivingLicense;
    functionTitle?: string;
    introduction?: string;
    achievements?: string[];
    colleaguesDescribe?: string;
    colleaguesKnow?: string;
    contact?: Contact;
}

export interface ResumeData {
    general: General;
}

const storedResumeData = localStorage.getItem('resumeData');
const parsedResumeData = storedResumeData ? JSON.parse(storedResumeData) : undefined;

export const resumeData = reactive<ResumeData>({
    general: {
        profilePhoto: parsedResumeData?.general?.profilePhoto ?? undefined,
        name: parsedResumeData?.general?.name ?? undefined,
        region: parsedResumeData?.general?.region ?? undefined,
        drivingLicense: parsedResumeData?.general?.drivingLicense ?? undefined,
        functionTitle: parsedResumeData?.general?.functionTitle ?? undefined,
        introduction: parsedResumeData?.general?.introduction ?? undefined,
        achievements: parsedResumeData?.general?.achievements ?? undefined,
        colleaguesDescribe: parsedResumeData?.general?.colleaguesDescribe ?? undefined,
        colleaguesKnow: parsedResumeData?.general?.colleaguesKnow ?? undefined,
        contact: {
            email: parsedResumeData?.general?.contact?.email ?? undefined,
            phone: parsedResumeData?.general?.contact?.phone ?? undefined,
        },
    },
});

watch(
    resumeData,
    (newValue) => {
        localStorage.setItem('resumeData', JSON.stringify(newValue));
    },
    { deep: true },
);

export function getFormattedName(): string {
    if (resumeData.general.name?.displayName) {
        return resumeData.general.name.displayName;
    }

    const { firstName = '', middleName = '', lastName = '' } = resumeData.general.name || {};
    return [firstName, middleName, lastName].filter(Boolean).join(' ').trim();
}

export function updateName(name: Name) {
    resumeData.general.name = name;
}

export function updateProfilePhoto(profilePhoto: File) {
    // convert File to base64
    const reader = new FileReader();
    reader.readAsDataURL(profilePhoto);
    reader.onload = async () => {
        const base64 = reader.result as string;
        const roundedBase64 = await roundImage(base64, 140, 140);
        resumeData.general.profilePhoto = roundedBase64;
    };
}

export function updateRegion(region: string) {
    resumeData.general.region = region;
}

export function updateDrivingLicense(drivingLicense: DrivingLicense) {
    resumeData.general.drivingLicense = drivingLicense;
}

export function updateFunctionTitle(functionTitle: string) {
    resumeData.general.functionTitle = functionTitle;
}

export function updateIntroduction(introduction: string) {
    resumeData.general.introduction = introduction;
}

export function updateAchievement(index: number, achievement: string) {
    if (!resumeData.general.achievements) {
        resumeData.general.achievements = [];
    }

    resumeData.general.achievements[index] = achievement;
}

export function updateColleaguesDescribe(colleaguesDescribe: string) {
    resumeData.general.colleaguesDescribe = colleaguesDescribe;
}

export function updateColleaguesKnow(colleaguesKnow: string) {
    resumeData.general.colleaguesKnow = colleaguesKnow;
}

export function updateContact(contact: Contact) {
    resumeData.general.contact = contact;
}
