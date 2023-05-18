<script setup lang="ts">
import { defineProps, PropType } from "vue";
import { Sty } from "@/miwi-md/Box.vue";
import { mdColors } from "@/miwi-md/Box.vue";

// Allow overriding of the default sty
const props = defineProps({
  sty: {
    type: Object as PropType<Partial<Sty>>,
    default: {},
  },
});
</script>

<template>
  <Row
    :sty="{
      width: `1f`,
      background: mdColors.green,
      padding: `0.5 0`,
      shadowSize: 1.25,
      shadowDirection: $Align.bottomCenter,
      spacing: $Spacing.spaceEvenly,
      ...sty,
    }"
  >
    <OutlinedActionButton label="New" icon="plus" />
    <OutlinedActionButton label="Search" icon="magnify" />
    <OutlinedActionButton label="Import" icon="import" />
    <OutlinedActionButton label="Export" icon="export" />
  </Row>
</template>
