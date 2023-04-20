<script setup lang="ts">
import { StyleValue } from "vue";
import { useNav } from "@/Nav";

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

function pageWrapperStyle(zIndex: number): StyleValue {
  return {
    background: 'transparent',
    width: '100%',
    height: '100%',
    top: '0px',
    left: '0px',
    position: 'absolute',
    zIndex,
  };
}
</script>

<template>
  <Box :sty="{
    width: `100%`,
    height: `100%`,
  }">
    <!-- Openned Pages -->
    <transition-group appear :css="false" @enter="onPageEnter" @leave="onPageLeave">
      <div v-for="(page, index) in nav.openedPages" :key="index" :id="`${pageIdTag}${index}`"
        :style="pageWrapperStyle(10 + index * 10)">
        <Page>
          <component :is="page.component" />
        </Page>
      </div>
    </transition-group>

    <!-- Offline warning is infront of all pages. -->
    <OfflineWarning />

    <!-- Splash screen is in front of everything. -->
    <div v-if="nav.openedPages.length < 1" :style="pageWrapperStyle(999999999)">
      <AutoUpdateLoadingScreen />
    </div>
  </Box>
</template>
