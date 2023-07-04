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
});
</script>

<template>
  <Box
    :sty="{
      axis: $Axis.column,
      ...sty,
    }"
    :shouldLog="shouldLog"
  >
    <slot />
  </Box>
</template>
