<template>
    <fieldset :id="`interests`">
        <details name="interest-curtain" :open="true">
            <summary>
                <header>
                    <legend>{{ getLocalizedString('interests') }}</legend>
                </header>
            </summary>

            <div class="form">
                <FormField
                    :type="'tags'"
                    :required="true"
                    :id="`interests`"
                    :label="getLocalizedString('interests')"
                    :placeholder="getLocalizedString('interestsPlaceholder')"
                    :helperText="getLocalizedString('interestsHelperText')"
                    :modelValue="interests"
                    @valid="(value) => updateInterests(value as string[])"
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
const interests = store.interests;

function updateInterests(newInterests: string[]): void {
    store.setInterests(newInterests);
}
</script>
