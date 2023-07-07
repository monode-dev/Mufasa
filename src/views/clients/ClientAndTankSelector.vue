<script setup lang="ts">
import {
  getAppData,
  Client,
  Tank,
  getTankLabel,
  getClientLabel,
  isTankValid,
  listClients,
  listTanks,
} from "@/AppData";
import { PropType, ref, watchEffect } from "vue";
import { exists, orderDocs } from "@/utils";

const props = defineProps({
  client: {
    type: Object as PropType<Client | null>,
    default: null,
  },
  tank: {
    type: Object as PropType<Tank | null>,
    default: null,
  },
});
const emit = defineEmits<{
  (event: "update:client", newValue: Client | null): void;
  (event: "update:tank", newValue: Tank | null): void;
}>();

const appData = getAppData();

watchEffect(() => {
  const clientPath = props.client?._firestoreRef?.path;
  const tankParentPath = props.tank?.mx_parent?._firestoreRef?.path;
  if (exists(tankParentPath) && tankParentPath !== clientPath) {
    emit("update:tank", null);
  }
});
</script>

<template>
  <Label label="Client">
    <DropDown
      :selected="client"
      @update:selected="emit('update:client', $event)"
      :getKeyFromData="(data: Client | null) => {
                return data?._firestoreRef?.path;
            }"
      :options="
        listClients(appData.clients, true).map((x) => ({
          label: getClientLabel(x),
          data: x,
        }))
      "
  /></Label>
  <Label label="Tank" v-if="exists(client)">
    <DropDown
      :selected="tank"
      @update:selected="emit('update:tank', $event)"
      :getKeyFromData="(data: Tank | null) => {
                return data?._firestoreRef?.path;
            }"
      :options="listTanks((client as Client | undefined)?.tanks, true).map(
                (x, index) => ({ label: getTankLabel(x), data: x }),
              )"
  /></Label>
</template>
