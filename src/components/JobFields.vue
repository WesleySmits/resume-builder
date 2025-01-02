<template>
    <DynamicList
        :title="getLocalizedString('workExperience')"
        :items="jobs"
        :defaultItem="defaultJob"
        :onUpdate="updateJobs"
        :getKey="getKey"
        :direction="'column'"
    >
        <template #item-fields="{ item, index, updateField, removeItem }">
            <fieldset>
                <legend>{{ item.company || getLocalizedString('newJob') }}</legend>

                <FormField
                    :id="`company-${index}`"
                    :label="getLocalizedString('company')"
                    :placeholder="getLocalizedString('companyPlaceholder')"
                    :helperText="getLocalizedString('companyHelperText')"
                    :errorText="getLocalizedString('requiredFieldError')"
                    :modelValue="item.company"
                    :required="true"
                    @valid="(value) => updateField('company', value as string)"
                />

                <FormField
                    :id="`jobLocation-${index}`"
                    :label="getLocalizedString('jobLocation')"
                    :placeholder="getLocalizedString('jobLocationPlaceholder')"
                    :helperText="getLocalizedString('jobLocationHelperText')"
                    :modelValue="item.location"
                    :required="false"
                    @valid="(value) => updateField('location', value as string)"
                />

                <FormField
                    :id="`jobRole-${index}`"
                    :label="getLocalizedString('jobRole')"
                    :placeholder="getLocalizedString('jobRolePlaceholder')"
                    :helperText="getLocalizedString('jobRoleHelperText')"
                    :modelValue="item.role"
                    :required="true"
                    @valid="(value) => updateField('role', value as string)"
                />

                <FormField
                    :id="`jobIndustry-${index}`"
                    :label="getLocalizedString('jobIndustry')"
                    :placeholder="getLocalizedString('jobIndustryPlaceholder')"
                    :helperText="getLocalizedString('jobIndustryHelperText')"
                    :modelValue="item.industry"
                    :required="true"
                    @valid="(value) => updateField('industry', value as string)"
                />

                <fieldset>
                    <legend>{{ getLocalizedString('jobPeriod') }}</legend>
                    <FormField
                        type="date"
                        :id="`jobStartDate-${index}`"
                        :label="getLocalizedString('jobStartDate')"
                        :placeholder="getLocalizedString('jobStartDatePlaceholder')"
                        :helperText="getLocalizedString('jobStartDateHelperText')"
                        :modelValue="item.period.startDate"
                        :required="true"
                        @valid="(value) => updateField('period.startDate', value as string)"
                    />

                    <FormField
                        type="date"
                        :id="`jobEndDate-${index}`"
                        :label="getLocalizedString('jobEndDate')"
                        :placeholder="getLocalizedString('jobEndDatePlaceholder')"
                        :helperText="getLocalizedString('jobEndDateHelperText')"
                        :modelValue="item.period.endDate"
                        :required="false"
                        @valid="(value) => updateField('period.endDate', value as string)"
                    />
                </fieldset>

                <FormField
                    :type="'textarea'"
                    :id="`jobDescription-${index}`"
                    :label="getLocalizedString('jobDescription')"
                    :placeholder="getLocalizedString('jobDescriptionPlaceholder')"
                    :helperText="getLocalizedString('jobDescriptionHelperText')"
                    :modelValue="item.description"
                    :required="false"
                    @valid="(value) => updateField('description', value as string)"
                />

                <FormField
                    :type="'textarea'"
                    :id="`jobResponsibilities-${index}`"
                    :label="getLocalizedString('jobResponsibilities')"
                    :placeholder="getLocalizedString('jobResponsibilitiesPlaceholder')"
                    :helperText="getLocalizedString('jobResponsibilitiesHelperText')"
                    :modelValue="item.responsibilities"
                    :required="false"
                    @valid="(value) => updateField('responsibilities', value as string[])"
                />

                <fieldset>
                    <legend>{{ getLocalizedString('technicalSkills') }}</legend>
                    <FormField
                        v-for="field in getSkillsData(item.skills, index)"
                        :type="field.type"
                        :fieldType="field.fieldType"
                        :key="field.id"
                        :id="field.id"
                        :label="field.label"
                        :placeholder="field.placeholder"
                        :helperText="field.helperText"
                        @valid="(value) => field.handleChange(value as string[])"
                        :modelValue="field.modelValue"
                        :required="field.required"
                    />
                </fieldset>

                <button @click="removeItem" class="secondary" data-action="remove">
                    {{ getLocalizedString('deleteJob') }}
                </button>
            </fieldset>
        </template>
    </DynamicList>
