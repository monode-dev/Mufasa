<script setup lang="ts">
import { defineProps, PropType } from "vue";

const props = defineProps({
  sty: {
    type: Object as PropType<Partial<Sty>>,
    default: {},
  },
  shouldLog: {
    type: Boolean,
    default: false,
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
      axis: $Axis.column,
      ...sty,
    }"
    :shouldLog="shouldLog"
  >
    <slot />
  </Box>
</template>
