<template>
    <div class="form">
        <fieldset>
            <legend>{{ getLocalizedString('name') }}</legend>

            <FormField
                v-for="field in getNameFieldData()"
                :type="field.type ?? 'text'"
                :key="field.id"
                :id="field.id"
                :label="field.label"
                :placeholder="field.placeholder"
                :helperText="field.helperText"
                :errorText="field.required ? getLocalizedString('requiredFieldError') : undefined"
                @valid="(value) => field.handleChange(value as string)"
                :modelValue="general.name?.[field.id as keyof Name] ?? ''"
                :required="field.required"
            />
        </fieldset>

        <fieldset>
            <legend>{{ getLocalizedString('personalInformation') }}</legend>

            <div>
                <img
                    :src="profilePhotoUrl"
                    :alt="getLocalizedString('profilePhoto')"
                    width="100"
                    height="100"
                    v-if="profilePhotoUrl"
                />
            </div>

            <FormField
                v-for="field in getPersonalInformationData()"
                :key="field.id"
                :id="field.id"
                :type="field.type ?? 'text'"
                :accept="field.accept"
                :label="field.label"
                :placeholder="field.placeholder"
                :helperText="field.helperText"
                :errorText="field.required ? getLocalizedString('requiredFieldError') : undefined"
                :required="field.required"
                @valid="(value) => field.handleChange(value as string)"
                :modelValue="field.modelValue ?? ''"
            />
        </fieldset>

        <fieldset>
            <legend>{{ getLocalizedString('about') }}</legend>

            <FormField
                id="introduction"
                :label="getLocalizedString('introduction')"
                :placeholder="getLocalizedString('introductionPlaceholder')"
                :helperText="getLocalizedString('introductionHelperText')"
                :errorText="getLocalizedString('requiredFieldError')"
                @valid="(value) => handleIntroductionChange(value as string)"
                :modelValue="general.introduction ?? ''"
                type="textarea"
                required
            />

            <FormField
                id="achievement1"
                :label="getLocalizedString('achievement', { number: 1 })"
                :placeholder="getLocalizedString('achievementPlaceholder')"
                :helperText="
                    getLocalizedString('achievementHelperText', { amount: getLocalizedString('first').toLowerCase() })
                "
                @valid="(value) => handleAchievementChange(0, value as string)"
                :modelValue="general.achievements?.[0] ?? ''"
                type="textarea"
            />

            <FormField
                id="achievement2"
                :label="getLocalizedString('achievement', { number: 2 })"
                :placeholder="getLocalizedString('achievementPlaceholder')"
                :helperText="
                    getLocalizedString('achievementHelperText', { amount: getLocalizedString('second').toLowerCase() })
                "
                @valid="(value) => handleAchievementChange(1, value as string)"
                :modelValue="general.achievements?.[1] ?? ''"
                type="textarea"
            />

            <FormField
                id="achievement3"
                :label="getLocalizedString('achievement', { number: 3 })"
                :placeholder="getLocalizedString('achievementPlaceholder')"
                :helperText="
                    getLocalizedString('achievementHelperText', { amount: getLocalizedString('third').toLowerCase() })
                "
                @valid="(value) => handleAchievementChange(2, value as string)"
                :modelValue="general.achievements?.[2] ?? ''"
                type="textarea"
            />

            <FormField
                id="colleaguesDescribe"
                :label="getLocalizedString('colleaguesDescribe')"
                :placeholder="getLocalizedString('colleaguesDescribePlaceholder')"
                :helperText="getLocalizedString('colleaguesDescribeHelperText')"
                :errorText="getLocalizedString('requiredFieldError')"
                @valid="(value) => handleColleaguesDescribeChange(value as string)"
                :modelValue="general.colleaguesDescribe ?? ''"
                type="textarea"
                required
            />

            <FormField
                id="colleaguesKnow"
                :label="getLocalizedString('colleaguesKnow')"
                :placeholder="getLocalizedString('colleaguesKnowPlaceholder')"
                :helperText="getLocalizedString('colleaguesKnowHelperText')"
                :errorText="getLocalizedString('requiredFieldError')"
                @valid="(value) => handleColleaguesKnowChange(value as string)"
                :modelValue="general.colleaguesKnow ?? ''"
                type="textarea"
                required
            />
        </fieldset>
    </div>
