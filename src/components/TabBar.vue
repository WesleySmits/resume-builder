<template>
    <nav class="tab-bar" role="tablist">
        <button
            v-for="tab in tabs"
            :key="tab.id"
            class="tab-bar__button"
            :class="{ 'tab-bar__button--active': activeTab === tab.id }"
            role="tab"
            :aria-selected="activeTab === tab.id"
            :aria-controls="`tab-panel-${tab.id}`"
            @click="selectTab(tab.id)"
        >
            {{ tab.name }}
        </button>
    </nav>
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

.tab-bar__button {
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

.tab-bar__button--active {
    color: var(--color-highlight);
    border-bottom: 2px solid var(--color-highlight);
}
</style>
