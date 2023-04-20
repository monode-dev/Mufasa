<script setup lang="ts">
import { defineProps, PropType } from 'vue';
import Box, { Align, mdColors, Axis, Sty } from './Box.vue';

// Allow overriding of the default sty
const props = defineProps({
  sty: {
    type: Object as PropType<Partial<Sty>>,
    default: {},
  },
});
</script>

<template>
  <Box :sty="{
    background: mdColors.white,
    cornerRadius: 0.5,
    shadowSize: 1.5,
    shadowDirection: Align.center,
    axis: Axis.column,
    align: Align.center,
    textColor: mdColors.black,
    scale: 1,
    padding: 1,
    spacing: 1,
    ...sty,
  }">
    <slot />
  </Box>
</template>