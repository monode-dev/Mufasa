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
    width: `1f`,
    height: `1f`,
    axis: Axis.column,
    align: Align.topCenter,
    textColor: mdColors.black,
    scale: 1,
    padding: 1,
    spacing: 1,
    overflowY: `scroll`,
    overflowX: `crop`,
    ...sty,
  }">
    <slot />
  </Box>
</template>