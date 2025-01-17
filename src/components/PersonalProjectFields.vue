<template>
    <DynamicList
        :title="getLocalizedString('personalProjects')"
        :items="personalProjects"
        :defaultItem="defaultPersonalProject"
        :onUpdate="updatePersonalProjects"
        :getKey="getKey"
        :direction="'column'"
        :id="'personalProjects'"
    >
        <template #item-fields="{ item, index, updateField, removeItem }">
            <fieldset :id="`personalProject-${index}`">
                <details name="job-curtain" :open="index === 0">
                    <summary>
                        <header>
                            <legend>{{ item.title || getLocalizedString('newPersonalProject') }}</legend>
                        </header>
                    </summary>

                    <FormField
                        :id="`personal-project-${index}`"
                        :label="getLocalizedString('personalProjectTitle')"
                        :placeholder="getLocalizedString('personalProjectTitlePlaceholder')"
                        :helperText="getLocalizedString('personalProjectTitleHelperText')"
                        :errorText="getLocalizedString('requiredFieldError')"
                        :modelValue="item.title"
                        :required="true"
                        @valid="(value) => updateField('title', value as string)"
                    />

                    <fieldset>
                        <header>
                            <legend>{{ getLocalizedString('period') }}</legend>
                        </header>
                        <FormField
                            type="date"
                            :id="`personalProjectStartDate-${index}`"
                            :label="getLocalizedString('startDate')"
                            :placeholder="getLocalizedString('startDatePlaceholder')"
                            :helperText="getLocalizedString('startDateHelperText')"
                            :modelValue="item.period?.startDate"
                            :required="true"
                            @valid="(value) => updateField('period.startDate', value as string)"
                        />

                        <FormField
                            type="date"
                            :id="`personalProjectEndDate-${index}`"
                            :label="getLocalizedString('endDate')"
                            :placeholder="getLocalizedString('endDatePlaceholder')"
                            :helperText="getLocalizedString('endDateHelperText')"
                            :modelValue="item.period?.endDate"
                            :required="false"
                            @valid="(value) => updateField('period.endDate', value as string)"
                        />
                    </fieldset>

                    <FormField
                        :type="'textarea'"
                        :id="`personalProjectDescription-${index}`"
                        :label="getLocalizedString('description')"
                        :placeholder="getLocalizedString('descriptionPlaceholder')"
                        :helperText="getLocalizedString('descriptionHelperText')"
                        :modelValue="item.description"
                        :required="false"
                        @valid="(value) => updateField('description', value as string)"
                    />

                    <fieldset>
                        <header>
                            <legend>{{ getLocalizedString('technicalSkills') }}</legend>
                        </header>
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
                        {{ getLocalizedString('deletePersonalProject') }}
                    </button>
                </details>
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
const personalProjects = resumeStore.personalProjects;

function getKey(item: PersonalProject, index: number): string {
    return `${item.title}-${index}`;
}

function defaultPersonalProject(): PersonalProject {
    return {
        title: '',
        period: {
            startDate: '',
            endDate: '',
        },
        description: '',
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

function updatePersonalProjects(newProjects: PersonalProject[]) {
    resumeStore.setPersonalProjects(newProjects);
}

function getSkillsData(skills: Skills, index: number) {
    return {
        languages: {
            id: `personalProjectSkillsLanguages-${index}`,
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
            id: `personalProjectSkillsFrameworks-${index}`,
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
            id: `personalProjectSkillsPlatforms-${index}`,
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
            id: `personalProjectSkillsMethodologies-${index}`,
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
            id: `personalProjectSkillsOperatingSystems-${index}`,
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
            id: `personalProjectSkillsDatabases-${index}`,
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
            id: `personalProjectSkillsTools-${index}`,
            type: 'skills',
            fieldType: 'tools',
            label: getLocalizedString('tools'),
            placeholder: getLocalizedString('toolsPlaceholder'),
            helperText: getLocalizedString('toolsHelperText'),
            required: false,
            handleChange: (value: string[]) => (skills.tools = value),
            modelValue: skills.tools,
        },
    };
}
</script>
