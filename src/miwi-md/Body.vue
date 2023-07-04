<script setup lang="ts">
import { defineProps, PropType } from "vue";
import { mdColors } from "./Box/BoxDecoration";
import { Align, Axis } from "./Box/BoxLayout";

// Allow overriding of the default sty
const props = defineProps({
  sty: {
    type: Object as PropType<Partial<Sty>>,
    default: {},
  },
});
</script>

<template>
  <Box
    :sty="{
      width: `1f`,
      height: `1f`,
      axis: Axis.column,
      align: Align.topCenter,
      textColor: mdColors.black,
      scale: 1,
      pad: 1,
      overflowY: `scroll`,
      overflowX: `crop`,
      ...sty,
    }"
  >
    <slot />
  </Box>
</template>
