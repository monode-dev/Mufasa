<script setup lang="ts">
import { defineProps, PropType } from 'vue';
import B, { Sty, Align, mdColors } from './B.vue';
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
    width: `100%`,
    height: `100%`,
    background: `#f9fafdff`,
    ...sty,
  }">
    <!-- Content -->
    <B :sty="{
      width: `1f`,
      height: `1f`,
      align: Align.center,
    }">
      <slot />
    </B>
  </B>
</template>