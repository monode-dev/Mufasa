<script setup lang="ts">
import { defineProps, PropType, useSlots } from "vue";
import { Sty } from "./Box/Box.vue";
import { mdColors } from "./Box/BoxDecoration";
import { Align, Axis } from "./Box/BoxLayout";
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
      <!-- :sty="{ background: mdColors.green, textColor: mdColors.white }" -->
      <Column
        v-if="slots.default"
        :sty="{
          spacing: contentSpacing,
        }"
      >
        <slot />
      </Column>
    </template>
    <slot v-else />
  </Box>
</template>
