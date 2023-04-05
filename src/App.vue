<script setup lang="ts">
import { usePageStore, pages } from './PageStore';
import AutoUpdateLoadingScreen from './views/AutoUpdateLoadingScreen.vue';
import HomePage from './views/HomePage.vue';
import SettingsPage from './views/SettingsPage.vue';
import B, { Align, mdColors, Axis } from './views/miwi-vue/B.vue';
import { gsap } from "gsap";
import Icon from '@/views/miwi-vue/Icon.vue';
import nowWiFiSvg from '@/assets/wifi_off_FILL1_wght400_GRAD0_opsz48.svg';

const { currentPage, hasInternet } = usePageStore();

function settingsEnter(el: HTMLElement, done: () => void) {
  // Fadin and slide up
  gsap.from(el, {
    duration: 0.15,
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
      <div v-if="currentPage === pages.autoUpdate" :style="{
        background: `transparent`,
        width: `100%`,
        height: `100%`,
        position: `absolute`,
        zIndex: 20,
      }">
        <AutoUpdateLoadingScreen />
      </div>
    </Transition>
    <Transition>
      <div v-if="currentPage === pages.home || currentPage === pages.settings" :style="{
        background: `transparent`,
        width: `100%`,
        height: `100%`,
        position: `absolute`,
        zIndex: 10,
      }">
        <HomePage /> 
      </div>
    </Transition>
    <Transition
      appear
      @enter="settingsEnter"
      @leave="settingsLeave"
    >
      <div v-if="currentPage === pages.settings" :style="{
        background: `transparent`,
        width: `100%`,
        height: `100%`,
        position: `absolute`,
        zIndex: 15,
      }">
        <SettingsPage />
      </div>
    </Transition>
    <Transition
      appear
      @enter="settingsEnter"
      @leave="settingsLeave"
    >
      <div v-if="!hasInternet" :style="{
        background: `transparent`,
        width: `100%`,
        height: `100%`,
        position: `absolute`,
        pointerEvents: `none`,
        zIndex: 17,
      }">
        <B :sty="{
          width: `100%`,
          height: `100%`,
          padding: 1,
          align: Align.bottomLeft,
        }">
          <B :sty="{
            background: mdColors.red,
            textColor: mdColors.white,
            cornerRadius: 1,
            shadowDirection: Align.center,
            shadowSize: 2,
            padding: 0.5,
            axis: Axis.row,
            spacing: 0.5,
          }">
            <Icon :size="1" :icon="nowWiFiSvg" alt="Offline"/>
            Will Sync When Online
          </B>
        </B>
      </div>
    </Transition>
  </div>
</template>
