<script setup lang="ts">
import { defineProps, PropType } from "vue";
import Box, { Sty, mdColors, Axis, Align } from "./Box.vue";
// Allow overriding of the default sty
const props = defineProps({
  sty: {
    type: Object as PropType<Partial<Sty>>,
    default: {},
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  selected: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <Box :sty="{ width: `1f`, ...sty }">
    <!-- Text -->
    <Box
      :sty="{
        width: `1f`,
        axis: $Axis.row,
        spacing: $Spacing.spaceBetween,
      }"
    >
      <Text>{{ selected }}</Text>
      <Icon icon="menuDown" />
    </Box>
    <!-- Underline -->
    <Box
      :sty="{
        width: `1f`,
        height: 0.25,
      }"
    >
      <Box
        :sty="{
          width: `1f`,
          height: 0.0625,
          background: mdColors.grey,
        }"
      />
    </Box>
  </Box>
</template>
