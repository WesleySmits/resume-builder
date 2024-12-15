<template>
    <div class="about">
        <header>
            <h1>Typography and Styling Test</h1>
            <p>Testing the font, color palette, and overall styling defined in the project.</p>
        </header>

        <main>
            <section>
                <h2>Headings</h2>
                <h1>Heading Level 1</h1>
                <h2>Heading Level 2</h2>
                <h3>Heading Level 3</h3>
                <h4>Heading Level 4</h4>
                <h5>Heading Level 5</h5>
                <h6>Heading Level 6</h6>
            </section>

            <section>
                <h2>Text and Colors</h2>
                <p>This is a standard paragraph. It uses the primary text color.</p>
                <p class="muted">This is a muted paragraph. It uses the muted text color.</p>
                <a href="#">This is a link styled with the highlight color.</a>
            </section>

            <section>
                <h2>Lists</h2>
                <ul>
                    <li>Unordered List Item 1</li>
                    <li>Unordered List Item 2</li>
                    <li>Unordered List Item 3</li>
                </ul>
                <ol>
                    <li>Ordered List Item 1</li>
                    <li>Ordered List Item 2</li>
                    <li>Ordered List Item 3</li>
                </ol>
            </section>

            <section>
                <h2>Buttons</h2>
                <button type="button" class="primary" disabled>Disabled Button</button>
                <button type="button" class="primary">Primary Button</button>
                <button type="button" class="secondary">Secondary Button</button>
            </section>

            <section>
                <h2>Forms</h2>
                <form>
                    <FormField
                        id="name"
                        label="Name"
                        placeholder="Enter your name"
                        required
                        helperText="Enter your full legal name here."
                        errorText="This field is required."
                        modelValue=""
                    />

                    <FormField
                        id="email"
                        label="E-mail address"
                        type="email"
                        placeholder="Enter your e-mail address"
                        required
                        helperText="Enter your full e-mail address."
                        errorText="This field is required."
                        modelValue=""
                    />

                    <FormField
                        id="phone-number"
                        label="Phone number"
                        type="tel"
                        placeholder="Enter your phone number"
                        required
                        helperText="Enter your full phone number."
                        errorText="This field is required."
                        modelValue=""
                    />

                    <button type="submit">Submit</button>
                </form>
            </section>

            <section>
                <h2>Blockquote</h2>
                <blockquote>
                    "This is a blockquote for testing purposes. It should look distinct and styled appropriately."
                </blockquote>
            </section>

            <section>
                <h2>Table</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Header 1</th>
                            <th>Header 2</th>
                            <th>Header 3</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Data 1</td>
                            <td>Data 2</td>
                            <td>Data 3</td>
                        </tr>
                        <tr>
                            <td>Data 4</td>
                            <td>Data 5</td>
                            <td>Data 6</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section>
                <h2>Tabbed Content</h2>
                <TabBar :tabs="tabs" v-model:activeTab="activeTab" />

                <TabContent :activeTab="activeTab">
                    <template #default="{ activeTab }">
                        <div v-if="activeTab === 'general'">
                            <h1>General Information</h1>
                            <p>Enter general details here.</p>
                        </div>
                        <div v-else-if="activeTab === 'skills'">
                            <h1>Skills</h1>
                            <p>Showcase your skills here.</p>
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
                </TabContent>
            </section>
        </main>

        <footer>
            <small>Footer text styled with muted colors.</small>
        </footer>
    </div>
</template>

<script lang="ts" setup>
import FormField from '@/components/FormField.vue'
import TabBar from '@/components/TabBar.vue'
import TabContent from '@/components/TabContent.vue'
import { ref } from 'vue'

const tabs = [
    { id: 'general', name: 'General Information' },
    { id: 'skills', name: 'Skills' },
    { id: 'education', name: 'Education' },
    { id: 'work', name: 'Work Experience' },
    { id: 'additional', name: 'Additional Information' },
]

const activeTab = ref('general')
</script>

<style lang="postcss" scoped>
.about {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
}
</style>
