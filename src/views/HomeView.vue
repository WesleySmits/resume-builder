<template>
    <header>
        <TabBar :tabs="tabs" v-model:activeTab="activeTab" :initial-tab="activeTab" />
        <DarkModeToggle />
    </header>

    <div class="resume-container">
        <main>
            <ResumeForm>
                <TabContent :activeTab="activeTab">
                    <template #default="{ activeTab }">
                        <component v-if="activeTab" :is="getTabComponent(activeTab as TabKeys)" :key="activeTab" />
                    </template> </TabContent
            ></ResumeForm>
        </main>

        <aside>
            <ResumePreview />
        </aside>
    </div>

    <footer></footer>
</template>

<script setup lang="ts">
import { defineAsyncComponent, type Component, ref, type Ref } from 'vue';
import TabBar from '@/components/TabBar.vue';
import TabContent from '@/components/TabContent.vue';
import ResumePreview from '@/components/ResumePreview.vue';
import ResumeForm from '@/components/ResumeForm.vue';
import DarkModeToggle from '@/components/DarkModeToggle.vue';

const tabs = [
    { id: 'general', name: 'General Information' },
    { id: 'skills', name: 'Skills' },
    { id: 'education', name: 'Education' },
    { id: 'work', name: 'Work Experience' },
    { id: 'additional', name: 'Additional Information' },
];

const hash = window.location.hash.slice(1) as TabKeys;
const activeTab: Ref<TabKeys> = hash && tabs.some((tab) => tab.id === hash) ? ref(hash) : ref('general');

type TabKeys = 'general' | 'skills' | 'education' | 'work' | 'additional';

const tabComponents: Record<TabKeys, Component> = {
    general: defineAsyncComponent(() => import('@/components/ResumeFormSections/GeneralSection.vue')),
    skills: defineAsyncComponent(() => import('@/components/ResumeFormSections/SkillsSection.vue')),
    education: defineAsyncComponent(() => import('@/components/ResumeFormSections/EducationSection.vue')),
    work: defineAsyncComponent(() => import('@/components/ResumeFormSections/JobSection.vue')),
    additional: defineAsyncComponent(() => import('@/components/ResumeFormSections/AdditionalSection.vue')),
};

function getTabComponent(tabId: TabKeys): Component | null {
    return tabComponents[tabId] || null;
}
</script>

<style lang="postcss" scoped>
.resume-container {
    display: flex;
    flex-flow: column nowrap;
    margin: auto;
    gap: 2rem;
    padding: 2rem 0;

    width: 100%;
    max-width: 94vw;

    @media (min-width: 1280px) {
        flex-flow: row nowrap;
        justify-content: space-between;
        gap: 0;

        main {
            flex: 0 0 50%;
        }

        aside {
            flex: 0 0 40%;
        }
    }
}

header {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    background: var(--color-background-secondary);
    border-bottom: 1px solid var(--color-border);
    padding: 0 1rem;
}

footer {
    padding: 10rem;
}
</style>
