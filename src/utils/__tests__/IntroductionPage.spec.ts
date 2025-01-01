import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import IntroductionPage from '../resume/IntroductionPage';
import { createPinia, setActivePinia } from 'pinia';
import { PDFDocument } from 'pdf-lib';
import { PAGE_HEIGHT, PAGE_WIDTH } from '../resume/constants';
import { useResumeStore } from '@/stores/resume';
import { nextTick } from 'vue';

vi.mock('../image', () => ({
    base64ToUint8Array: vi.fn().mockReturnValue(new Uint8Array([1, 2, 3])),
}));

vi.mock('@/stores/resume', () => {
    const mockStore = {
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
            achievements: ['Knows nothing', '', 'King in the North \n\n Defeated the Night King'],
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
    };

    return {
        useResumeStore: () => mockStore,
    };
});

describe('IntroductionPage', () => {
    async function getPdfDocumentWithMocks(): Promise<PDFDocument> {
        const pdfDoc = await PDFDocument.create();
        const page = {
            drawImage: vi.fn().mockResolvedValue({}),
            drawText: vi.fn().mockResolvedValue({}),
            drawRectangle: vi.fn().mockResolvedValue({}),
            getHeight: vi.fn().mockReturnValue(841.89),
        };

        pdfDoc.embedJpg = vi.fn().mockResolvedValue([1, 2, 3]);
        pdfDoc.embedPng = vi.fn().mockResolvedValue([1, 2, 3]);

        pdfDoc.addPage = vi.fn().mockReturnValue(page);

        return pdfDoc;
    }

    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('should throw an error if PDFDocument is null', async () => {
        const introductionPage = IntroductionPage.getInstance();
        await expect(async () => {
            await introductionPage.initialize(null as unknown as PDFDocument);
        }).rejects.toThrow('PDFDocument is not set');
    });

    it('should add a page on initialize', async () => {
        const introductionPage = IntroductionPage.getInstance();
        const pdfDoc = await getPdfDocumentWithMocks();

        await introductionPage.initialize(pdfDoc);

        expect(pdfDoc.addPage).toHaveBeenCalledOnce();
        expect(pdfDoc.addPage).toHaveBeenCalledWith([PAGE_WIDTH, PAGE_HEIGHT]);
    });

    it('should render left and right column on initialize', async () => {
        const introductionPage = IntroductionPage.getInstance();
        const backupDrawLeftColumn = introductionPage.drawLeftColumn;
        const backupDrawRightColumn = introductionPage.drawRightColumn;

        introductionPage.drawLeftColumn = vi.fn();
        introductionPage.drawRightColumn = vi.fn();

        const pdfDoc = await getPdfDocumentWithMocks();

        await introductionPage.initialize(pdfDoc);

        expect(introductionPage.drawLeftColumn).toHaveBeenCalledOnce();
        expect(introductionPage.drawRightColumn).toHaveBeenCalledOnce();

        introductionPage.drawLeftColumn = backupDrawLeftColumn;
        introductionPage.drawRightColumn = backupDrawRightColumn;
    });

    it('should render correct data on the left column', async () => {
        const introductionPage = IntroductionPage.getInstance();
        const originalDrawRightColumn = introductionPage.drawRightColumn;
        introductionPage.drawRightColumn = vi.fn();

        const store = useResumeStore();
        const pdfDoc = await getPdfDocumentWithMocks();
        await introductionPage.initialize(pdfDoc);

        const page = pdfDoc.addPage();

        expect(page.drawImage).toHaveBeenCalledOnce();
        expect(page.drawImage).toHaveBeenCalledWith([1, 2, 3], {
            x: 60,
            y: 601.89,
            width: 140,
            height: 140,
        });

        expect(page.drawText).toHaveBeenCalledTimes(9);

        expect(page.drawText).toHaveBeenCalledWith('First Name', expect.any(Object));
        expect(page.drawText).toHaveBeenCalledWith(store.general.name.firstName, expect.any(Object));

        expect(page.drawText).toHaveBeenCalledWith('Region', expect.any(Object));
        expect(page.drawText).toHaveBeenCalledWith(store.general.region, expect.any(Object));

        expect(page.drawText).toHaveBeenCalledWith('Driving License', expect.any(Object));
        expect(page.drawText).toHaveBeenCalledWith(store.general.drivingLicense, expect.any(Object));

        expect(page.drawText).toHaveBeenCalledWith('Skills (experience in years)', expect.any(Object));
        expect(page.drawText).toHaveBeenCalledWith(store.topSkills[0].name, expect.any(Object));
        expect(page.drawText).toHaveBeenCalledWith(store.topSkills[1].name, expect.any(Object));

        expect(page.drawRectangle).toHaveBeenCalledTimes(store.topSkills.length * 2);

        introductionPage.drawRightColumn = originalDrawRightColumn;
    });

    it('should render the profile photo on the left column as a PNG', async () => {
        const introductionPage = IntroductionPage.getInstance();
        const originalDrawRightColumn = introductionPage.drawRightColumn;
        introductionPage.drawRightColumn = vi.fn();

        const store = useResumeStore();
        store.general.profilePhoto = 'data:image/png;base64,';

        const pdfDoc = await getPdfDocumentWithMocks();
        await introductionPage.initialize(pdfDoc);

        const page = pdfDoc.addPage();

        expect(page.drawImage).toHaveBeenCalledOnce();
        expect(page.drawImage).toHaveBeenCalledWith([1, 2, 3], {
            x: 60,
            y: 601.89,
            width: 140,
            height: 140,
        });

        introductionPage.drawRightColumn = originalDrawRightColumn;
    });

    it('should throw an error if the file type is not recognizes for the profile image', async () => {
        const introductionPage = IntroductionPage.getInstance();
        const originalDrawRightColumn = introductionPage.drawRightColumn;
        introductionPage.drawRightColumn = vi.fn();

        const store = useResumeStore();
        store.general.profilePhoto = 'data:image/WRS;base64,';

        const pdfDoc = await getPdfDocumentWithMocks();

        await expect(async () => {
            await introductionPage.initialize(pdfDoc);
        }).rejects.toThrow();

        introductionPage.drawRightColumn = originalDrawRightColumn;
    });

    it('should not draw the profile image if the profile image is empty', async () => {
        const introductionPage = IntroductionPage.getInstance();
        const originalDrawRightColumn = introductionPage.drawRightColumn;
        introductionPage.drawRightColumn = vi.fn();

        const store = useResumeStore();
        store.general.profilePhoto = '';

        const pdfDoc = await getPdfDocumentWithMocks();

        await introductionPage.initialize(pdfDoc);

        const page = pdfDoc.addPage();
        expect(page.drawImage).not.toHaveBeenCalled();

        introductionPage.drawRightColumn = originalDrawRightColumn;
    });

    it('should render introduction correctly on the right column', async () => {
        const introductionPage = IntroductionPage.getInstance();
        const backupDrawLeftColumn = introductionPage.drawLeftColumn;
        introductionPage.drawLeftColumn = vi.fn();

        const store = useResumeStore();
        const introText =
            "I am the sword in the darkness. I am the watcher on the walls. I am the shield that guards the realms of men. I pledge my life and honor to the Night's Watch, for this night and all the nights to come. \n\n I am the sword in the darkness. I am the watcher on the walls. I am the shield that guards the realms of";
        store.general.introduction = introText;
        const pdfDoc = await getPdfDocumentWithMocks();
        await introductionPage.initialize(pdfDoc);

        const page = pdfDoc.addPage();

        await nextTick();

        expect(page.drawText).toHaveBeenCalledWith(
            'I am the sword in the darkness. I am the watcher on the walls. I am',
            expect.any(Object),
        );

        introductionPage.drawLeftColumn = backupDrawLeftColumn;
    });

    it('should not draw the topSkills if they are empty', async () => {
        const introductionPage = IntroductionPage.getInstance();
        const originalDrawRightColumn = introductionPage.drawRightColumn;
        introductionPage.drawRightColumn = vi.fn();

        const store = useResumeStore();
        store.topSkills = [];

        const pdfDoc = await getPdfDocumentWithMocks();

        await introductionPage.initialize(pdfDoc);

        const page = pdfDoc.addPage();
        expect(page.drawText).not.toHaveBeenCalledWith('Skills (experience in years)', expect.any(Object));

        introductionPage.drawRightColumn = originalDrawRightColumn;
    });

    it('should draw the topSkills if they are set', async () => {
        const introductionPage = IntroductionPage.getInstance();
        const originalDrawRightColumn = introductionPage.drawRightColumn;
        introductionPage.drawRightColumn = vi.fn();

        const store = useResumeStore();
        store.topSkills = [
            {
                name: 'JavaScript',
                yearsOfExperience: 10,
            },
            {
                name: 'TypeScript',
                yearsOfExperience: 6,
            },
            {
                name: 'Vue.js',
                yearsOfExperience: 5,
            },
            {
                name: 'React',
                yearsOfExperience: 5,
            },
            {
                name: 'Angular',
                yearsOfExperience: 5,
            },
            {
                name: 'Node.js',
                yearsOfExperience: 5,
            },
            {
                name: 'Express.js',
                yearsOfExperience: 5,
            },
            {
                name: 'MongoDB',
                yearsOfExperience: 5,
            },
            {
                name: 'PostgreSQL',
                yearsOfExperience: 5,
            },
            {
                name: 'Docker',
                yearsOfExperience: 0,
            },
            {
                name: 'Kubernetes',
                yearsOfExperience: 5,
            },
            {
                name: 'Jest',
                yearsOfExperience: 5,
            },
        ];

        const pdfDoc = await getPdfDocumentWithMocks();

        await introductionPage.initialize(pdfDoc);

        const page = pdfDoc.addPage();
        expect(page.drawText).toHaveBeenCalledWith('JavaScript', expect.any(Object));

        // Should not render more than MAX_SKILLS (f.e. 10) top skills
        expect(page.drawText).not.toHaveBeenCalledWith('Jest', expect.any(Object));

        // Should not render skills with 0 years of experience
        expect(page.drawText).not.toHaveBeenCalledWith('Docker', expect.any(Object));

        introductionPage.drawRightColumn = originalDrawRightColumn;
    });

    describe('test empty store', () => {
        let store: ReturnType<typeof useResumeStore>;

        beforeEach(() => {
            setActivePinia(createPinia());
            store = useResumeStore();

            store.reset();
        });

        it('should not render profile photo if it is not set', async () => {
            const introductionPage = IntroductionPage.getInstance();
            introductionPage.drawRightColumn = vi.fn();

            const pdfDoc = await getPdfDocumentWithMocks();

            const page = pdfDoc.addPage();
            (page.drawImage as Mock).mockReset();

            await introductionPage.initialize(pdfDoc);
            expect(page.drawImage).not.toHaveBeenCalled();
        });

        it('should not render top skills if they are not set', async () => {
            const introductionPage = IntroductionPage.getInstance();
            introductionPage.drawRightColumn = vi.fn();

            const pdfDoc = await getPdfDocumentWithMocks();

            const page = pdfDoc.addPage();
            (page.drawRectangle as Mock).mockReset();
            store.clearTopSkills();

            await nextTick();
            await introductionPage.initialize(pdfDoc);

            expect(page.drawRectangle).not.toHaveBeenCalled();
        });
    });
});
