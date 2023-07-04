<script setup lang="ts">
import { defineProps, PropType } from "vue";
import { mdColors } from "@/miwi-md/Box/BoxDecoration";

// Allow overriding of the default sty
const props = defineProps({
  sty: {
    type: Object as PropType<Partial<Sty>>,
    default: {},
  },
  label: {
    type: String,
    default: "Button",
  },
  icon: {
    type: String,
    default: "alert",
  },
});
</script>

<template>
  <Button
    outlined
    pill
    :sty="{
      background: mdColors.green,
      textColor: mdColors.white,
      padAroundY: 0.25,
      padAroundX: 0.5,
      padBetween: 0.125,
      ...sty,
    }"
  >
    {{ label }}
    <Icon :icon="icon" :color="mdColors.white" />
  </Button>
</template>
