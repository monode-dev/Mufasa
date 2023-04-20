<script setup lang="ts">
import { defineProps, PropType, ref, VNodeRef, watchEffect } from "vue";
import Box, { Sty, mdColors, Axis } from "./Box.vue";
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
});
</script>

<template>
  <Box :sty="{
    textColor: hint ? mdColors.grey : undefined,
    scale: heading ? 1.5 : title ? 1.25 : 1,
    ...sty,
  }">
    <slot></slot>
  </Box>
</template>
