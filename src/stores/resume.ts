import { roundImage } from '@/utils/image';
import { defineStore } from 'pinia';
import { reactive, watch } from 'vue';

export interface Name {
    firstName: string;
    middleName: string;
    lastName: string;
    displayName: string;
}

export interface Contact {
    email: string;
    phone: string;
}

export type DrivingLicense = 'Car' | 'Motorcycle' | 'Truck' | 'Bus';

export interface General {
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

export interface Skills {
    languages: string[];
    frameworks: string[];
    platforms: string[];
    methodologies: string[];
    operatingSystems: string[];
    databases: string[];
    tools: string[];
}

export interface ResumeData {
    general: General;
    skills: Skills;
}

const storedResumeData = localStorage.getItem('resumeData');
const parsedResumeData = storedResumeData ? JSON.parse(storedResumeData) : undefined;

export const useResumeStore = defineStore('resume', {
    state: () => ({
        general: reactive<General>({
            profilePhoto: parsedResumeData?.general?.profilePhoto ?? undefined,
            name: parsedResumeData?.general?.name ?? {
                firstName: '',
                middleName: '',
                lastName: '',
                displayName: '',
            },
            region: parsedResumeData?.general?.region ?? undefined,
            drivingLicense: parsedResumeData?.general?.drivingLicense ?? undefined,
            functionTitle: parsedResumeData?.general?.functionTitle ?? undefined,
            introduction: parsedResumeData?.general?.introduction ?? undefined,
            achievements: parsedResumeData?.general?.achievements ?? new Array(3).fill(''),
            colleaguesDescribe: parsedResumeData?.general?.colleaguesDescribe ?? undefined,
            colleaguesKnow: parsedResumeData?.general?.colleaguesKnow ?? undefined,
            contact: {
                email: parsedResumeData?.general?.contact?.email ?? '',
                phone: parsedResumeData?.general?.contact?.phone ?? '',
            },
        }),
        skills: reactive<Skills>({
            languages: parsedResumeData?.skills?.languages ?? [],
            frameworks: parsedResumeData?.skills?.frameworks ?? [],
            platforms: parsedResumeData?.skills?.platforms ?? [],
            methodologies: parsedResumeData?.skills?.methodologies ?? [],
            operatingSystems: parsedResumeData?.skills?.operatingSystems ?? [],
            databases: parsedResumeData?.skills?.databases ?? [],
            tools: parsedResumeData?.skills?.tools ?? [],
        }),
    }),
    getters: {
        formattedName: (state) => {
            if (state.general.name?.displayName) {
                return state.general.name.displayName;
            }

            const { firstName = '', middleName = '', lastName = '' } = state.general.name || {};
            return [firstName, middleName, lastName].filter(Boolean).join(' ').trim();
        },
        profilePhotoUrl: (state) => {
            const profilePhoto = state.general.profilePhoto;

            if (typeof profilePhoto === 'string') {
                return profilePhoto;
            }

            if (typeof profilePhoto === 'object' && Object.keys(profilePhoto).length === 0) {
                console.error('Profile photo is an empty object');
                return '';
            }

            return profilePhoto ? URL.createObjectURL(profilePhoto) : undefined;
        },
    },
    actions: {
        async updateProfilePhoto(profilePhoto: File) {
            // convert File to base64
            const reader = new FileReader();
            reader.readAsDataURL(profilePhoto);
            reader.onload = async () => {
                const base64 = reader.result as string;
                const roundedBase64 = await roundImage(base64, 140, 140);
                this.general.profilePhoto = roundedBase64;
            };
        },
        updateName(name: Name) {
            this.general.name = name;
        },
        updateRegion(region: string) {
            this.general.region = region;
        },
        updateDrivingLicense(license: DrivingLicense) {
            this.general.drivingLicense = license;
        },
        updateFunctionTitle(title: string) {
            this.general.functionTitle = title;
        },
        updateIntroduction(introduction: string) {
            this.general.introduction = introduction;
        },
        updateAchievement(index: number, achievement: string) {
            if (!this.general.achievements) {
                this.general.achievements = [];
            }

            this.general.achievements[index] = achievement;
        },
        updateColleaguesDescribe(description: string) {
            this.general.colleaguesDescribe = description;
        },
        updateColleaguesKnow(know: string) {
            this.general.colleaguesKnow = know;
        },
        updateContact(contact: Contact) {
            this.general.contact = contact;
        },
        updateSkills(skills: Skills) {
            this.skills = skills;
        },
        updateSkillsLanguages(languages: string[]) {
            this.skills.languages = languages;
        },
        updateSkillsFrameworks(frameworks: string[]) {
            this.skills.frameworks = frameworks;
        },
        updateSkillsPlatforms(platforms: string[]) {
            this.skills.platforms = platforms;
        },
        updateSkillsMethodologies(methodologies: string[]) {
            this.skills.methodologies = methodologies;
        },
        updateSkillsOperatingSystems(operatingSystems: string[]) {
            this.skills.operatingSystems = operatingSystems;
        },
        updateSkillsDatabases(databases: string[]) {
            this.skills.databases = databases;
        },
        updateSkillsTools(tools: string[]) {
            this.skills.tools = tools;
        },
    },
});

/**
 * @deprecated
 */
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
    skills: {
        languages: parsedResumeData?.skills?.languages ?? [],
        frameworks: parsedResumeData?.skills?.frameworks ?? [],
        platforms: parsedResumeData?.skills?.platforms ?? [],
        methodologies: parsedResumeData?.skills?.methodologies ?? [],
        operatingSystems: parsedResumeData?.skills?.operatingSystems ?? [],
        databases: parsedResumeData?.skills?.databases ?? [],
        tools: parsedResumeData?.skills?.tools ?? [],
    },
});

export function initializeStore() {
    const resumeStore = useResumeStore();
    watch(
        () => resumeStore.$state,
        (newValue) => {
            localStorage.setItem('resumeData', JSON.stringify(newValue));
        },
        { deep: true },
    );
}
