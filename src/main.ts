import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { useResumeStore } from './stores/resume';

const app = createApp(App);

export const pinia = createPinia();

app.use(pinia);
app.use(router);

const resumeStore = useResumeStore();
resumeStore.$subscribe((_, state) => {
    localStorage.setItem('resumeData', JSON.stringify(state));
});

app.mount('#app');
