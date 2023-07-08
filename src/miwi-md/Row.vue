<script setup lang="ts">
import { defineProps, PropType } from "vue";
import { Axis } from "./Box/BoxLayout";

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
      axis: Axis.row,
      ...sty,
    }"
  >
    <slot />
  </Box>
</template>
