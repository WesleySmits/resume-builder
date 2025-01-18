<template>
    <DynamicList
        :title="getLocalizedString('languages')"
        :items="languages"
        :default-item="defaultLanguage"
        :onUpdate="updateLanguages"
        :getKey="getKey"
        :direction="'column'"
        :id="'languages'"
    >
        <template #item-fields="{ item, index, updateField, removeItem }">
            <fieldset :id="`language-fieldset-${index}`">
                <details name="language-curtain" :open="index === 0">
                    <summary>
                        <header>
                            <legend>{{ item.name || getLocalizedString('newLanguage') }}</legend>
                        </header>
                    </summary>

                    <div class="form">
                        <FormField
                            :type="'text'"
                            :required="true"
                            :id="`language-${index}`"
                            :label="getLocalizedString('language')"
                            :placeholder="getLocalizedString('languagePlaceholder')"
                            :helperText="getLocalizedString('languageHelperText')"
                            :modelValue="item.name"
                            @valid="(value) => updateField('name', value as string)"
                        />

                        <FormField
                            :type="'select'"
                            :required="true"
                            :id="`language-experience-${index}`"
                            :label="getLocalizedString('languageExperience')"
                            :helperText="getLocalizedString('languageExperienceHelperText')"
                            :placeholder="getLocalizedString('languageExperiencePlaceholder')"
                            :modelValue="item.experience"
                            @valid="(value) => updateField('experience', value as string)"
                            :options="[
                                { value: 'Beginner', text: getLocalizedString('beginner') },
                                { value: 'Intermediate', text: getLocalizedString('intermediate') },
                                { value: 'Advanced', text: getLocalizedString('advanced') },
                                { value: 'Fluent/Native', text: getLocalizedString('fluent') },
                            ]"
                        />

                        <button @click="removeItem" type="button" class="secondary" data-action="remove">
                            {{ getLocalizedString('removeLanguage') }}
                        </button>
                    </div>
                </details>
            </fieldset>
        </template>
    </DynamicList>
</template>

<script setup lang="ts">
import { getLocalizedString } from '@/utils/translation';
import DynamicList from './DynamicList.vue';
import { useResumeStore } from '@/stores/resume';
import FormField from './FormField.vue';

const store = useResumeStore();
const languages = store.languages;

function defaultLanguage(): Language {
    return {
        name: '',
        experience: 'Beginner',
    };
}

function getKey(item: Language, index: number): string {
    return `language-${item.name}-${index}`;
}

function updateLanguages(newLanguages: Language[]): void {
    store.setLanguages(newLanguages);
}
</script>
