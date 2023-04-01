import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

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

  return { currentPage, pushPage }
})