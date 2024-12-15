<template>
    <div class="form">
        <fieldset>
            <legend>Name</legend>

            <FormField
                id="firstName"
                label="First name"
                placeholder="Enter your first name"
                required
                helperText="Enter your first name here."
                errorText="This field is required."
                @valid="(value) => handleNameChange(value as string, 'firstName')"
                :modelValue="general.name?.firstName ?? ''"
            />

            <FormField
                id="middleName"
                label="Middle name"
                placeholder="Enter your middle name"
                helperText="Enter your middle name here."
                errorText="This field is required."
                @valid="(value) => handleNameChange(value as string, 'middleName')"
                :modelValue="general.name?.middleName ?? ''"
            />

            <FormField
                id="lastName"
                label="Last name"
                placeholder="Enter your last name"
                helperText="Enter your last name here."
                errorText="This field is required."
                @valid="(value) => handleNameChange(value as string, 'lastName')"
                :modelValue="general.name?.lastName ?? ''"
            />

            <FormField
                id="displayName"
                label="Display name"
                placeholder="Enter your display name"
                helperText="Enter your display name here."
                errorText="This field is required."
                @valid="(value) => handleNameChange(value as string, 'displayName')"
                :modelValue="general.name?.displayName ?? ''"
            />
        </fieldset>

        <fieldset>
            <legend>Personal data</legend>

            <div>
                <img :src="profilePhotoUrl" alt="Profile photo" width="100" height="100" v-if="profilePhotoUrl" />
            </div>

            <FormField
                id="profile-photo"
                label="Profile photo"
                type="file"
                accept="image/*"
                helperText="Upload your profile photo here."
                errorText="This field is required."
                @valid="(value) => handleProfilePhotoChange(value as File)"
            />

            <FormField
                id="phone"
                label="Phone"
                type="tel"
                placeholder="Enter your phone number"
                helperText="Enter your phone number here."
                errorText="This field is required."
                @valid="(value) => handleContactChange(value as string, 'phone')"
                :modelValue="general.contact?.phone ?? ''"
            />

            <FormField
                id="email"
                label="Email"
                type="email"
                placeholder="Enter your email address"
                helperText="Enter your email address here."
                errorText="This field is required."
                @valid="(value) => handleContactChange(value as string, 'email')"
                :modelValue="general.contact?.email ?? ''"
            />

            <FormField
                id="region"
                label="Region"
                placeholder="Enter your region"
                helperText="Enter your region here."
                errorText="This field is required."
                @valid="(value) => handleRegionChange(value as string)"
                :modelValue="general.region ?? ''"
            />

            <FormField
                id="drivingLicense"
                label="Driving license"
                placeholder="Enter your driving license"
                helperText="Enter your driving license here."
                errorText="This field is required."
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
                label="Function title"
                placeholder="Enter your function title"
                helperText="Enter your function title here."
                errorText="This field is required."
                @valid="(value) => handleFunctionTitleChange(value as string)"
                :modelValue="general.functionTitle ?? ''"
            />
        </fieldset>

        <fieldset>
            <legend>About</legend>

            <FormField
                id="introduction"
                label="Introduction"
                placeholder="Enter your introduction"
                helperText="Enter your introduction here."
                errorText="This field is required."
                @valid="(value) => handleIntroductionChange(value as string)"
                :modelValue="general.introduction ?? ''"
                type="textarea"
            />

            <FormField
                id="achievement1"
                label="Achievement 1"
                placeholder="Enter your first achievement"
                helperText="Enter your first achievement here."
                errorText="This field is required."
                @valid="(value) => handleAchievementChange(0, value as string)"
                :modelValue="general.achievements?.[0] ?? ''"
                type="textarea"
            />

            <FormField
                id="achievement2"
                label="Achievement 2"
                placeholder="Enter your second achievement"
                helperText="Enter your second achievement here."
                errorText="This field is required."
                @valid="(value) => handleAchievementChange(1, value as string)"
                :modelValue="general.achievements?.[1] ?? ''"
                type="textarea"
            />

            <FormField
                id="achievement3"
                label="Achievement 3"
                placeholder="Enter your third achievement"
                helperText="Enter your third achievement here."
                errorText="This field is required."
                @valid="(value) => handleAchievementChange(2, value as string)"
                :modelValue="general.achievements?.[2] ?? ''"
                type="textarea"
            />

            <FormField
                id="colleaguesDescribe"
                label="Colleagues Describe"
                placeholder="Enter how your colleagues describe you"
                helperText="Enter how your colleagues describe you here."
                errorText="This field is required."
                @valid="(value) => handleColleaguesDescribeChange(value as string)"
                :modelValue="general.colleaguesDescribe ?? ''"
                type="textarea"
            />

            <FormField
                id="colleaguesKnow"
                label="Colleagues Know"
                placeholder="Enter what your colleagues know about you"
                helperText="Enter what your colleagues know about you here."
                errorText="This field is required."
                @valid="(value) => handleColleaguesKnowChange(value as string)"
                :modelValue="general.colleaguesKnow ?? ''"
                type="textarea"
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
