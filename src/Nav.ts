import { defineStore } from "pinia";
import { computed, reactive, Component } from "vue";
import { gsap } from "gsap";
import HomePage from "./views/HomePage.vue";
import SettingsPage from "./views/SettingsPage.vue";

// Transitions
export interface PageTransition {
  enter: (el: Element, done: () => void) => void;
  leave: (el: Element, done: () => void) => void;
}
function transitionFrom(options: gsap.TweenVars): PageTransition {
  return {
    enter(el, done) {
      console.log(el);
      gsap.from(el, {
        ...options,
        onComplete: done,
      });
    },
    leave(el, done) {
      console.log(`leave`);
      gsap.to(el, {
        ...options,
        onComplete: done,
      });
    },
  };
}
export const pageTransitions = {
  from: transitionFrom,
  slideUp: (options: gsap.TweenVars = {}) =>
    transitionFrom({
      duration: 0.15,
      opacity: 0,
      y: `50vh`,
      ease: "power1.out",

      // Allow overrides
      ...options,
    }),
  fadeIn: (options: gsap.TweenVars = {}) =>
    transitionFrom({
      duration: 0.15,
      opacity: 0,
      ease: "power1.out",

      // Allow overrides
      ...options,
    }),
  none: {
    enter(el, done) {
      done();
    },
    leave(el, done) {
      done();
    },
  } satisfies PageTransition,
};

// Bank of all pages
export interface NavPage {
  component: Component;
  transition: PageTransition;
}
export const allPages = {
  home: {
    component: HomePage,
    transition: pageTransitions.none,
  },
  settings: {
    component: SettingsPage,
    transition: pageTransitions.slideUp(),
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
