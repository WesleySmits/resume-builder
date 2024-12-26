export const resumeInitialState: ResumeData = {
    general: {
        name: {
            firstName: 'Jon',
            middleName: '',
            lastName: 'Snow',
            displayName: '',
        },
        profilePhoto: 'data:image/jpeg;base64,',
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
        languages: [],
        frameworks: [],
        platforms: [],
        methodologies: [],
        databases: [],
        tools: [],
        operatingSystems: [],
    },
};
localStorage.setItem('resumeData', JSON.stringify(resumeInitialState));
