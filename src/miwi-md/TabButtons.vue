<script setup lang="ts">
import {
  defineProps,
  PropType,
  watchEffect,
  ref,
  ComponentPublicInstance,
} from "vue";
import { mdColors } from "./Box/BoxDecoration";
import { Align, Axis } from "./Box/BoxLayout";
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
  labels: {
    type: Array as PropType<string[]>,
    default: ["Tab A", "Tab B", "Tab C"],
  },
});
const emit = defineEmits(["update:selectedTab"]);
function selectTab(newTab: number) {
  if (newTab === props.selectedTab) return;
  emit("update:selectedTab", newTab);
}

const tab0Ref = ref<ComponentPublicInstance | null>(null);
const tab1Ref = ref<ComponentPublicInstance | null>(null);
const tab2Ref = ref<ComponentPublicInstance | null>(null);
const tabUnderline = ref<ComponentPublicInstance | null>(null);
watchEffect(() => {
  const newTab = props.selectedTab;
  const newUnderlinePosition =
    newTab === 0
      ? tab1Ref.value!.$el.offsetLeft - tab2Ref.value!.$el.offsetLeft
      : newTab === 1
      ? 0
      : tab2Ref.value!.$el.offsetLeft - tab1Ref.value!.$el.offsetLeft;
  if (tabUnderline.value?.$el) {
    gsap.to(tabUnderline.value.$el, {
      duration: 0.15,
      x: newUnderlinePosition,
      ease: "power1.out",
    });
  }
});
const tabButtonWidth = 4.75;
</script>

<template>
  <Row
    :sty="{
      width: `1f`,
      alignX: Align.spaceAround,
      ...sty,
    }"
  >
    <Box :sty="{ width: tabButtonWidth }" ref="tab0Ref" @click="selectTab(0)">
      {{ labels[0] }}
    </Box>
    <Box :sty="{ width: tabButtonWidth }" ref="tab1Ref" @click="selectTab(1)">
      {{ labels[1] }}
    </Box>
    <Box :sty="{ width: tabButtonWidth }" ref="tab2Ref" @click="selectTab(2)">
      {{ labels[2] }}
    </Box>
  </Row>
  <Row
    :sty="{
      width: `1f`,
      height: 0.375,
      alignX: Align.spaceAround,
    }"
  >
    <Box :sty="{ width: tabButtonWidth }" />
    <Box
      :sty="{
        width: tabButtonWidth,
        height: 0.125,
        background: mdColors.sameAsText,
      }"
      ref="tabUnderline"
    />
    <Box :sty="{ width: tabButtonWidth }" />
  </Row>
</template>
