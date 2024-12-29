<template>
    <fieldset class="top-skills">
        <header>
            <h2>{{ getLocalizedString('topSkills') }}</h2>

            <div class="buttons">
                <button
                    @click="addSkill"
                    class="primary icon"
                    data-action="add"
                    :disabled="topSkills.length >= MAX_TOP_SKILLS"
                >
                    <PlusIcon />
                </button>

                <button @click="sortSkills" class="secondary icon" data-action="sort">
                    <SortIcon />
                </button>
            </div>
        </header>

        <ul v-if="topSkills.length">
            <li v-for="(skill, index) in topSkills" :key="skill.name" class="top-skill">
                <FormField
                    type="select"
                    :id="`selectTopSkill-${index}`"
                    :label="getLocalizedString('selectTopSkill')"
                    :placeholder="getLocalizedString('selectTopSkillPlaceholder')"
                    :helperText="getLocalizedString('selectTopSkillHelperText')"
                    :errorText="getLocalizedString('requiredFieldError')"
                    :modelValue="skill.name"
                    :required="false"
                    :options="allSkills.map((skill) => ({ value: skill, text: skill }))"
                    @valid="(value) => updateSkill(index, value as string, 'name')"
                />

                <FormField
                    type="number"
                    :id="`yearsOfExperience-${index}`"
                    :label="getLocalizedString('yearsOfExperience')"
                    :placeholder="getLocalizedString('yearsOfExperiencePlaceholder')"
                    :helperText="getLocalizedString('yearsOfExperienceHelperText')"
                    :errorText="getLocalizedString('requiredFieldError')"
                    min="0"
                    :modelValue="skill.yearsOfExperience"
                    :required="false"
                    @valid="(value) => updateSkill(index, value as number, 'yearsOfExperience')"
                />

                <button @click="removeSkill(index)" class="secondary icon" data-action="remove">
                    <MinusIcon />
                </button>
            </li>
        </ul>
    </fieldset>
</template>

<script setup lang="ts">
import MinusIcon from '@/icons/MinusIcon.vue';
import PlusIcon from '@/icons/PlusIcon.vue';
import SortIcon from '@/icons/SortIcon.vue';
import { useResumeStore } from '@/stores/resume';
import { getLocalizedString } from '@/utils/translation';
import FormField from './FormField.vue';
import { MAX_TOP_SKILLS } from '@/utils/resume/resume';

const resumeStore = useResumeStore();
const topSkills = resumeStore.topSkills;

let allSkills = [
    ...resumeStore.skills.languages,
    ...resumeStore.skills.frameworks,
    ...resumeStore.skills.platforms,
    ...resumeStore.skills.methodologies,
    ...resumeStore.skills.operatingSystems,
    ...resumeStore.skills.databases,
    ...resumeStore.skills.tools,
];

resumeStore.$subscribe((_, state) => {
    allSkills = [
        ...state.skills.languages,
        ...state.skills.frameworks,
        ...state.skills.platforms,
        ...state.skills.methodologies,
        ...state.skills.operatingSystems,
        ...state.skills.databases,
        ...state.skills.tools,
    ];
});

function addSkill(): void {
    if (topSkills.length >= MAX_TOP_SKILLS) {
        return;
    }

    resumeStore.addTopSkill({ name: '', yearsOfExperience: 0 });
}

function updateSkill(index: number, value: string | number, key: string): void {
    const newSkill = { ...topSkills[index], [key]: value };
    resumeStore.updateTopSkill(index, newSkill);
}

function removeSkill(index: number): void {
    resumeStore.removeTopSkill(index);
}

function sortSkills(): void {
    resumeStore.sortTopSkills();
}
</script>

<style scoped>
.top-skills {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

header {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
}

.buttons {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
}

.top-skill {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
</style>
