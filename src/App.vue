<script setup lang="ts">
import { ref } from "vue";
import { useNav } from "./Nav";
import AutoUpdateLoadingScreen from "./views/AutoUpdateLoadingScreen.vue";
import B, { Align, mdColors, Axis, sizeToCss } from "./views/miwi-vue/B.vue";
import Icon from "@/views/miwi-vue/Icon.vue";
import nowWiFiSvg from "@/assets/wifi_off_FILL1_wght400_GRAD0_opsz48.svg";
import { Network } from "@capacitor/network";
import { pageTransitions } from "@/Nav";
import Page from "@/views/miwi-vue/Page.vue";

const nav = useNav();
const pageIdTag = `_miwi_page_`;
let nextPageLeaveTransition:
  | ((el: Element, done: () => void) => void)
  | undefined;
function onPageEnter(el: Element, done: () => void) {
  const pageIndex = parseInt(el.id.substring(pageIdTag.length));
  const page = nav.openedPages[pageIndex];
  nextPageLeaveTransition = page.transitions.leave;
  page.transitions.enter(el, done);
}
function onPageLeave(el: Element, done: () => void) {
  nextPageLeaveTransition?.(el, done);
  const page =
    nav.openedPages.length > 0
      ? nav.openedPages[nav.openedPages.length - 1]
      : undefined;
  nextPageLeaveTransition = page?.transitions.leave;
}

const hasInternet = ref(true);
Network.getStatus().then((status) => (hasInternet.value = status.connected));
Network.addListener("networkStatusChange", (status) => {
  hasInternet.value = status.connected;
});
const offlineWarningTransitions = pageTransitions.from({
  duration: 0.15,
  y: sizeToCss(4),
  ease: "power1.out",
});
</script>

<template>
  <B
    :sty="{
      width: `100%`,
      height: `100%`,
    }"
  >
    <!-- Openned Pages -->
    <transition-group
      appear
      :css="false"
      @enter="onPageEnter"
      @leave="onPageLeave"
    >
      <div
        v-for="(page, index) in nav.openedPages"
        :key="index"
        :id="`${pageIdTag}${index}`"
        :style="{
          background: 'transparent',
          width: '100%',
          height: '100%',
          top: '0px',
          left: '0px',
          position: 'absolute',
          zIndex: 10 + index * 10,
        }"
      >
        <Page><component :is="page.component" /></Page>
      </div>
    </transition-group>

    <!-- Offline warning is infront of all pages. -->
    <Transition
      appear
      @enter="offlineWarningTransitions.enter"
      @leave="offlineWarningTransitions.leave"
    >
      <div
        v-if="!hasInternet"
        :style="{
          background: `transparent`,
          width: `100%`,
          height: `100%`,
          bottom: 0,
          left: 0,
          position: `absolute`,
          pointerEvents: `none`,
          zIndex: 999999998,
        }"
      >
        <B
          :sty="{
            width: `100%`,
            height: `100%`,
            padding: 1,
            align: Align.bottomLeft,
          }"
        >
          <B
            :sty="{
              background: mdColors.orange,
              textColor: mdColors.white,
              cornerRadius: 1,
              shadowDirection: Align.center,
              shadowSize: 2,
              padding: 0.5,
              axis: Axis.row,
              spacing: 0.5,
            }"
          >
            <Icon :size="1" :icon="nowWiFiSvg" alt="Offline" />
            Will Sync When Online
          </B>
        </B>
      </div>
    </Transition>

    <!-- Splash screen is in front of everything. -->
    <div
      v-if="nav.openedPages.length < 1"
      :style="{
        background: `transparent`,
        width: `100%`,
        height: `100%`,
        position: `absolute`,
        zIndex: 999999999,
      }"
    >
      <AutoUpdateLoadingScreen />
    </div>
  </B>
</template>
