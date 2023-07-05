<script setup lang="ts">
import { PropType } from "vue";
import { mdColors } from "./Box/BoxDecoration";
import { computed } from "vue";
// Allow overriding of the default sty
const props = defineProps({
  sty: {
    type: Object as PropType<Partial<Sty>>,
    default: {},
  },
  heading: {
    type: Boolean,
    default: false,
  },
  title: {
    type: Boolean,
    default: false,
  },
  hint: {
    type: Boolean,
    default: false,
  },
  // useEllipsisForOverflow: {
  //   type: Boolean,
  //   default: false,
  // },
});
const scale = computed(
  () => props.sty.scale ?? (props.heading ? 1.5 : props.title ? 1.25 : 1),
);
</script>

<template>
  <Box
    :sty="{
      textColor: hint ? mdColors.grey : undefined,
      scale: scale,
      height: scale,
      align: $Align.topLeft,
      overflowY: $Overflow.forceStretchParent,
      // background: $mdColors.pink,
      // overflowY: Overflow.overflow,
      // useEllipsisForOverflow: useEllipsisForOverflow,
      ...sty,
      overflowX:
        sty.overflowX === $Overflow.crop
          ? $Overflow.forceStretchParent
          : sty.overflowX ?? $Overflow.wrap,
    }"
  >
    <div
      v-if="sty.overflowX === $Overflow.crop"
      style="
        position: absolute;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
        /* height: 200%; */
        /* padding-top: 0.05rem; */
      "
    >
      <slot />
    </div>
    <slot v-else />
  </Box>
</template>
