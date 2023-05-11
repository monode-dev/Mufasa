<script setup lang="ts">
import { defineProps, PropType } from "vue";
import Box, { Sty, mdColors, Axis, Align } from "./Box.vue";
import { computed } from "@vue/reactivity";
// Allow overriding of the default sty
const props = defineProps({
  sty: {
    type: Object as PropType<Partial<Sty>>,
    default: {},
  },
  raised: {
    type: Boolean,
    default: false,
  },
  outlined: {
    type: Boolean,
    default: false,
  },
  round: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  pill: {
    type: Boolean,
    default: false,
  },
});
const shapeSty = computed(() => {
  if (props.round) {
    return { cornerRadius: `100%` };
  } else if (props.pill) {
    return { cornerRadius: 1, padding: 0.5 };
  } else {
    return { cornerRadius: 0.25, padding: 0.5 };
  }
});
const colorSty = computed(() =>
  props.outlined
    ? ({
        background: mdColors.white,
        outlineColor: mdColors.sameAsText,
        outlineSize: 0.125,
      } satisfies Partial<Sty>)
    : {
        background: mdColors.green,
        textColor: mdColors.white,
      },
);
const shadowSty = computed(() =>
  props.raised
    ? ({
        shadowSize: 1,
        shadowDirection: Align.bottomRight,
      } satisfies Partial<Sty>)
    : {},
);
</script>

<template>
  <Box
    :sty="{
      align: Align.center,
      axis: Axis.row,
      ...shapeSty,
      ...colorSty,
      ...shadowSty,
      ...sty,
    }"
  >
    <slot />
  </Box>
</template>
