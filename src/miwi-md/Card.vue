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
  onClick: {
    type: [Function, undefined, null] as PropType<
      (e: MouseEvent) => void | undefined | null
    >,
    default: undefined,
  },
});
</script>

<template>
  <Box
    :onClick="onClick"
    :sty="{
      background: mdColors.white,
      cornerRadius: 0.5,
      shadowSize: 1.5,
      shadowDirection: Align.bottomRight,
      axis: Axis.column,
      align: Align.center,
      textColor: mdColors.black,
      scale: 1,
      pad: 1,
      ...sty,
    }"
  >
    <slot />
  </Box>
</template>
