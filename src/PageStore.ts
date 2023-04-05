import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Network } from '@capacitor/network';

export type Page = typeof pages[keyof typeof pages];
export const pages = {
  autoUpdate: `autoUpdate`,
  home: `home`,
  settings: `settings`,
}
export const usePageStore = defineStore('pageStore', () => {
  const _currentPage = ref(pages.autoUpdate as Page);
  const currentPage = computed(() => _currentPage)
  function pushPage(newPage: Page) {
    _currentPage.value = newPage;
  }

  const _hasInternet = ref(true);
  const hasInternet = computed(() => _hasInternet);
  Network.addListener('networkStatusChange', status => {
    _hasInternet.value = status.connected;
  });

  return { currentPage, pushPage, hasInternet }
})