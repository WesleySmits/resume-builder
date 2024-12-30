import { convertImageToBase64, roundImage } from '@/utils/image';
import { loadResumeData } from '@/utils/resume/storage';
import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

const parsedResumeData = loadResumeData();

const defaultResumeState: ResumeData = {
    general: {
        profilePhoto: '',
        name: {
            firstName: '',
            middleName: '',
            lastName: '',
            displayName: '',
        },
        region: '',
        drivingLicense: undefined,
        functionTitle: '',
        introduction: '',
        achievements: ['', '', ''],
        colleaguesDescribe: '',
        colleaguesKnow: '',
        contact: {
            email: '',
            phone: '',
        },
    },
    skills: {
        languages: [],
        frameworks: [],
        platforms: [],
        methodologies: [],
        operatingSystems: [],
        databases: [],
        tools: [],
    },
    topSkills: [],
};

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
        topSkills: ref<TopSkill[]>(parsedResumeData?.topSkills ?? []),
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
        reset() {
            // this.$state = { ...defaultResumeState };
            this.general = { ...defaultResumeState.general };
            this.skills = { ...defaultResumeState.skills };
            this.topSkills = [];
        },
        async updateProfilePhoto(profilePhoto: File) {
            try {
                const base64 = await convertImageToBase64(profilePhoto);
                const roundedBase64 = await roundImage(base64, 200, 200);
                this.general.profilePhoto = roundedBase64;
            } catch (error) {
                console.error('Error processing profile photo:', error);
            }
        },
        clearProfilePhoto() {
            this.general.profilePhoto = '';
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
        addTopSkill(skill: TopSkill) {
            this.topSkills.push(skill);
        },
        updateTopSkill(index: number, skill: TopSkill) {
            this.topSkills[index] = skill;
        },
        removeTopSkill(index: number) {
            this.topSkills.splice(index, 1);
        },
        sortTopSkills() {
            this.topSkills.sort((a, b) => b.yearsOfExperience - a.yearsOfExperience);
        },
        clearTopSkills() {
            this.topSkills = [];
        },
    },
});
