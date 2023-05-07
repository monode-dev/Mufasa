<script setup lang="ts">
import { defineProps, PropType } from 'vue';
import Box, { FlexSize, mdColors } from './Box.vue';

// Create a prop called size
const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: mdColors.sameAsText,
  },
  scale: {
    type: [Number, String, Object] as PropType<number | string | FlexSize>,
    default: 1,
  },
});
console.log(props.scale)
</script>

<template>
  <Box :sty="{
    width: scale,
    height: scale,
    textColor: color,
  }">
    <mdicon :name="icon" width="100%" height="100%" />
  </Box>
</template>