</template>

<script lang="ts" setup>
import {
    resumeData,
    updateName,
    updateRegion,
    updateDrivingLicense,
    updateContact,
    type Name,
    type DrivingLicense,
    updateFunctionTitle,
    updateIntroduction,
    updateColleaguesDescribe,
    updateColleaguesKnow,
    updateAchievement,
    updateProfilePhoto,
} from '@/stores/resume';

import FormField from '@/components/FormField.vue';
import { computed, reactive } from 'vue';
import { getLocalizedString } from '@/utils/resume/Page';
import { DrivingLicenseFields, NameFields, PersonalInfoFields } from '@/enums/data';

const general = reactive(resumeData.general);
const profilePhotoUrl = computed(() => {
    if (typeof general.profilePhoto === 'string') {
        return general.profilePhoto;
    }

    if (typeof general.profilePhoto === 'object' && Object.keys(general.profilePhoto).length === 0) {
        console.error('Profile photo is an empty object');
        return '';
    }

    return general.profilePhoto ? URL.createObjectURL(general.profilePhoto) : undefined;
});

function getNameFieldData(): FormFields {
    return {
        firstName: {
            id: NameFields.FIRST_NAME,
            label: getLocalizedString(`${NameFields.FIRST_NAME}`),
            placeholder: getLocalizedString(`${NameFields.FIRST_NAME}Placeholder`),
            helperText: getLocalizedString(`${NameFields.FIRST_NAME}HelperText`),
            required: true,
            handleChange: (value) => handleNameChange(value as string, NameFields.FIRST_NAME),
        },
        middleName: {
            id: NameFields.MIDDLE_NAME,
            label: getLocalizedString(`${NameFields.MIDDLE_NAME}`),
            placeholder: getLocalizedString(`${NameFields.MIDDLE_NAME}Placeholder`),
            helperText: getLocalizedString(`${NameFields.MIDDLE_NAME}HelperText`),
            required: false,
            handleChange: (value) => handleNameChange(value as string, NameFields.FIRST_NAME),
        },
        lastName: {
            id: NameFields.LAST_NAME,
            label: getLocalizedString(`${NameFields.LAST_NAME}`),
            placeholder: getLocalizedString(`${NameFields.LAST_NAME}Placeholder`),
            helperText: getLocalizedString(`${NameFields.LAST_NAME}HelperText`),
            required: true,
            handleChange: (value) => handleNameChange(value as string, NameFields.FIRST_NAME),
        },
        displayName: {
            id: NameFields.DISPLAY_NAME,
            label: getLocalizedString(`${NameFields.DISPLAY_NAME}`),
            placeholder: getLocalizedString(`${NameFields.DISPLAY_NAME}Placeholder`),
            helperText: getLocalizedString(`${NameFields.DISPLAY_NAME}HelperText`),
            required: false,
            handleChange: (value) => handleNameChange(value as string, NameFields.FIRST_NAME),
        },
    };
}

