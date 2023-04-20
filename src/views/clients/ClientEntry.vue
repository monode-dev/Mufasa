<script setup lang="ts">
import { defineProps } from "vue";
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
  <Box :onclick="() => pushPage(ClientPage)" :sty="{
      width: `1f`,
      spacing: $Spacing.spaceBetween,
      axis: $Axis.row,
    }">
    {{ props.name }}
    <Icon icon="dotsVertical" />
  </Box>
</template>
