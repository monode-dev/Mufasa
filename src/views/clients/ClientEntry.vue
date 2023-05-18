<script setup lang="ts">
import { PropType, VNodeRef, defineProps, ref } from "vue";
import { pushPage } from "@/Nav";
import ClientPage from "./Client.page.vue";
import DeleteClientPage from "./DeleteClient.dialog.vue";
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

function clicked() {
  pushPage(ClientPage, { client: props.client });
}
</script>

<template>
  <Row
    @click.stop="clicked"
    :sty="{
      width: `1f`,
      height: 1,
      spacing: $Spacing.spaceBetween,
      textColor: client.name === LOADING ? mdColors.grey : mdColors.black,
      overflowY: Overflow.visible,
    }"
  >
    <Text>{{ client.name ?? `Loading...` }}</Text>
    <DeleteOptionsButton @delete="deletePressed" />
  </Row>
</template>
