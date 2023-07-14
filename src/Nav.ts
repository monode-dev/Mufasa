import { defineStore } from "pinia";
import { computed, Component, shallowRef, ref } from "vue";
import { gsap } from "gsap";
import { SplashScreen } from "@capacitor/splash-screen";
import { App } from "@capacitor/app";

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
  const openedPages = shallowRef<(NavPage<any> & { props: any })[]>([]);
  function popPage() {
    openedPages.value = openedPages.value.slice(0, -1);
  }
  App.addListener("backButton", popPage);

  return {
    notchHeight: ref(`0px`),
    openedPages: computed(() => openedPages.value),
    pushPage<T>(newPage: Component<T>, props: T | {} = {}) {
      openedPages.value = [
        ...openedPages.value,
        {
          component: newPage,
          transitions: (newPage as any).transitions ?? pageTransitions.none,
          props,
        },
      ];

      /* We do this here instead of at the end of AutoUpdateLoadingScreen
       * so that we never accidentally see the loading splash screen. */
      if (openedPages.value.length === 1) {
        (async () => {
          // Wait for a bit for the data to load. This is a patch but it feels much better.
          await new Promise((resolve) => setTimeout(resolve, 1.5 * 1000));
          SplashScreen.hide();
        })();
      }
    },
    popPage,
    currentPage: computed(
      () => openedPages.value[openedPages.value.length - 1],
    ),
  };
});

export function pushPage<T>(newPage: Component<T>, props: T | {} = {}) {
  const nav = useNav();
  nav.pushPage(newPage, props);
}

export function popPage() {
  const nav = useNav();
  nav.popPage();
}
