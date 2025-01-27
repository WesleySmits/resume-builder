export function getDummyResume(): ResumeData {
    return {
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
            achievements: ['Defeated the Night King.. \n and his dragon.. \n Sort of', '', 'King in the North'],
            introduction:
                'I am the sword in the darkness. \n I am the watcher on the walls. \n I am the shield that guards the realms',
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
        education: [
            {
                institution: 'Apple School',
                degree: 'Master of Pears',
                fieldOfStudy: 'Healthcare',
                location: 'The Stars',
                startDate: '1970-01-01',
                endDate: '1970-01-02',
                description: 'Extensive study of fruits.',
            },
        ],
        certifications: [
            {
                title: 'Certification 1',
                provider: 'Provider 1',
                completed: true,
                year: 2021,
            },
        ],
        jobs: [
            {
                company: 'University of the Banana',
                location: 'Online',
                period: {
                    startDate: '2001-01-01',
                    endDate: '2023-01-01',
                },
                description: 'This was a very tough 5-minute job.',
                role: '',
                responsibilities: ['Being awesome'],
                industry: 'Education',
                skills: {
                    languages: ['JavaScript', 'TypeScript'],
                    frameworks: ['Vue.js', 'React'],
                    platforms: ['Node.js', 'Docker'],
                    methodologies: ['Agile', 'Scrum'],
                    databases: ['MongoDB', 'PostgreSQL'],
                    tools: ['Git', 'Docker'],
                    operatingSystems: ['Windows', 'Linux'],
                },
            },
        ],
        personalProjects: [
            {
                title: 'Project 1',
                description: 'This was a very tough 5-minute project.',
                period: {
                    startDate: '2001-01-01',
                    endDate: '2023-01-01',
                },
                skills: {
                    languages: ['JavaScript', 'TypeScript'],
                    frameworks: ['Vue.js', 'React'],
                    platforms: ['Node.js', 'Docker'],
                    methodologies: ['Agile', 'Scrum'],
                    databases: ['MongoDB', 'PostgreSQL'],
                    tools: ['Git', 'Docker'],
                    operatingSystems: ['Windows', 'Linux'],
                },
            },
            {
                title: 'Project 2',
                description: 'This was a very tough 5-minute project.',
                skills: {
                    languages: ['JavaScript', 'TypeScript'],
                    frameworks: ['Vue.js', 'React'],
                    platforms: ['Node.js', 'Docker'],
                    methodologies: ['Agile', 'Scrum'],
                    databases: ['MongoDB', 'PostgreSQL'],
                    tools: ['Git', 'Docker'],
                    operatingSystems: ['Windows', 'Linux'],
                },
            },
        ],
        languages: [
            {
                name: 'English',
                experience: 'Fluent/Native',
            },
        ],
        competencies: ['Problem Solving', 'Teamwork', '', 'Analytical Thinking'],
        interests: [
            'Programming',
            'Star Wars',
            'Game of Thrones',
            'Golf',
            'Skiing',
            'Hiking',
            'Camping',
            'Cooking',
            'Reading',
            'Music',
            'Movies',
            'Traveling',
            'Photography',
            'Gaming',
            'Sports',
            'Technology',
            'Science',
            'History',
            'Art',
            'Nature',
        ],
    };
}

export function setupDummyResume(): ResumeData {
    const resumeInitialState = getDummyResume();
    localStorage.setItem('resumeData', JSON.stringify(resumeInitialState));
    return resumeInitialState;
}
