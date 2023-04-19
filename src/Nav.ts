import { defineStore } from "pinia";
import { computed, reactive, Component } from "vue";
import { gsap } from "gsap";

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

// Nav Store
export interface NavPage {
  component: Component;
  transitions: PageTransition;
}
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

export function pushPage(newPage: Component) {
  const nav = useNav();
  nav.pushPage({
    component: newPage,
    transitions: (newPage as any).transitions ?? pageTransitions.none,
  });
}

export function popPage() {
  const nav = useNav();
  nav.popPage();
}
