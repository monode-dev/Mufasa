<script setup lang="ts">
import { defineProps, PropType } from 'vue';
import B, { FlexSize, mdColors } from '@/views/components/B.vue.js';
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
    <svg :fill="props.color">
      <InlineSvg 
        width="100%"
        height="100%"
        :src="props.icon"
        :alt="props.alt"></InlineSvg>
    </svg>
  </B>
</template>