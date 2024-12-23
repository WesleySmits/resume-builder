import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { initializeStore } from './stores/resume';

const app = createApp(App);

app.use(createPinia());
app.use(router);

initializeStore();

app.mount('#app');
