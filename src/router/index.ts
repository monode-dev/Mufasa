import { createRouter, createWebHistory } from 'vue-router';
import AutoUpdateLoadingScreen from '@/views/AutoUpdateLoadingScreen.vue';
import HomeView from '@/views/HomeView.vue';
import Settings from '@/views/Settings.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      children: [
        {
          path: '',
          name: 'autoUpdateLoadingScreen',
          component: AutoUpdateLoadingScreen,
        },
        {
          path: 'home',
          children: [
            {
              path: '',
              name: 'home',
              component: HomeView,
            },
            {
              path: 'settings',
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
