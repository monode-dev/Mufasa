<script setup lang="ts">
import { defineProps, PropType } from "vue";
import { Axis } from "./Box/BoxLayout";

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
      axis: Axis.row,
      ...sty,
    }"
  >
    <slot />
  </Box>
</template>
