<script setup lang="ts">
import { defineProps, PropType } from "vue";

// Allow overriding of the default sty
const props = defineProps({
  sty: {
    type: Object as PropType<Partial<Sty>>,
    default: {},
  },
  label: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <Row :sty="{ width: `1f`, padBetween: 0.25, align: $Align.topLeft, ...sty }">
    <Text :style="{ whiteSpace: `nowrap` }">{{ label }}:</Text>
    <slot />
  </Row>
</template>
