<script setup lang="ts">
import { defineProps, PropType } from 'vue';
import B, { Align, mdColors, Axis, Sty } from './B.vue';

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
    width: `1f`,
    height: `1f`,
    axis: Axis.column,
    align: Align.topCenter,
    textColor: mdColors.black,
    textSize: 1,
    padding: 1,
    spacing: 1,
    overflowY: `scroll`,
    ...props.sty,
  }">
    <slot />
  </B>
</template>