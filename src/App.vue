<script setup lang="ts">
import { usePageStore, pages } from './PageStore';
import AutoUpdateLoadingScreen from './views/AutoUpdateLoadingScreen.vue';
import HomePage from './views/HomePage.vue';
import SettingsPage from './views/SettingsPage.vue';
import { gsap } from "gsap";

const { currentPage } = usePageStore();

function settingsEnter(el: HTMLElement, done: () => void) {
  // Fadin and slide up
  gsap.from(el, {
    duration: 0.2,
    opacity: 0,
    y: `50vh`,
    ease: 'power1.out',
    onComplete: done,
  });
}
function settingsLeave(el: HTMLElement, done: () => void) {
  // Fade out and slide down
  gsap.to(el, {
    duration: 0.2,
    opacity: 0,
    y: `50vh`,
    ease: 'power1.out',
    onComplete: done,
  });
}
</script>

<template>
  <div style="width: 100%; height: 100%;">
    <Transition>
      <div v-if="currentPage === pages.autoUpdate" style="background: transparent; width: 100%; height: 100%; position: absolute; top: 0; right: 0; z-index: 10;">
        <AutoUpdateLoadingScreen />
      </div>
    </Transition>
    <Transition>
      <div v-if="currentPage === pages.home || currentPage === pages.settings" style="background: transparent; width: 100%; height: 100%; position: absolute; top: 0; right: 0; z-index: 5;">
        <HomePage /> 
      </div>
    </Transition>
    <Transition
      appear
      @enter="settingsEnter"
      @leave="settingsLeave"
    >
      <div v-if="currentPage === pages.settings" style="background: transparent; width: 100%; height: 100%; position: absolute; top: 100; right: 0; z-index: 8;">
        <SettingsPage />
      </div>
    </Transition>
  </div>
</template>
