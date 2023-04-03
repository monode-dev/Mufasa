<script setup lang="ts">
import { defineProps, PropType } from 'vue';
import B, { Sty, mdColors, Axis } from './B.vue';
// Allow overriding of the default sty
const props = defineProps({
  sty: {
    type: Object as PropType<Partial<Sty>>,
    default: {},
  },
});
</script>

<template>
  <B :sty="{
    cornerRadius: 0.25,
    background: mdColors.green,
    padding: 0.5,
    axis: Axis.row,
    textColor: mdColors.white,
  }">
    <slot />
  </B>
</template>