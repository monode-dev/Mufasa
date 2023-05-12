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
  label: {
    type: String,
    default: "",
  },
  selected: {
    type: String,
    default: "",
  },
  underlined: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <Row :sty="{ width: `1f`, spacing: 0.5, align: $Align.topCenter, ...sty }">
    <Text>{{ label }}:</Text>
    <Box :sty="{ width: `1f` }">
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
        v-if="underlined"
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
  </Row>
</template>
