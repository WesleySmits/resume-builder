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
                :modelValue="general.name?.[field.id as keyof Name]"
                :required="field.required"
            />
        </fieldset>

        <fieldset>
            <legend>{{ getLocalizedString('personalInformation') }}</legend>

            <div>
                <img
                    :src="resumeStore.profilePhotoUrl"
                    :alt="getLocalizedString('profilePhoto')"
                    width="100"
                    height="100"
                    v-if="resumeStore.profilePhotoUrl"
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
                v-for="field in getAboutData()"
                :key="field.id"
                :id="field.id"
                :rows="field.rows"
                :type="field.type"
                :label="field.label"
                :placeholder="field.placeholder"
                :helperText="field.helperText"
                :errorText="field.required ? getLocalizedString('requiredFieldError') : undefined"
                @valid="(value) => field.handleChange(value as string)"
                :modelValue="field.modelValue ?? ''"
                :required="field.required"
            />
        </fieldset>
    </div>
</template>

<script lang="ts" setup>
import { type Name, type DrivingLicense, useResumeStore } from '@/stores/resume';

import FormField from '@/components/FormField.vue';
import { getLocalizedString } from '@/utils/resume/Page';
import { NameFields } from '@/enums/name';
import { PersonalInfoFields } from '@/enums/personalInfo';
import { DrivingLicenseFields } from '@/enums/drivingLicense';
import { AboutFields } from '@/enums/about';

const resumeStore = useResumeStore();
const general = resumeStore.general;

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
            handleChange: (value) => handleNameChange(value as string, NameFields.MIDDLE_NAME),
        },
        lastName: {
            id: NameFields.LAST_NAME,
            label: getLocalizedString(`${NameFields.LAST_NAME}`),
            placeholder: getLocalizedString(`${NameFields.LAST_NAME}Placeholder`),
            helperText: getLocalizedString(`${NameFields.LAST_NAME}HelperText`),
            required: true,
            handleChange: (value) => handleNameChange(value as string, NameFields.LAST_NAME),
        },
        displayName: {
            id: NameFields.DISPLAY_NAME,
            label: getLocalizedString(`${NameFields.DISPLAY_NAME}`),
            placeholder: getLocalizedString(`${NameFields.DISPLAY_NAME}Placeholder`),
            helperText: getLocalizedString(`${NameFields.DISPLAY_NAME}HelperText`),
            required: false,
            handleChange: (value) => handleNameChange(value as string, NameFields.DISPLAY_NAME),
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
            handleChange: (value) => resumeStore.updateProfilePhoto(value as File),
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
            handleChange: (value) => resumeStore.updateRegion(value as string),
        },
        drivingLicense: {
            id: PersonalInfoFields.DRIVING_LICENSE,
            label: getLocalizedString(`${PersonalInfoFields.DRIVING_LICENSE}`),
            placeholder: getLocalizedString(`${PersonalInfoFields.DRIVING_LICENSE}Placeholder`),
            helperText: getLocalizedString(`${PersonalInfoFields.DRIVING_LICENSE}HelperText`),
            required: false,
            modelValue: general.drivingLicense,
            handleChange: (value) => resumeStore.updateDrivingLicense(value as DrivingLicense),
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
            handleChange: (value) => resumeStore.updateFunctionTitle(value as string),
        },
    };
}

function getAboutData(): FormFields {
    return {
        introduction: {
            id: AboutFields.INTRODUCTION,
            type: 'textarea',
            rows: 8,
            label: getLocalizedString('introduction'),
            placeholder: getLocalizedString('introductionPlaceholder'),
            helperText: getLocalizedString('introductionHelperText'),
            required: true,
            handleChange: (value) => resumeStore.updateIntroduction(value as string),
            modelValue: general.introduction,
        },
        achievement1: {
            id: `${AboutFields.ACHIEVEMENT}1`,
            type: 'textarea',
            rows: 8,
            label: getLocalizedString(AboutFields.ACHIEVEMENT, { number: 1 }),
            placeholder: getLocalizedString(`${AboutFields.ACHIEVEMENT}Placeholder`),
            helperText: getLocalizedString(`${AboutFields.ACHIEVEMENT}HelperText`, {
                amount: getLocalizedString('first').toLowerCase(),
            }),
            handleChange: (value) => resumeStore.updateAchievement(0, value as string),
            required: false,
            modelValue: general.achievements?.[0],
        },
        achievement2: {
            id: `${AboutFields.ACHIEVEMENT}2`,
            type: 'textarea',
            rows: 8,
            label: getLocalizedString(AboutFields.ACHIEVEMENT, { number: 2 }),
            placeholder: getLocalizedString(`${AboutFields.ACHIEVEMENT}Placeholder`),
            helperText: getLocalizedString(`${AboutFields.ACHIEVEMENT}HelperText`, {
                amount: getLocalizedString('second').toLowerCase(),
            }),
            handleChange: (value) => resumeStore.updateAchievement(1, value as string),
            required: false,
            modelValue: general.achievements?.[1],
        },
        achievement3: {
            id: `${AboutFields.ACHIEVEMENT}3`,
            type: 'textarea',
            rows: 8,
            label: getLocalizedString(AboutFields.ACHIEVEMENT, { number: 3 }),
            placeholder: getLocalizedString(`${AboutFields.ACHIEVEMENT}Placeholder`),
            helperText: getLocalizedString(`${AboutFields.ACHIEVEMENT}HelperText`, {
                amount: getLocalizedString('third').toLowerCase(),
            }),
            handleChange: (value) => resumeStore.updateAchievement(2, value as string),
            required: false,
            modelValue: general.achievements?.[2],
        },
        colleaguesDescribe: {
            id: AboutFields.COLLEAGUES_DESCRIPTION,
            type: 'textarea',
            rows: 8,
            label: getLocalizedString(AboutFields.COLLEAGUES_DESCRIPTION),
            placeholder: getLocalizedString(`${AboutFields.COLLEAGUES_DESCRIPTION}Placeholder`),
            helperText: getLocalizedString(`${AboutFields.COLLEAGUES_DESCRIPTION}HelperText`),
            required: true,
            handleChange: (value) => resumeStore.updateColleaguesDescribe(value as string),
            modelValue: general.colleaguesDescribe,
        },
        colleaguesKnow: {
            id: AboutFields.COLLEAGUES_SHOULD_KNOW,
            type: 'textarea',
            rows: 8,
            label: getLocalizedString(AboutFields.COLLEAGUES_SHOULD_KNOW),
            placeholder: getLocalizedString(`${AboutFields.COLLEAGUES_SHOULD_KNOW}Placeholder`),
            helperText: getLocalizedString(`${AboutFields.COLLEAGUES_SHOULD_KNOW}HelperText`),
            required: true,
            handleChange: (value) => resumeStore.updateColleaguesKnow(value as string),
            modelValue: general.colleaguesKnow,
        },
    };
}

function handleNameChange(value: string, id: string) {
    const nameData: Name = {
        firstName: general.name.firstName,
        middleName: general.name.middleName,
        lastName: general.name.lastName,
        displayName: general.name.displayName,
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

    resumeStore.updateName(nameData);
}

function handleContactChange(value: string, id: string) {
    const contactData = {
        email: general.contact.email,
        phone: general.contact.phone,
    };

    switch (id) {
        case PersonalInfoFields.EMAIL_ADDRESS:
            contactData.email = value;
            break;
        case PersonalInfoFields.PHONE_NUMBER:
            contactData.phone = value;
            break;
    }

    resumeStore.updateContact(contactData);
}
</script>
