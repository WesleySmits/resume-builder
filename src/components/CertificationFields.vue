<template>
    <DynamicList
        :title="getLocalizedString('certifications')"
        :items="certifications"
        :defaultItem="defaultCertification"
        :onUpdate="updateCertifications"
        :getKey="getKey"
        :direction="'column'"
    >
        <template #item-fields="{ item, index, updateField, removeItem }">
            <fieldset>
                <details>
                    <summary>
                        <header>
                            <legend>{{ item.title || getLocalizedString('newCertification') }}</legend>
                        </header>
                    </summary>
                    <FormField
                        :id="`certificationTitle-${index}`"
                        :label="getLocalizedString('certificationTitle')"
                        :placeholder="getLocalizedString('certificationTitlePlaceholder')"
                        :helperText="getLocalizedString('certificationTitleHelperText')"
                        :errorText="getLocalizedString('requiredFieldError')"
                        :modelValue="item.title"
                        :required="true"
                        @valid="(value) => updateField('title', value as string)"
                    />

                    <FormField
                        :id="`certificationProvider-${index}`"
                        :label="getLocalizedString('certificationProvider')"
                        :placeholder="getLocalizedString('certificationProviderPlaceholder')"
                        :helperText="getLocalizedString('certificationProviderHelperText')"
                        :errorText="getLocalizedString('requiredFieldError')"
                        :modelValue="item.provider"
                        :required="true"
                        @valid="(value) => updateField('provider', value as string)"
                    />

                    <FormField
                        type="yesno"
                        :id="`certificationCompleted-${index}`"
                        :label="getLocalizedString('certificationCompleted')"
                        :modelValue="item.completed"
                        @valid="(value) => updateField('completed', value as boolean)"
                    />

                    <FormField
                        type="number"
                        :min="1900"
                        :max="new Date().getFullYear()"
                        :id="`certificationYear-${index}`"
                        :label="getLocalizedString('certificationYear')"
                        :placeholder="getLocalizedString('certificationYearPlaceholder')"
                        :helperText="getLocalizedString('certificationYearHelperText')"
                        :modelValue="item.year"
                        :required="false"
                        @valid="(value) => updateField('year', value as number)"
                    />

                    <button @click="removeItem" class="secondary" data-action="remove">
                        {{ getLocalizedString('deleteCertification') }}
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
const certifications = resumeStore.certifications;

function getKey(item: Certification, index: number): string {
    return `${item.title}-${item.provider}-${index}`;
}

function defaultCertification(): Certification {
    return {
        title: '',
        provider: '',
        completed: false,
    };
}

function updateCertifications(newCertifications: Certification[]) {
    resumeStore.setCertifications(newCertifications);
}
</script>
