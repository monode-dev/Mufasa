<script setup lang="ts">
import { PropType, defineProps } from "vue";
import { pushPage } from "@/Nav";
import ClientPage from "./Client.page.vue";
import { Client, LOADING } from "@/firebase";
import { mdColors } from "@/miwi-md/Box.vue";

// Create a prop called size
const props = defineProps({
  client: {
    type: Object as PropType<Client>,
    required: true,
  },
});
</script>

<template>
  <Box
    @click="pushPage(ClientPage, { client })"
    :sty="{
      width: `1f`,
      spacing: $Spacing.spaceBetween,
      axis: $Axis.row,
      textColor: client.name === LOADING ? mdColors.grey : mdColors.black,
    }"
  >
    {{ client.name ?? `Loading...` }}
    <Icon icon="dotsVertical" />
  </Box>
</template>
