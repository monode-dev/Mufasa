<script setup lang="ts">
import { defineProps, PropType, useSlots } from "vue";
import Box, { Align, mdColors, Axis, Sty } from "./Box.vue";
import { computed } from "vue";

// Allow overriding of the default sty
const props = defineProps({
  sty: {
    type: Object as PropType<Partial<Sty>>,
    default: {},
  },
  title: {
    type: String as PropType<string>,
    default: ``,
  },
  shouldLog: {
    type: Boolean,
    default: false,
  },
});

const slots = useSlots();
const contentSpacing = computed(() => props.sty.spacing ?? 1);
</script>

<template>
  <Box
    :sty="{
      background: mdColors.white,
      cornerRadius: 0.5,
      shadowSize: 1.5,
      shadowDirection: Align.bottomRight,
      axis: Axis.column,
      align: Align.center,
      textColor: mdColors.black,
      scale: 1,
      padding: 1,
      ...sty,
      spacing:
        title !== `` && typeof contentSpacing === `number`
          ? contentSpacing / 2.0
          : contentSpacing,
    }"
  >
    <template v-if="title !== ``">
      <Text title>{{ title }}</Text>
      <!-- <Box
        :sty="{
          axis: Axis.row,
        }"
      >
        <Text :sty="{ background: mdColors.green }">{{ title }}</Text>
        <Box
          :sty="{
            background: mdColors.red,
            height: 1,
            width: 1,
          }"
        />
      </Box> -->
      <Column
        v-if="slots.default"
        :sty="{
          spacing: contentSpacing,
        }"
        :shouldLog="shouldLog"
      >
        <slot />
      </Column>
    </template>
    <slot v-else />
  </Box>
</template>
