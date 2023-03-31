import { createRouter, createWebHistory } from 'vue-router';
import AutoUpdateLoadingScreen from '@/views/AutoUpdateLoadingScreen.vue';
import HomePage from '@/views/HomePage.vue';
import SettingsPage from '@/views/SettingsPage.vue';

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
              component: HomePage,
            },
            {
              path: 'settings',
              children: [
                {
                  path: '',
                  name: 'settings',
                  component: SettingsPage,
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
