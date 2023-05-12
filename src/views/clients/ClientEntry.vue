<script setup lang="ts">
import { PropType, VNodeRef, defineProps, ref } from "vue";
import { pushPage } from "@/Nav";
import ClientPage from "./Client.page.vue";
import DeleteClientPage from "./DeleteClient.page.vue";
import { Client, LOADING } from "@/firebase";
import { Overflow, mdColors } from "@/miwi-md/Box.vue";

// Create a prop called size
const props = defineProps({
  client: {
    type: Object as PropType<Client>,
    required: true,
  },
});

function deletePressed() {
  pushPage(DeleteClientPage, { client: props.client });
}
</script>

<template>
  <Box
    :sty="{
      width: `1f`,
      height: 1,
      align: $Align.topRight,
    }"
  >
    <Box
      @click="pushPage(ClientPage, { client })"
      :sty="{
        width: `1f`,
        height: `100%`,
        spacing: $Spacing.spaceBetween,
        axis: $Axis.row,
        textColor: client.name === LOADING ? mdColors.grey : mdColors.black,
        overflowY: Overflow.visible,
      }"
    >
      {{ client.name ?? `Loading...` }}
      <DeleteOptionsButton @delete="deletePressed" />
    </Box>
  </Box>
</template>
