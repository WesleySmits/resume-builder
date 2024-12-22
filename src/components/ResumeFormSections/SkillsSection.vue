<template>
    <h1>Skills</h1>
    <div class="form">
        <fieldset>
            <legend>Skills</legend>

            <FormField
                id="skillLanguages"
                :label="getLocalizedString('programmingLanguagesTitle')"
                placeholder="Add languages (e.g., JavaScript, Python)"
                type="skills"
                helperText="Enter all languages you are familiar with."
                errorText="An error occurred."
                :modelValue="skills.languages"
                @update:modelValue="(value) => updateSkillsLanguages(value as string[])"
            />

            <FormField
                id="skillFrameworks"
                :label="getLocalizedString('frameworksTitle')"
                placeholder="Add frameworks (e.g., Angular, Symfony, Laravel)"
                type="skills"
                helperText="Enter all frameworks you are familiar with."
                errorText="An error occurred."
                :modelValue="skills.frameworks"
                @update:modelValue="(value) => updateSkillsFrameworks(value as string[])"
            />
            <FormField
                id="skillPlatforms"
                :label="getLocalizedString('platformsTitle')"
                placeholder="Add platforms (e.g., AWS, Azure, Docker)"
                type="skills"
                helperText="Enter all platforms you are familiar with."
                errorText="An error occurred."
                :modelValue="skills.platforms"
                @update:modelValue="(value) => (skills.platforms = value as string[])"
            />
            <FormField
                id="skillMethodologies"
                :label="getLocalizedString('methodologiesTitle')"
                placeholder="Add methodologies (e.g., Agile, Scrum, Kanban)"
                type="skills"
                helperText="Enter all methodologies you are familiar with."
                errorText="An error occurred."
                :modelValue="skills.methodologies"
                @update:modelValue="(value) => (skills.methodologies = value as string[])"
            />
            <FormField
                id="skillOperatingSystems"
                :label="getLocalizedString('operatingSystemsTitle')"
                placeholder="Add operating systems (e.g., Windows, macOS, Linux)"
                type="skills"
                helperText="Enter all operating systems you are familiar with."
                errorText="An error occurred."
                :modelValue="skills.operatingSystems"
                @update:modelValue="(value) => (skills.operatingSystems = value as string[])"
            />

            <FormField
                id="skillDatabases"
                :label="getLocalizedString('databaseTitle')"
                placeholder="Add databases (e.g., MySQL, PostgreSQL, MongoDB)"
                type="skills"
                helperText="Enter all databases you are familiar with."
                errorText="An error occurred."
                :modelValue="skills.databases"
                @update:modelValue="(value) => (skills.databases = value as string[])"
            />

            <FormField
                id="skillTools"
                :label="getLocalizedString('toolsTitle')"
                placeholder="Add tools (e.g., Git, Docker, Jenkins)"
                type="skills"
                helperText="Enter all tools you are familiar with."
                errorText="An error occurred."
                :modelValue="skills.tools"
                @update:modelValue="(value) => (skills.tools = value as string[])"
            />
        </fieldset>
    </div>
</template>

<script setup lang="ts">
import { resumeData, updateSkillsFrameworks, updateSkillsLanguages } from '@/stores/resume';
import { reactive } from 'vue';
import FormField from '@/components/FormField.vue';
import { getLocalizedString } from '@/utils/resume/Page';

const skills = reactive(resumeData.skills);
</script>

<style scoped></style>
