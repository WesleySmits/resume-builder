<template>
    <div class="form">
        <fieldset>
            <legend>{{ getLocalizedString('name') }}</legend>

            <FormField
                id="firstName"
                :label="getLocalizedString('firstName')"
                :placeholder="getLocalizedString('firstNamePlaceholder')"
                :helperText="getLocalizedString('firstNameHelperText')"
                :errorText="getLocalizedString('requiredFieldError')"
                @valid="(value) => handleNameChange(value as string, 'firstName')"
                :modelValue="general.name?.firstName ?? ''"
                required
            />

            <FormField
                id="middleName"
                :label="getLocalizedString('middleName')"
                :placeholder="getLocalizedString('middleNamePlaceholder')"
                :helperText="getLocalizedString('middleNameHelperText')"
                @valid="(value) => handleNameChange(value as string, 'middleName')"
                :modelValue="general.name?.middleName ?? ''"
            />

            <FormField
                id="lastName"
                :label="getLocalizedString('lastName')"
                :placeholder="getLocalizedString('lastNamePlaceholder')"
                :helperText="getLocalizedString('lastNameHelperText')"
                :errorText="getLocalizedString('requiredFieldError')"
                @valid="(value) => handleNameChange(value as string, 'lastName')"
                :modelValue="general.name?.lastName ?? ''"
                required
            />

            <FormField
                id="displayName"
                :label="getLocalizedString('displayName')"
                :placeholder="getLocalizedString('displayNamePlaceholder')"
                :helperText="getLocalizedString('displayNameHelperText')"
                @valid="(value) => handleNameChange(value as string, 'displayName')"
                :modelValue="general.name?.displayName ?? ''"
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
                id="profile-photo"
                type="file"
                accept="image/*"
                :label="getLocalizedString('profilePhoto')"
                :helperText="getLocalizedString('profilePhotoHelperText')"
                :errorText="getLocalizedString('requiredFieldError')"
                @valid="(value) => handleProfilePhotoChange(value as File)"
                required
            />

            <FormField
                id="phone"
                label="Phone"
                type="tel"
                :placeholder="getLocalizedString('phoneNumberPlaceholder')"
                :helperText="getLocalizedString('phoneNumberHelperText')"
                @valid="(value) => handleContactChange(value as string, 'phone')"
                :modelValue="general.contact?.phone ?? ''"
            />

            <FormField
                id="email"
                type="email"
                :label="getLocalizedString('emailAddress')"
                :placeholder="getLocalizedString('emailAddressPlaceholder')"
                :helperText="getLocalizedString('emailAddressHelperText')"
                @valid="(value) => handleContactChange(value as string, 'email')"
                :modelValue="general.contact?.email ?? ''"
                required
            />

            <FormField
                id="region"
                :label="getLocalizedString('region')"
                :placeholder="getLocalizedString('regionPlaceholder')"
                :helperText="getLocalizedString('regionHelperText')"
                @valid="(value) => handleRegionChange(value as string)"
                :modelValue="general.region ?? ''"
            />

            <FormField
                id="drivingLicense"
                :label="getLocalizedString('drivingLicense')"
                :placeholder="getLocalizedString('drivingLicensePlaceholder')"
                :helperText="getLocalizedString('drivingLicenseHelperText')"
                @valid="(value) => handleDrivingLicenseChange(value as string)"
                :modelValue="general.drivingLicense ?? ''"
                type="select"
                :options="[
                    {
                        value: 'car',
                        text: 'Car',
                    },
                    {
                        value: 'motorcycle',
                        text: 'Motorcycle',
                    },
                    {
                        value: 'truck',
                        text: 'Truck',
                    },
                    {
                        value: 'bus',
                        text: 'Bus',
                    },
                ]"
            />

            <FormField
                id="functionTitle"
                :label="getLocalizedString('functionTitle')"
                :placeholder="getLocalizedString('functionTitlePlaceholder')"
                :helperText="getLocalizedString('functionTitleHelperText')"
                :errorText="getLocalizedString('requiredFieldError')"
                @valid="(value) => handleFunctionTitleChange(value as string)"
                :modelValue="general.functionTitle ?? ''"
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

function handleNameChange(value: string, id: string) {
    const nameData: Name = {
        firstName: general.name?.firstName ?? '',
        middleName: general.name?.middleName ?? '',
        lastName: general.name?.lastName ?? '',
        displayName: general.name?.displayName ?? '',
    };

    switch (id) {
        case 'firstName':
            nameData.firstName = value;
            break;
        case 'middleName':
            nameData.middleName = value;
            break;
        case 'lastName':
            nameData.lastName = value;
            break;
        case 'displayName':
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
