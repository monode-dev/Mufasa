<script setup lang="ts">
import { PropType, defineProps } from "vue";
import { pushPage } from "@/Nav";
import ClientPage from "./Client.page.vue";
import { Client } from "@/Model";

// Create a prop called size
const props = defineProps({
  client: {
    type: Object as PropType<Client>,
    required: true,
  },
});
</script>

<template>
  <Box @click="pushPage(ClientPage)" :sty="{
    width: `1f`,
    spacing: $Spacing.spaceBetween,
    axis: $Axis.row,
  }">
    {{ client.name }}
    <Icon icon="dotsVertical" />
  </Box>
</template>
