<template>
    <div class="form">
        <EducationFields />

        <fieldset>
            <legend>{{ getLocalizedString('certifications') }}</legend>
            <p>Fields will be added here</p>
        </fieldset>
    </div>
</template>

<script setup lang="ts">
import { getLocalizedString } from '@/utils/translation';
import EducationFields from '@/components/EducationFields.vue';
</script>
