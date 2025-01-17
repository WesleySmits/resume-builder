<template>
    <DynamicList
        :title="getLocalizedString('education')"
        :items="education"
        :defaultItem="defaultEducation"
        :onUpdate="updateEducation"
        :getKey="getKey"
        :direction="'column'"
        :id="`educations`"
    >
        <template #item-fields="{ item, index, updateField, removeItem }">
            <fieldset :id="`education-${index}`">
                <details name="education-curtain" :open="index === 0">
                    <summary>
                        <header>
                            <legend>{{ item.fieldOfStudy || getLocalizedString('newEducation') }}</legend>
                        </header>
                    </summary>
                    <FormField
                        :id="`educationInstitution-${index}`"
                        :label="getLocalizedString('educationInstitution')"
                        :placeholder="getLocalizedString('educationInstitutionPlaceholder')"
                        :helperText="getLocalizedString('educationInstitutionHelperText')"
                        :errorText="getLocalizedString('requiredFieldError')"
                        :modelValue="item.institution"
                        :required="true"
                        @valid="(value) => updateField('institution', value as string)"
                    />

                    <FormField
                        :id="`educationDegree-${index}`"
                        :label="getLocalizedString('educationDegree')"
                        :placeholder="getLocalizedString('educationDegreePlaceholder')"
                        :helperText="getLocalizedString('educationDegreeHelperText')"
                        :errorText="getLocalizedString('requiredFieldError')"
                        :modelValue="item.degree"
                        :required="true"
                        @valid="(value) => updateField('degree', value as string)"
                    />

                    <FormField
                        :id="`educationFieldOfStudy-${index}`"
                        :label="getLocalizedString('educationFieldOfStudy')"
                        :placeholder="getLocalizedString('educationFieldOfStudyPlaceholder')"
                        :helperText="getLocalizedString('educationFieldOfStudyHelperText')"
                        :errorText="getLocalizedString('requiredFieldError')"
                        :modelValue="item.fieldOfStudy"
                        :required="true"
                        @valid="(value) => updateField('fieldOfStudy', value as string)"
                    />

                    <FormField
                        :id="`educationLocation-${index}`"
                        :label="getLocalizedString('educationLocation')"
                        :placeholder="getLocalizedString('educationLocationPlaceholder')"
                        :helperText="getLocalizedString('educationLocationHelperText')"
                        :modelValue="item.location"
                        :required="false"
                        @valid="(value) => updateField('location', value as string)"
                    />

                    <FormField
                        type="date"
                        :id="`educationStartDate-${index}`"
                        :label="getLocalizedString('educationStartDate')"
                        :placeholder="getLocalizedString('educationStartDatePlaceholder')"
                        :helperText="getLocalizedString('educationStartDateHelperText')"
                        :modelValue="item.startDate"
                        :required="false"
                        @valid="(value) => updateField('startDate', value as string)"
                    />

                    <FormField
                        type="date"
                        :id="`educationEndDate-${index}`"
                        :label="getLocalizedString('educationEndDate')"
                        :placeholder="getLocalizedString('educationEndDatePlaceholder')"
                        :helperText="getLocalizedString('educationEndDateHelperText')"
                        :modelValue="item.startDate"
                        :required="false"
                        @valid="(value) => updateField('endDate', value as string)"
                    />

                    <FormField
                        :type="'textarea'"
                        :id="`educationDescription-${index}`"
                        :label="getLocalizedString('educationDescription')"
                        :placeholder="getLocalizedString('educationDescriptionPlaceholder')"
                        :helperText="getLocalizedString('educationDescriptionHelperText')"
                        :modelValue="item.description"
                        :required="false"
                        @valid="(value) => updateField('description', value as string)"
                    />

                    <button @click="removeItem" class="secondary" data-action="remove">
                        {{ getLocalizedString('deleteEducation') }}
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
const education = resumeStore.education;

function getKey(item: Education, index: number): string {
    return `${item.institution}-${item.degree}-${index}`;
}

function defaultEducation(): Education {
    return {
        institution: '',
        degree: '',
    };
}

function updateEducation(newEducation: Education[]) {
    resumeStore.setEducation(newEducation);
}
</script>
