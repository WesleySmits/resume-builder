<template>
    <header>
        <TabBar :tabs="tabs" v-model:activeTab="activeTab" />
    </header>

    <div class="resume-container">
        <main>
            <ResumeForm>
                <TabContent :activeTab="activeTab">
                    <template #default="{ activeTab }">
                        <div v-if="activeTab === 'general'">
                            <GeneralSection />
                        </div>
                        <div v-else-if="activeTab === 'skills'">
                            <SkillsSection />
                        </div>
                        <div v-else-if="activeTab === 'education'">
                            <h1>Education</h1>
                            <p>Provide your educational background here.</p>
                        </div>
                        <div v-else-if="activeTab === 'work'">
                            <h1>Work Experience</h1>
                            <p>Describe your work experience here.</p>
                        </div>
                        <div v-else-if="activeTab === 'additional'">
                            <h1>Additional Information</h1>
                            <p>Provide any additional information here.</p>
                        </div>
                    </template>
                </TabContent></ResumeForm
            >
        </main>

        <aside>
            <ResumePreview />
        </aside>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TabBar from '@/components/TabBar.vue';
import TabContent from '@/components/TabContent.vue';
import GeneralSection from '@/components/ResumeFormSections/GeneralSection.vue';
import ResumePreview from '@/components/ResumePreview.vue';
import SkillsSection from '@/components/ResumeFormSections/SkillsSection.vue';
import ResumeForm from '@/components/ResumeForm.vue';

const tabs = [
    { id: 'general', name: 'General Information' },
    { id: 'skills', name: 'Skills' },
    { id: 'education', name: 'Education' },
    { id: 'work', name: 'Work Experience' },
    { id: 'additional', name: 'Additional Information' },
];

const activeTab = ref('general');
</script>

<style lang="postcss" scoped>
.resume-container {
    display: flex;
    flex-flow: row nowrap;
    margin: auto;
    gap: 2rem;

    width: 100%;
    max-width: 94vw;

    main {
        flex: 0 0 60%;
    }

    aside {
        flex: 0 0 40%;
    }
}
</style>
