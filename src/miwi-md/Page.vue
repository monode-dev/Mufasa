<script setup lang="ts">
import { defineProps, PropType } from "vue";
import { Align, Overflow } from "./Box/BoxLayout";
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
      width: `100%`,
      height: `100%`,
      background: `#f9fafdff`,
      align: Align.topCenter,
      overflowX: Overflow.crop,
      overflowY: Overflow.crop,
      ...sty,
    }"
  >
    <!-- Content -->
    <slot />
  </Box>
</template>
