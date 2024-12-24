import './setupTests';
import { resumeInitialState } from './setupTests';
import { setActivePinia, createPinia } from 'pinia';
import { useResumeStore } from '../resume';
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('@/utils/image', () => ({
    roundImage: vi.fn().mockResolvedValue('data:image/jpeg;base64,'),
    convertImageToBase64: vi.fn().mockResolvedValue('data:image/jpeg;base64,'),
}));

describe('useResumeStore', () => {
    beforeEach(() => {
        localStorage.setItem('resumeData', JSON.stringify(resumeInitialState));
        setActivePinia(createPinia());
    });

    it('initializes with the correct state', () => {
        const store = useResumeStore();
        expect(store.general.name.firstName).toBe('Jon');
        expect(store.general.name.middleName).toBe('');
        expect(store.general.name.lastName).toBe('Snow');
        expect(store.general.name.displayName).toBe('');
        expect(store.general.contact.email).toBe('jon.snow@resume-maker.io');
        expect(store.general.contact.phone).toBe('123123123');
        expect(store.general.region).toBe('The Wall');
        expect(store.general.drivingLicense).toBe('Car');
        expect(store.general.functionTitle).toBe('Watch Commander');
        expect(store.general.introduction).toBe('I am the sword in the darkness.');
        expect(store.general.achievements).toEqual(['Defeated the Night King', 'Knows nothing', 'King in the North']);
        expect(store.general.colleaguesDescribe).toBe('Brave');
        expect(store.general.colleaguesKnow).toBe('Loyal');
        expect(store.skills.languages).toEqual([]);
        expect(store.skills.frameworks).toEqual([]);
        expect(store.skills.platforms).toEqual([]);
        expect(store.skills.methodologies).toEqual([]);
        expect(store.skills.operatingSystems).toEqual([]);
        expect(store.skills.databases).toEqual([]);
        expect(store.skills.tools).toEqual([]);
    });

    it('initializes with empty default state', () => {
        localStorage.removeItem('resumeData');
        const store = useResumeStore();
        store.reset();
        expect(store.general.name.firstName).toBe('');
        expect(store.general.name.middleName).toBe('');
        expect(store.general.name.lastName).toBe('');
        expect(store.general.name.displayName).toBe('');
        expect(store.general.contact.email).toBe('');
        expect(store.general.contact.phone).toBe('');
        expect(store.general.region).toBe('');
        expect(store.general.drivingLicense).toBe(undefined);
        expect(store.general.functionTitle).toBe('');
        expect(store.general.introduction).toBe('');
        expect(store.general.achievements).toEqual(['', '', '']);
        expect(store.general.colleaguesDescribe).toBe('');
        expect(store.general.colleaguesKnow).toBe('');
        expect(store.skills.languages).toEqual([]);
        expect(store.skills.frameworks).toEqual([]);
        expect(store.skills.platforms).toEqual([]);
        expect(store.skills.methodologies).toEqual([]);
        expect(store.skills.operatingSystems).toEqual([]);
        expect(store.skills.databases).toEqual([]);
        expect(store.skills.tools).toEqual([]);
    });

    it('formattedName getter returns the correct name', () => {
        const store = useResumeStore();
        store.general.name.firstName = 'John';
        store.general.name.middleName = 'Doe';
        store.general.name.lastName = 'Smith';
        expect(store.formattedName).toBe('John Doe Smith');
    });

    it('profilePhotoUrl getter returns the correct URL', () => {
        const store = useResumeStore();
        expect(store.profilePhotoUrl).toBe('wrs.wesley.jpg');
    });

    it('updateProfilePhoto action updates the profile photo', async () => {
        const store = useResumeStore();
        const file = new File([''], 'photo.jpg', { type: 'image/jpeg' });
        await store.updateProfilePhoto(file);
        expect(store.general.profilePhoto).toEqual('data:image/jpeg;base64,');
    });

    it('updateName action updates the name', () => {
        const store = useResumeStore();
        const name = { firstName: 'Jane', middleName: 'Doe', lastName: 'Smith', displayName: 'Jane Smith' };
        store.updateName(name);
        expect(store.general.name).toEqual(name);
    });

    it('updateRegion action updates the region', () => {
        const store = useResumeStore();
        store.updateRegion('New York');
        expect(store.general.region).toBe('New York');
    });

    it('updateDrivingLicense action updates the driving license', () => {
        const store = useResumeStore();
        const license = 'Car';
        store.updateDrivingLicense(license);
        expect(store.general.drivingLicense).toEqual(license);
    });

    it('updateFunctionTitle action updates the function title', () => {
        const store = useResumeStore();
        store.updateFunctionTitle('Software Engineer');
        expect(store.general.functionTitle).toBe('Software Engineer');
    });

    it('updateIntroduction action updates the introduction', () => {
        const store = useResumeStore();
        store.updateIntroduction('Hello, I am a software engineer.');
        expect(store.general.introduction).toBe('Hello, I am a software engineer.');
    });

    it('updateAchievement action updates the achievements', () => {
        const store = useResumeStore();
        store.updateAchievement(0, 'Achievement 1');
        expect(store.general.achievements[0]).toBe('Achievement 1');
    });

    it('updateColleaguesDescribe action updates the colleagues describe', () => {
        const store = useResumeStore();
        store.updateColleaguesDescribe('Hardworking');
        expect(store.general.colleaguesDescribe).toBe('Hardworking');
    });

    it('updateColleaguesKnow action updates the colleagues know', () => {
        const store = useResumeStore();
        store.updateColleaguesKnow('Team player');
        expect(store.general.colleaguesKnow).toBe('Team player');
    });

    it('updateContact action updates the contact', () => {
        const store = useResumeStore();
        const contact = { email: 'jane@example.com', phone: '1234567890' };
        store.updateContact(contact);
        expect(store.general.contact).toEqual(contact);
    });

    it('updateSkills action updates the skills', () => {
        const store = useResumeStore();
        const skills = {
            languages: ['JavaScript'],
            frameworks: ['Vue'],
            platforms: ['Node.js'],
            methodologies: ['Agile'],
            operatingSystems: ['Linux'],
            databases: ['MongoDB'],
            tools: ['Git'],
        };
        store.updateSkills(skills);
        expect(store.skills).toEqual(skills);
    });

    it('updateSkillsLanguages action updates the languages', () => {
        const store = useResumeStore();
        const languages = ['JavaScript', 'TypeScript'];
        store.updateSkillsLanguages(languages);
        expect(store.skills.languages).toEqual(languages);
    });

    it('updateSkillsFrameworks action updates the frameworks', () => {
        const store = useResumeStore();
        const frameworks = ['Vue', 'React'];
        store.updateSkillsFrameworks(frameworks);
        expect(store.skills.frameworks).toEqual(frameworks);
    });

    it('updateSkillsPlatforms action updates the platforms', () => {
        const store = useResumeStore();
        const platforms = ['Node.js', 'Deno'];
        store.updateSkillsPlatforms(platforms);
        expect(store.skills.platforms).toEqual(platforms);
    });

    it('updateSkillsMethodologies action updates the methodologies', () => {
        const store = useResumeStore();
        const methodologies = ['Agile', 'Scrum'];
        store.updateSkillsMethodologies(methodologies);
        expect(store.skills.methodologies).toEqual(methodologies);
    });

    it('updateSkillsOperatingSystems action updates the operating systems', () => {
        const store = useResumeStore();
        const operatingSystems = ['Linux', 'Windows'];
        store.updateSkillsOperatingSystems(operatingSystems);
        expect(store.skills.operatingSystems).toEqual(operatingSystems);
    });

    it('updateSkillsDatabases action updates the databases', () => {
        const store = useResumeStore();
        const databases = ['MongoDB', 'PostgreSQL'];
        store.updateSkillsDatabases(databases);
        expect(store.skills.databases).toEqual(databases);
    });

    it('updateSkillsTools action updates the tools', () => {
        const store = useResumeStore();
        const tools = ['Git', 'Docker'];
        store.updateSkillsTools(tools);
        expect(store.skills.tools).toEqual(tools);
    });
});
