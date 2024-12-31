<template>
    <DynamicList
        :title="getLocalizedString('topSkills')"
        :items="topSkills"
        :maxItems="MAX_TOP_SKILLS"
        :defaultItem="defaultSkill"
        :onUpdate="updateTopSkills"
        :getKey="getKey"
    >
        <template #item-fields="{ item, index, updateField, removeItem }">
            <FormField
                type="select"
                :id="`selectTopSkill-${index}`"
                :label="getLocalizedString('selectTopSkill')"
                :placeholder="getLocalizedString('selectTopSkillPlaceholder')"
                :helperText="getLocalizedString('selectTopSkillHelperText')"
                :errorText="getLocalizedString('requiredFieldError')"
                :modelValue="item.name"
                :required="false"
                :options="allSkills.map((skill) => ({ value: skill, text: skill }))"
                @valid="(value) => updateField('name', value as string)"
            />

            <FormField
                type="number"
                :id="`yearsOfExperience-${index}`"
                :label="getLocalizedString('yearsOfExperience')"
                :placeholder="getLocalizedString('yearsOfExperiencePlaceholder')"
                :helperText="getLocalizedString('yearsOfExperienceHelperText')"
                :errorText="getLocalizedString('requiredFieldError')"
                :min="0"
                :modelValue="item.yearsOfExperience"
                :required="false"
                @valid="(value) => updateField('yearsOfExperience', value as number)"
            />

            <button @click="removeItem" class="secondary icon" data-action="remove">
                <MinusIcon />
            </button>
        </template>
    </DynamicList>
</template>

<script setup lang="ts">
import MinusIcon from '@/icons/MinusIcon.vue';
import { useResumeStore } from '@/stores/resume';
import { getLocalizedString } from '@/utils/translation';
import FormField from './FormField.vue';
import { MAX_TOP_SKILLS } from '@/utils/resume/constants';
import DynamicList from './DynamicList.vue';

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

function getKey(item: TopSkill, index: number): string {
    return `${item.name}-${index}`;
}

function defaultSkill(): TopSkill {
    return { name: '', yearsOfExperience: 0 };
}

function updateTopSkills(newSkills: TopSkill[]) {
    resumeStore.setTopSkills(newSkills);
}
</script>
