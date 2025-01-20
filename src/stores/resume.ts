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
    education: [],
    certifications: [],
    jobs: [],
    personalProjects: [],
    languages: [],
    competencies: [],
    interests: [],
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
        education: ref<Education[]>(parsedResumeData?.education ?? []),
        certifications: ref<Certification[]>(parsedResumeData?.certifications ?? []),
        jobs: ref<Job[]>(parsedResumeData?.jobs ?? []),
        personalProjects: ref<PersonalProject[]>(parsedResumeData?.personalProjects ?? []),
        languages: ref<Language[]>(parsedResumeData?.languages ?? []),
        competencies: ref<string[]>(parsedResumeData?.competencies ?? []),
        interests: ref<string[]>(parsedResumeData?.interests ?? []),
    }),
    getters: {
        formattedName: (state) => {
            if (state.general.name?.displayName) {
                return state.general.name.displayName;
            }

            const { firstName = '', middleName = '', lastName = '' } = state.general.name || {};
            return [firstName, middleName, lastName].filter(Boolean).join(' ').trim();
        },
    },
    actions: {
        reset() {
            this.general = { ...defaultResumeState.general };
            this.skills = { ...defaultResumeState.skills };
            this.topSkills = [];
        },
        async updateProfilePhoto(profilePhoto: File) {
            try {
                if (!profilePhoto.type.startsWith('image/')) {
                    throw new Error('File is not an image');
                }

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
        setTopSkills(newTopSkills: TopSkill[]): void {
            this.topSkills = newTopSkills;
        },
        clearTopSkills() {
            this.topSkills = [];
        },
        setEducation(newEducation: Education[]): void {
            this.education = newEducation;
        },
        setCertifications(newCertifications: Certification[]): void {
            this.certifications = newCertifications;
        },
        setJobs(newJobs: Job[]): void {
            this.jobs = newJobs.sort(
                (a, b) => new Date(b.period.startDate).getTime() - new Date(a.period.startDate).getTime(),
            );
        },
        setPersonalProjects(newProjects: PersonalProject[]): void {
            this.personalProjects = newProjects.sort((a, b) => {
                if (a.period && b.period) {
                    return new Date(b.period.startDate).getTime() - new Date(a.period.startDate).getTime();
                }

                return 0;
            });
        },
        setLanguages(newLanguages: Language[]): void {
            const experienceOrder: LanguageExperienceLevel[] = [
                'Fluent/Native',
                'Advanced',
                'Intermediate',
                'Beginner',
            ];

            this.languages = newLanguages.sort((a, b) => {
                return experienceOrder.indexOf(a.experience) - experienceOrder.indexOf(b.experience);
            });
        },
        setCompetencies(newCompetencies: string[]): void {
            this.competencies = newCompetencies;
        },
        setInterests(newInterests: string[]): void {
            this.interests = newInterests;
        },
    },
});
