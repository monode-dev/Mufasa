<script setup lang="ts">
import { defineProps, PropType } from "vue";
import { FlexSize, mdColors, Axis, Spacing } from "@/views/miwi-vue/B.vue";
import optionsSvg from "@/assets/more_vert_FILL1_wght400_GRAD0_opsz48.svg";
import { pushPage } from "@/Nav";
import ClientPage from "./Client.page.vue";

// Create a prop called size
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <B
    :onclick="() => pushPage(ClientPage)"
    :sty="{
      width: `1f`,
      spacing: Spacing.spaceBetween,
      axis: Axis.row,
    }"
  >
    {{ props.name }}
    <Icon :icon="optionsSvg" alt="Options" />
  </B>
</template>
