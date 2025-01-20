import { getDummyResume } from '@/utils/dummyResume';
import { vi } from 'vitest';

const mockStore = {
    ...getDummyResume(),
    reset: vi.fn(() => {
        mockStore.general.profilePhoto = '';
        mockStore.general.name.firstName = '';
        mockStore.general.name.lastName = '';
    }),
    clearTopSkills: vi.fn(() => {
        mockStore.topSkills = [];
    }),
    addTopSkill: vi.fn(),
    clearProfilePhoto: vi.fn(),
    updateProfilePhoto: vi.fn(),
    updateName: vi.fn(),
    updateContact: vi.fn(),
    updateRegion: vi.fn(),
    updateDrivingLicense: vi.fn(),
    updateIntroduction: vi.fn(),
    updateAchievement: vi.fn(),
    updateColleaguesDescribe: vi.fn(),
    updateColleaguesKnow: vi.fn(),
    updateFunctionTitle: vi.fn(),
    setJobs: vi.fn(),
    setPersonalProjects: vi.fn(),
    setLanguages: vi.fn(),
    setCompetencies: vi.fn(),
    setInterests: vi.fn(),
};

export const useResumeStore = () => mockStore;
