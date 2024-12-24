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
    emit('update:activeTab', tabId);
};
</script>

<style scoped>
.tab-bar {
    display: flex;
    gap: 1rem;
    background: var(--color-background-secondary);
    padding: 1rem;
    border-bottom: 1px solid var(--color-border);
}

button {
    background: none;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-weight: bold;
    color: var(--color-text);
    transition:
        color 0.3s,
        border-bottom 0.3s;
}

button.active {
    color: var(--color-highlight);
    border-bottom: 2px solid var(--color-highlight);
}
</style>
