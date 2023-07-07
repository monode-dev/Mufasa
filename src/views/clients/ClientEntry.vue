<script setup lang="ts">
import { PropType, VNodeRef, defineProps, ref } from "vue";
import { pushPage } from "@/Nav";
import ClientPage from "./Client.page.vue";
import { Client, isClientValid, getClientLabel } from "@/AppData";
import { mdColors } from "@/miwi-md/Box/BoxDecoration";
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
      align: $Align.spaceBetween,
      textColor: client.isLoaded ? mdColors.black : mdColors.grey,
    }"
  >
    <Text
      :sty="{
        width: `1f`,
        overflowX: $Overflow.crop,
        textColor: isClientValid(client) ? mdColors.black : mdColors.grey,
      }"
    >
      {{ client.isLoaded ? getClientLabel(client) : `Loading...` }}
    </Text>
    <DeleteOptionsButton @delete="deletePressed" />
  </Row>
</template>
