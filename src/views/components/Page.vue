<script setup lang="ts">
import B, { Align,mdColors } from '@/views/utils/B.vue';
const notchHeight = getComputedStyle(document.documentElement).getPropertyValue("--sat");
</script>

<template>
  <B :sty="{
    width: `100%`,
    height: `100%`,
  }">
    <B :sty="{
      width: `1f`,
      height: notchHeight,
      background: mdColors.green,
    }"/>
    <slot />
  </B>
</template>