</template>

<script setup lang="ts">
import { useResumeStore } from '@/stores/resume';
import { getLocalizedString } from '@/utils/translation';
import FormField from './FormField.vue';
import DynamicList from './DynamicList.vue';

const resumeStore = useResumeStore();
const jobs = resumeStore.jobs;

function getKey(item: Job, index: number): string {
    return `${item.company}-${item.role}-${index}`;
}

function defaultJob(): Job {
    return {
        company: '',
        role: '',
        industry: '',
        location: '',
        period: {
            startDate: '',
            endDate: '',
        },
        description: '',
        responsibilities: [],
        skills: {
            languages: [],
            frameworks: [],
            platforms: [],
            methodologies: [],
            operatingSystems: [],
            databases: [],
            tools: [],
        },
    };
}

function updateJobs(newJobs: Job[]) {
    resumeStore.setJobs(newJobs);
}

function getSkillsData(skills: Skills, jobIndex: number) {
    return {
        languages: {
            id: `jobSkillsLanguages-${jobIndex}`,
            type: 'skills',
            fieldType: 'languages',
            label: getLocalizedString('programmingLanguages'),
            placeholder: getLocalizedString('programmingLanguagesPlaceholder'),
            helperText: getLocalizedString('programmingLanguagesHelperText'),
            required: false,
            handleChange: (value: string[]) => (skills.languages = value),
            modelValue: skills.languages,
        },
        frameworks: {
            id: `jobSkillsFrameworks-${jobIndex}`,
            type: 'skills',
            fieldType: 'frameworks',
            label: getLocalizedString('frameworks'),
            placeholder: getLocalizedString('frameworksPlaceholder'),
            helperText: getLocalizedString('frameworksHelperText'),
            required: false,
            handleChange: (value: string[]) => (skills.frameworks = value),
            modelValue: skills.frameworks,
        },
        platforms: {
            id: `jobSkillsPlatforms-${jobIndex}`,
            type: 'skills',
            fieldType: 'platforms',
            label: getLocalizedString('platforms'),
            placeholder: getLocalizedString('platformsPlaceholder'),
            helperText: getLocalizedString('platformsHelperText'),
            required: false,
            handleChange: (value: string[]) => (skills.platforms = value),
            modelValue: skills.platforms,
        },
        methodologies: {
            id: `jobSkillsMethodologies-${jobIndex}`,
            type: 'skills',
            fieldType: 'methodologies',
            label: getLocalizedString('methodologies'),
            placeholder: getLocalizedString('methodologiesPlaceholder'),
            helperText: getLocalizedString('methodologiesHelperText'),
            required: false,
            handleChange: (value: string[]) => (skills.methodologies = value),
            modelValue: skills.methodologies,
        },
        operatingSystems: {
            id: `jobSkillsOperatingSystems-${jobIndex}`,
            type: 'skills',
            fieldType: 'operatingSystems',
            label: getLocalizedString('operatingSystems'),
            placeholder: getLocalizedString('operatingSystemsPlaceholder'),
            helperText: getLocalizedString('operatingSystemsHelperText'),
            required: false,
            handleChange: (value: string[]) => (skills.operatingSystems = value),
            modelValue: skills.operatingSystems,
        },
        databases: {
            id: `jobSkillsDatabases-${jobIndex}`,
            type: 'skills',
            fieldType: 'databases',
            label: getLocalizedString('databases'),
            placeholder: getLocalizedString('databasesPlaceholder'),
            helperText: getLocalizedString('databasesHelperText'),
            required: false,
            handleChange: (value: string[]) => (skills.databases = value),
            modelValue: skills.databases,
        },
        tools: {
            id: `jobSkillsTools-${jobIndex}`,
            type: 'skills',
            fieldType: 'tools',
            label: getLocalizedString('toolsAndLibraries'),
            placeholder: getLocalizedString('toolsAndLibrariesPlaceholder'),
            helperText: getLocalizedString('toolsAndLibrariesHelperText'),
            required: false,
            handleChange: (value: string[]) => (skills.tools = value),
            modelValue: skills.tools,
        },
    };
}
</script>
