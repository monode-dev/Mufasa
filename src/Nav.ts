import { defineStore } from "pinia";
import { computed, reactive, Component } from "vue";
import { gsap } from "gsap";
import { SplashScreen } from "@capacitor/splash-screen";

// Transitions
export interface PageTransition {
  enter: (el: Element, done: () => void) => void;
  leave: (el: Element, done: () => void) => void;
}
function transitionFrom(options: gsap.TweenVars): PageTransition {
  return {
    enter(el, done) {
      gsap.from(el, {
        ...options,
        onComplete: done,
      });
    },
    leave(el, done) {
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
export interface NavPage<T> {
  component: Component<T>;
  transitions: PageTransition;
}
export const useNav = defineStore("navigator", () => {
  const openedPages = reactive<(NavPage<any> & { props: any })[]>([]);

  return {
    openedPages: openedPages,
    pushPage<T>(newPage: NavPage<T>, props: T | {} = {}) {
      console.log(newPage);
      openedPages.push({
        ...newPage,
        props,
      });

      /* We do this here instead of at the end of AutoUpdateLoadingScreen
       * so that we never accidentally see the loading splash screen. */
      if (openedPages.length === 1) {
        SplashScreen.hide();
      }
    },
    popPage() {
      openedPages.pop();
    },
    currentPage: computed(() => openedPages[openedPages.length - 1]),
  };
});

export function pushPage<T>(newPage: Component<T>, props: T | {} = {}) {
  const nav = useNav();
  nav.pushPage(
    {
      component: newPage,
      transitions: (newPage as any).transitions ?? pageTransitions.none,
    },
    props,
  );
}

export function popPage() {
  const nav = useNav();
  nav.popPage();
}
