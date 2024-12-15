<template>
    <form @submit.prevent="submitForm">
        <slot></slot>
        <button type="submit">Save</button>
    </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { resumeData } from '@/stores/resume';

export default defineComponent({
    name: 'ResumeForm',
    setup() {
        const submitForm = () => {
            console.log('Form submitted', resumeData);
        };

        return {
            submitForm,
            resumeData,
        };
    },
});
</script>