function getPersonalInformationData(): FormFields {
    return {
        profilePhoto: {
            id: PersonalInfoFields.PROFILE_PHOTO,
            type: 'file',
            label: getLocalizedString(`${PersonalInfoFields.PROFILE_PHOTO}`),
            placeholder: getLocalizedString(`${PersonalInfoFields.PROFILE_PHOTO}Placeholder`),
            helperText: getLocalizedString(`${PersonalInfoFields.PROFILE_PHOTO}HelperText`),
            required: true,
            handleChange: (value) => handleProfilePhotoChange(value as File),
        },
        phone: {
            id: PersonalInfoFields.PHONE_NUMBER,
            type: 'tel',
            label: getLocalizedString(`${PersonalInfoFields.PHONE_NUMBER}`),
            placeholder: getLocalizedString(`${PersonalInfoFields.PHONE_NUMBER}Placeholder`),
            helperText: getLocalizedString(`${PersonalInfoFields.PHONE_NUMBER}HelperText`),
            required: false,
            modelValue: general.contact?.phone,
            handleChange: (value) => handleContactChange(value as string, PersonalInfoFields.PHONE_NUMBER),
        },
        email: {
            id: PersonalInfoFields.EMAIL_ADDRESS,
            type: 'email',
            label: getLocalizedString(`${PersonalInfoFields.EMAIL_ADDRESS}`),
            placeholder: getLocalizedString(`${PersonalInfoFields.EMAIL_ADDRESS}Placeholder`),
            helperText: getLocalizedString(`${PersonalInfoFields.EMAIL_ADDRESS}HelperText`),
            required: true,
            modelValue: general.contact?.email,
            handleChange: (value) => handleContactChange(value as string, PersonalInfoFields.EMAIL_ADDRESS),
        },
        region: {
            id: PersonalInfoFields.REGION,
            label: getLocalizedString(`${PersonalInfoFields.REGION}`),
            placeholder: getLocalizedString(`${PersonalInfoFields.REGION}Placeholder`),
            helperText: getLocalizedString(`${PersonalInfoFields.REGION}HelperText`),
            required: false,
            modelValue: general.region,
            handleChange: (value) => handleRegionChange(value as string),
        },
        drivingLicense: {
            id: PersonalInfoFields.DRIVING_LICENSE,
            label: getLocalizedString(`${PersonalInfoFields.DRIVING_LICENSE}`),
            placeholder: getLocalizedString(`${PersonalInfoFields.DRIVING_LICENSE}Placeholder`),
            helperText: getLocalizedString(`${PersonalInfoFields.DRIVING_LICENSE}HelperText`),
            required: false,
            modelValue: general.drivingLicense,
            handleChange: (value) => handleDrivingLicenseChange(value as string),
            options: [
                {
                    value: DrivingLicenseFields.CAR,
                    text: getLocalizedString(DrivingLicenseFields.CAR),
                },
                {
                    value: DrivingLicenseFields.MOTORCYCLE,
                    text: getLocalizedString(DrivingLicenseFields.MOTORCYCLE),
                },
                {
                    value: DrivingLicenseFields.TRUCK,
                    text: getLocalizedString(DrivingLicenseFields.TRUCK),
                },
                {
                    value: DrivingLicenseFields.BUS,
                    text: getLocalizedString(DrivingLicenseFields.BUS),
                },
            ],
        },
        functionTitle: {
            id: PersonalInfoFields.FUNCTION_TITLE,
            label: getLocalizedString(`${PersonalInfoFields.FUNCTION_TITLE}`),
            placeholder: getLocalizedString(`${PersonalInfoFields.FUNCTION_TITLE}Placeholder`),
            helperText: getLocalizedString(`${PersonalInfoFields.FUNCTION_TITLE}HelperText`),
            required: true,
            modelValue: general.functionTitle,
            handleChange: (value) => handleFunctionTitleChange(value as string),
        },
    };
}

function handleNameChange(value: string, id: string) {
    const nameData: Name = {
        firstName: general.name?.firstName ?? '',
        middleName: general.name?.middleName ?? '',
        lastName: general.name?.lastName ?? '',
        displayName: general.name?.displayName ?? '',
    };

    switch (id) {
        case NameFields.FIRST_NAME:
            nameData.firstName = value;
            break;
        case NameFields.MIDDLE_NAME:
            nameData.middleName = value;
            break;
        case NameFields.LAST_NAME:
            nameData.lastName = value;
            break;
        case NameFields.DISPLAY_NAME:
            nameData.displayName = value;
            break;
    }

    updateName(nameData);
}

function handleProfilePhotoChange(value: File) {
    updateProfilePhoto(value);
}

function handleContactChange(value: string, id: string) {
    const contactData = {
        email: general.contact?.email ?? '',
        phone: general.contact?.phone ?? '',
    };

    switch (id) {
        case 'email':
            contactData.email = value;
            break;
        case 'phone':
            contactData.phone = value;
            break;
    }

    updateContact(contactData);
}

function handleRegionChange(value: string) {
    updateRegion(value);
}

function handleDrivingLicenseChange(value: string) {
    const drivingLicense = value as DrivingLicense;
    updateDrivingLicense(drivingLicense);
}

function handleFunctionTitleChange(value: string) {
    updateFunctionTitle(value);
}

function handleIntroductionChange(value: string) {
    updateIntroduction(value);
}

function handleAchievementChange(index: number, value: string) {
    updateAchievement(index, value);
}

function handleColleaguesDescribeChange(value: string) {
    updateColleaguesDescribe(value);
}

function handleColleaguesKnowChange(value: string) {
    updateColleaguesKnow(value);
}
</script>
