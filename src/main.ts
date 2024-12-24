import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { useResumeStore } from './stores/resume';

const app = createApp(App);

app.use(createPinia());
app.use(router);

const resumeStore = useResumeStore();
resumeStore.$subscribe((mutation, state) => {
    localStorage.setItem('resumeData', JSON.stringify(state));
});

app.mount('#app');
