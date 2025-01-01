<template>
    <div class="tab-bar">
        <button v-for="tab in tabs" :key="tab.id" :class="{ active: activeTab === tab.id }" @click="selectTab(tab.id)">
            {{ tab.name }}
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    tabs: Array<{ id: string; name: string }>;
    initialTab?: string;
}>();

const emit = defineEmits<{
    (e: 'update:activeTab', activeTab: string): void;
}>();

const activeTab = ref(props.initialTab || props.tabs[0]?.id);

const selectTab = (tabId: string) => {
    activeTab.value = tabId;
    window.location.hash = tabId;
    emit('update:activeTab', tabId);
};
</script>

<style scoped>
.tab-bar {
    display: flex;
    flex: 1;
    gap: 1rem;
    padding: 1rem 0;
    overflow-x: auto;
}

button {
    background: none;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-weight: bold;
    color: var(--color-text);
    transition:
        color var(--transition-duration),
        border-bottom var(--transition-duration);
}

button.active {
    color: var(--color-highlight);
    border-bottom: 2px solid var(--color-highlight);
}
</style>
