<script setup lang="ts">
import {
  defineProps,
  PropType,
  ComponentPublicInstance,
  watchEffect,
  ref,
  onMounted,
} from "vue";
import Box, { Sty, Align, Axis, Overflow } from "./Box.vue";
import { gsap } from "gsap";

// Allow overriding of the default sty
const props = defineProps({
  sty: {
    type: Object as PropType<Partial<Sty>>,
    default: {},
  },
  selectedTab: {
    type: Number,
    default: 1,
  },
});
const emit = defineEmits(["update:selectedTab"]);
function selectTab(newTab: number) {
  if (newTab === props.selectedTab) return;
  emit("update:selectedTab", newTab);
}
const tabBodiesParent = ref<ComponentPublicInstance | null>(null);
watchEffect(() => {
  const newTab = props.selectedTab;
  const newTabPosition = newTab === 0 ? `100vw` : newTab === 1 ? 0 : `-100vw`;
  if (tabBodiesParent.value?.$el) {
    gsap.to(tabBodiesParent.value.$el, {
      duration: 0.15,
      x: newTabPosition,
      ease: "power1.out",
    });
  }
});

// Swipe gesture
onMounted(() => {
  let swipeStartTime = 0;
  let swipeStartX = 0;
  let swipeStartY = 0;
  let lastSwipeX = 0;
  let lastSwipeY = 0;
  tabBodiesParent.value?.$el.addEventListener("touchstart", (e: TouchEvent) => {
    const touch = e.touches[0];
    swipeStartX = touch.clientX;
    swipeStartY = touch.clientY;
    lastSwipeX = touch.clientX;
    lastSwipeY = touch.clientY;
    swipeStartTime = Date.now();
  });
  tabBodiesParent.value?.$el.addEventListener("touchmove", (e: TouchEvent) => {
    const touch = e.touches[0];
    lastSwipeX = touch.clientX;
    lastSwipeY = touch.clientY;
  });
  tabBodiesParent.value?.$el.addEventListener("touchend", (e: TouchEvent) => {
    const deltaX = lastSwipeX - swipeStartX;
    const deltaY = lastSwipeY - swipeStartY;
    const deltaTime = Date.now() - swipeStartTime;
    const velocityX = deltaX / deltaTime;
    if (
      Math.abs(deltaX) > Math.abs(deltaY) &&
      Math.abs(deltaX) > 50 &&
      Math.abs(velocityX) > 0.2
    ) {
      // e.preventDefault();
      if (deltaX > 0) {
        selectTab(Math.max(0, props.selectedTab - 1));
      } else {
        selectTab(Math.min(2, props.selectedTab + 1));
      }
    }
  });
});
</script>

<template>
  <Box
    ref="tabBodiesParent"
    :sty="{
      width: `300%`,
      height: `1f`,
      axis: Axis.row,
      align: Align.topCenter,
      overflowX: Overflow.crop,
    }"
  >
    <Box
      :sty="{
        width: `1f`,
        height: `1f`,
      }"
    >
      <slot name="tab0" />
    </Box>
    <Box
      :sty="{
        width: `1f`,
        height: `1f`,
      }"
    >
      <slot name="tab1" />
    </Box>
    <Box
      :sty="{
        width: `1f`,
        height: `1f`,
      }"
    >
      <slot name="tab2" />
    </Box>
  </Box>
</template>
