<template>
    <div class="tab-content">
        <slot v-if="activeTab" :activeTab="activeTab"></slot>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

defineProps<{
    activeTab: string
}>()
</script>
