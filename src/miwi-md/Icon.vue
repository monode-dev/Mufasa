<script setup lang="ts">
// https://pictogrammers.com/library/mdi/
import { PropType } from "vue";
import { FlexSize } from "./Box/BoxSize";
import { mdColors } from "./Box/BoxDecoration";
import * as mdijs from "@mdi/js";

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
});

// From: https://github.com/therufa/mdi-vue/blob/master/src/shared.js
const ucFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
const toMdiName = (str: string) => str.split("-").map(ucFirst).join("");
</script>

<template>
  <Box
    :sty="{
      width: scale,
      height: scale,
      textColor: color,
      overflowY: $Overflow.crop,
    }"
  >
    <!-- From: https://github.com/therufa/mdi-vue/blob/master/v3.js -->
    <svg
      fill="currentColor"
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path :d="(mdijs as any)[`mdi${toMdiName(icon)}`]"></path>
    </svg>
  </Box>
</template>
