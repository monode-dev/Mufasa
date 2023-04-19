<script setup lang="ts">
import { defineProps, PropType } from "vue";
import B, { Sty, mdColors, Axis } from "./B.vue";
// Allow overriding of the default sty
const props = defineProps({
  sty: {
    type: Object as PropType<Partial<Sty>>,
    default: {},
  },
  raised: {
    type: Boolean,
    default: false,
  },
  outlined: {
    type: Boolean,
    default: false,
  },
  round: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
});
</script>

<template>
  <B
    :sty="{
      cornerRadius: 0.25,
      background: mdColors.green,
      padding: 0.5,
      axis: Axis.row,
      textColor: mdColors.white,
      ...sty,
    }"
  >
    <slot />
  </B>
</template>
