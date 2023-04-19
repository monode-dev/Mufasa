<script setup lang="ts">
import { defineProps, PropType, ref, VNodeRef, watchEffect } from "vue";
import B, { Sty, mdColors, Axis } from "./B.vue";
// Allow overriding of the default sty
const props = defineProps({
  sty: {
    type: Object as PropType<Partial<Sty>>,
    default: {},
  },
  heading: {
    type: Boolean,
    default: false,
  },
  title: {
    type: Boolean,
    default: false,
  },
  hint: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <B
    :sty="{
      textColor: hint ? mdColors.grey : undefined,
      ...sty,
    }"
  >
    <slot></slot>
  </B>
</template>
