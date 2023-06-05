<script setup lang="ts">
import { PropType, VNodeRef, defineProps, ref } from "vue";
import { pushPage } from "@/Nav";
import ClientPage from "./Client.page.vue";
import { Client } from "@/AppData";
import { Overflow, mdColors } from "@/miwi-md/Box.vue";
import DeleteDialog from "../components/DeleteDialog.vue";

// Create a prop called size
const props = defineProps({
  client: {
    type: Object as PropType<Client>,
    required: true,
  },
});

function deletePressed() {
  pushPage(DeleteDialog, {
    obj: props.client,
    message: `Are you sure you want to permanently delete "${
      props.client.clientId ?? ``
    } ${props.client.clientId && props.client.name ? ` - ` : ``} ${
      props.client.name ?? ``
    }"?`,
  });
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
      textColor: 
              ([undefined, null] as any[]).includes(client.name) ? mdColors.grey : mdColors.black,
      overflowY: Overflow.visible,
    }"
  >
    <Text>{{ client.name ?? `Loading...` }}</Text>
    <DeleteOptionsButton @delete="deletePressed" />
  </Row>
</template>
