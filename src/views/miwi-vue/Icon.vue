<script setup lang="ts">
import { defineProps, PropType } from 'vue';
import B, { FlexSize, mdColors } from './B.vue';
import InlineSvg from 'vue-inline-svg';

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
    default: mdColors.sameAsText,
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
    <svg 
      width="100%"
      height="100%"
      :fill="props.color"
      :alt="props.alt">
      <InlineSvg
      width="100%"
      height="100%"
      :src="props.icon"></InlineSvg>
    </svg>
  </B>
</template>