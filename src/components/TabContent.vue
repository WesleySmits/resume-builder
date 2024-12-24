<template>
    <div class="tab-content">
        <slot v-if="activeTab" :activeTab="activeTab"></slot>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    activeTab: string;
}>();
</script>
