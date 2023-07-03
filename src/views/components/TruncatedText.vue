<script setup lang="ts">
import { PropType } from "vue";

const props = defineProps({
  sty: {
    type: Object as PropType<Partial<Sty>>,
    default: {},
  },
  text: {
    type: [String, null, undefined] as PropType<string | null | undefined>,
    default: ``,
  },
  maxChars: {
    type: Number,
    default: Infinity,
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
  <Text :sty="sty" :heading="heading" :title="title" :hint="hint">{{
    (text?.length ?? 0) > maxChars
      ? `${text?.substring(0, maxChars).trimEnd()}...`
      : text
  }}</Text>
</template>
