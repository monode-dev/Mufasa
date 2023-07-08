<script setup lang="ts">
// https://pictogrammers.com/library/mdi/
import { defineProps, PropType } from "vue";
import { FlexSize } from "./Box/BoxSize";
import { mdColors } from "./Box/BoxDecoration";

// Create a prop called size
const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: mdColors.sameAsText,
  },
  scale: {
    type: [Number, String, Object] as PropType<number | string | FlexSize>,
    default: 1,
  },
  onClick: {
    type: [Function, undefined, null] as PropType<
      (e: MouseEvent) => void | undefined | null
    >,
    default: undefined,
  },
});
</script>

<template>
  <Box
    :onClick="onClick"
    :sty="{
      width: scale,
      height: scale,
      textColor: color,
    }"
  >
    <mdicon :name="icon" width="100%" height="100%" />
  </Box>
</template>
