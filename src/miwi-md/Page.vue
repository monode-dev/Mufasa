<script setup lang="ts">
import { defineProps, PropType } from 'vue';
import Box, { Sty, Align, mdColors } from './Box.vue';
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
    width: `100%`,
    height: `100%`,
    background: `#f9fafdff`,
    ...sty,
  }">
    <!-- Content -->
    <Box :sty="{
      width: `1f`,
      height: `1f`,
      align: Align.center,
    }">
      <slot />
    </Box>
  </Box>
</template>