<script setup lang="ts">
import {
  getAppData,
  Client,
  Tank,
  getTankLabel,
  getClientLabel,
  listClients,
  listTanks,
  isClientValid,
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
  const clientPath = props.client?._id;
  const tankParentPath = props.tank?.mx_parent?._id;
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
                return data?._id ?? undefined;
            }"
      :options="
        listClients(appData.clients, true).map((x) => ({
          label: getClientLabel(x),
          data: x,
        }))
      "
      :filterOptions="(filterString: string, options: any) => {
        if (filterString.length === 0) return true;
        if (!isClientValid(options.data)) return false;
        return (
          (options.data.name?.toLowerCase().includes(filterString.toLowerCase()) ??
            false) ||
          (options.data.clientId
            ?.toLowerCase()
            .includes(filterString.toLowerCase()) ??
            false)
        );
      }"
  /></Label>
  <Label label="Tank" v-if="exists(client)">
    <DropDown
      :selected="tank"
      @update:selected="emit('update:tank', $event)"
      :getKeyFromData="(data: Tank | null) => {
                return data?._id ?? undefined;
            }"
      :options="listTanks((client as Client | undefined)?.tanks, true).map(
                (x, index) => ({ label: getTankLabel(x), data: x }),
              )"
  /></Label>
</template>
