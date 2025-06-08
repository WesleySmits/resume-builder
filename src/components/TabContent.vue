<template>
    <div class="tab-content" role="tabpanel" :id="`tab-panel-${activeTab}`">
        <slot v-if="activeTab" :activeTab="activeTab"></slot>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    activeTab: string;
}>();
</script>
