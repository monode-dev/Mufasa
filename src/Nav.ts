import { defineStore } from "pinia";
import { computed, reactive, Component } from "vue";
import HomeVue from "@/views/Home.page.vue";
import * as Home from "@/views/Home.page.vue";
import SettingsVue from "@/views/Settings.page.vue";
import * as Settings from "@/views/Settings.page.vue";
import { PageTransition, pageTransitions } from "./PageTransitions";

// Bank of all pages
export interface NavPage {
  component: Component;
  transitions: PageTransition;
}
export const allPages = {
  Home: {
    component: HomeVue,
    transitions: (Home as any)?.transitions ?? pageTransitions.none,
  },
  Settings: {
    component: SettingsVue,
    transitions: (Settings as any)?.transitions ?? pageTransitions.none,
  },
} satisfies {
  [key: string]: NavPage;
};

// Nav Store
export const useNav = defineStore("navigator", () => {
  const openedPages = reactive<NavPage[]>([]);

  return {
    openedPages: openedPages,
    pushPage(newPage: NavPage) {
      openedPages.push(newPage);
    },
    popPage() {
      openedPages.pop();
    },
    currentPage: computed(() => openedPages[openedPages.length - 1]),
  };
});
