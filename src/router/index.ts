import { createRouter, createWebHistory } from 'vue-router';
import Transitioner from '@/views/components/Transitioner.vue';
import SplashScreen from '@/views/SplashScreen.vue';
import HomeView from '../views/HomeView.vue';
import Settings from '@/views/Settings.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Transitioner,
      children: [
        {
          path: '',
          name: 'splash',
          component: SplashScreen,
        },
        {
          path: 'home',
          component: Transitioner,
          children: [
            {
              path: '',
              name: 'home',
              component: HomeView,
            },
            {
              path: 'settings',
              component: Transitioner,
              children: [
                {
                  path: '',
                  name: 'settings',
                  component: Settings,
                },
              ],
            },
          ],
        },
      ],
    }
  ]
})

export default router
