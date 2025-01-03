import './assets/main.css';

import { createApp } from 'vue';

import App from './App.vue';
import router from './router';
import { useResumeStore } from './stores/resume';
import { createdPinia } from './pinia';

const app = createApp(App);

app.use(createdPinia);
app.use(router);

const resumeStore = useResumeStore();
resumeStore.$subscribe((_, state) => {
    localStorage.setItem('resumeData', JSON.stringify(state));
});

app.mount('#app');
