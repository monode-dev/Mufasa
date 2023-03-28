import { createRouter, createWebHistory } from 'vue-router';
import SplashScreen from '@/views/SplashScreen.vue';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'splash',
      children: [
        {
          path: '',
          name: 'splash',
          component: SplashScreen
        },
        {
          path: 'home',
          name: 'home',
          component: HomeView
        },
      ],
    }
  ]
})

export default router
