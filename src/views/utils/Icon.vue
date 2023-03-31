<script setup lang="ts">
import { defineProps, PropType } from 'vue';
import B, { FlexSize, mdColors } from '@/views/utils/B.vue';

// Create a prop called size
const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: mdColors.black,
  },
  size: {
    type: [Number, String, Object] as PropType<number | string | FlexSize>,
    default: 1,
  },
});
</script>

<template>
  <B :sty="{
    width: props.size,
    height: props.size,
  }">
    <img style="width: 100%; height: 100%" :src="props.icon" :alt="props.alt">
  </B>
</template>