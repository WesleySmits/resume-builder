export function getDummyResume(): ResumeData {
    return {
        general: {
            name: {
                firstName: 'Jon',
                middleName: '',
                lastName: 'Snow',
                displayName: '',
            },
            profilePhoto: '',
            region: 'The Wall',
            contact: {
                email: 'jon.snow@resume-maker.io',
                phone: '123123123',
            },
            drivingLicense: 'Car',
            functionTitle: 'Watch Commander',
            achievements: ['Defeated the Night King', 'Knows nothing', 'King in the North'],
            introduction: 'I am the sword in the darkness.',
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
        topSkills: [
            {
                name: 'JavaScript',
                yearsOfExperience: 10,
            },
            {
                name: 'TypeScript',
                yearsOfExperience: 6,
            },
        ],
        education: [],
        certifications: [],
        jobs: [],
        personalProjects: [],
    };
}

export function setupDummyResume(): ResumeData {
    const resumeInitialState = getDummyResume();
    localStorage.setItem('resumeData', JSON.stringify(resumeInitialState));
    return resumeInitialState;
}
