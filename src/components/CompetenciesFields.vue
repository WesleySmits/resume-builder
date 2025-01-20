<template>
    <fieldset :id="`competencies`">
        <details name="competency-curtain" :open="true">
            <summary>
                <header>
                    <legend>{{ getLocalizedString('competencies') }}</legend>
                </header>
            </summary>

            <div class="form">
                <FormField
                    :type="'tags'"
                    :required="true"
                    :id="`competency`"
                    :label="getLocalizedString('competency')"
                    :placeholder="getLocalizedString('competencyPlaceholder')"
                    :helperText="getLocalizedString('competencyHelperText')"
                    :modelValue="competencies"
                    @valid="(value) => updateCompetencies(value as string[])"
                />
            </div>
        </details>
    </fieldset>
</template>

<script setup lang="ts">
import { getLocalizedString } from '@/utils/translation';
import { useResumeStore } from '@/stores/resume';
import FormField from './FormField.vue';

const store = useResumeStore();
const competencies = store.competencies;

function updateCompetencies(newCompetencies: string[]): void {
    store.setCompetencies(newCompetencies);
}
</script>
