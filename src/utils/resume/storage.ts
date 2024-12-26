export function loadResumeData(): ResumeData | undefined {
    const storedResumeData = localStorage.getItem('resumeData');
    if (!storedResumeData) {
        return undefined;
    }

    try {
        return JSON.parse(storedResumeData) as ResumeData;
    } catch (error) {
        console.error('Failed to parse resume data from localStorage:', error);
        return undefined;
    }
}
