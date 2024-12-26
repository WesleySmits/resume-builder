<template>
    <div class="form">
        <fieldset>
            <legend>{{ getLocalizedString('skills') }}</legend>

            <FormField
                v-for="field in getSkillsData()"
                :type="field.type"
                :key="field.id"
                :id="field.id"
                :label="field.label"
                :placeholder="field.placeholder"
                :helperText="field.helperText"
                @valid="(value) => field.handleChange(value as string)"
                :modelValue="field.modelValue"
                :required="field.required"
            />
        </fieldset>
    </div>
</template>

<script setup lang="ts">
import { useResumeStore } from '@/stores/resume';
import FormField from '@/components/FormField.vue';
import { SkillFields } from '@/enums/skills';
import { getLocalizedString } from '@/utils/translation';

const resumeStore = useResumeStore();
const skills = resumeStore.skills;

function getSkillsData(): FormFields {
    return {
        programmingLanguages: {
            id: SkillFields.PROGRAMMING_LANGUAGES,
            type: 'skills',
            label: getLocalizedString(`${SkillFields.PROGRAMMING_LANGUAGES}`),
            placeholder: getLocalizedString(`${SkillFields.PROGRAMMING_LANGUAGES}Placeholder`),
            helperText: getLocalizedString(`${SkillFields.PROGRAMMING_LANGUAGES}HelperText`),
            required: false,
            handleChange: (value) => resumeStore.updateSkillsLanguages(value as string[]),
            modelValue: skills.languages,
        },
        frameworks: {
            id: SkillFields.FRAMEWORKS,
            type: 'skills',
            label: getLocalizedString(`${SkillFields.FRAMEWORKS}`),
            placeholder: getLocalizedString(`${SkillFields.FRAMEWORKS}Placeholder`),
            helperText: getLocalizedString(`${SkillFields.FRAMEWORKS}HelperText`),
            required: false,
            handleChange: (value) => resumeStore.updateSkillsFrameworks(value as string[]),
            modelValue: skills.frameworks,
        },
        platforms: {
            id: SkillFields.PLATFORMS,
            type: 'skills',
            label: getLocalizedString(`${SkillFields.PLATFORMS}`),
            placeholder: getLocalizedString(`${SkillFields.PLATFORMS}Placeholder`),
            helperText: getLocalizedString(`${SkillFields.PLATFORMS}HelperText`),
            required: false,
            handleChange: (value) => resumeStore.updateSkillsPlatforms(value as string[]),
            modelValue: skills.platforms,
        },
        methodologies: {
            id: SkillFields.METHODOLOGIES,
            type: 'skills',
            label: getLocalizedString(`${SkillFields.METHODOLOGIES}`),
            placeholder: getLocalizedString(`${SkillFields.METHODOLOGIES}Placeholder`),
            helperText: getLocalizedString(`${SkillFields.METHODOLOGIES}HelperText`),
            required: false,
            handleChange: (value) => resumeStore.updateSkillsMethodologies(value as string[]),
            modelValue: skills.methodologies,
        },
        operatingSystems: {
            id: SkillFields.OPERATING_SYSTEMS,
            type: 'skills',
            label: getLocalizedString(`${SkillFields.OPERATING_SYSTEMS}`),
            placeholder: getLocalizedString(`${SkillFields.OPERATING_SYSTEMS}Placeholder`),
            helperText: getLocalizedString(`${SkillFields.OPERATING_SYSTEMS}HelperText`),
            required: false,
            handleChange: (value) => resumeStore.updateSkillsOperatingSystems(value as string[]),
            modelValue: skills.operatingSystems,
        },
        databases: {
            id: SkillFields.DATABASES,
            type: 'skills',
            label: getLocalizedString(`${SkillFields.DATABASES}`),
            placeholder: getLocalizedString(`${SkillFields.DATABASES}Placeholder`),
            helperText: getLocalizedString(`${SkillFields.DATABASES}HelperText`),
            required: false,
            handleChange: (value) => resumeStore.updateSkillsDatabases(value as string[]),
            modelValue: skills.databases,
        },
        tools: {
            id: SkillFields.TOOLS,
            type: 'skills',
            label: getLocalizedString(`${SkillFields.TOOLS}`),
            placeholder: getLocalizedString(`${SkillFields.TOOLS}Placeholder`),
            helperText: getLocalizedString(`${SkillFields.TOOLS}HelperText`),
            required: false,
            handleChange: (value) => resumeStore.updateSkillsTools(value as string[]),
            modelValue: skills.tools,
        },
    };
}
</script>

<style scoped></style>
