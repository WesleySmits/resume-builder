import { vi } from 'vitest';

HTMLCanvasElement.prototype.getContext = vi.fn();

export const resumeInitialState: ResumeData = {
    general: {
        name: {
            firstName: 'Jon',
            middleName: '',
            lastName: 'Snow',
            displayName: '',
        },
        profilePhoto: 'wrs.wesley.jpg',
        region: 'The Wall',
        contact: {
            email: 'jon.snow@resume-maker.io',
            phone: '123123123',
        },
        drivingLicense: 'Car',
        functionTitle: 'Watch Commander',
        introduction: 'I am the sword in the darkness.',
        achievements: ['Defeated the Night King', 'Knows nothing', 'King in the North'],
        colleaguesDescribe: 'Brave',
        colleaguesKnow: 'Loyal',
    },
    skills: {
        languages: ['HTML', 'CSS', 'JavaScript'],
        frameworks: ['Vue.js'],
        platforms: ['Node.js'],
        methodologies: ['Agile'],
        databases: ['MongoDB'],
        tools: ['Git'],
        operatingSystems: ['MacOS'],
    },
    topSkills: [],
    education: [],
    certifications: [],
};
localStorage.setItem('resumeData', JSON.stringify(resumeInitialState));
