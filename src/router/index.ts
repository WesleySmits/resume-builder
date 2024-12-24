import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/style-guide',
            name: 'style-guide',
            component: () => import('../views/StyleGuideView.vue'),
        },
    ],
});

export default router;
