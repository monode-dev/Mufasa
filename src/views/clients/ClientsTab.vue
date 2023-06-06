<script setup lang="ts">
import ClientEntry from "@/views/clients/ClientEntry.vue";
import { getAppData, Client } from "@/AppData";
import { ref } from "vue";
import { computed } from "@vue/reactivity";
import { exists } from "@/utils";

const appData = getAppData();

const filterString = ref("");
const filteredClients = computed(() =>
  appData.clients.filter((client) => {
    if (!client.name && !client.clientId) return false;
    if (filterString.value.length === 0) return true;
    return (
      (client.name?.toLowerCase().includes(filterString.value.toLowerCase()) ??
        false) ||
      (client.clientId?.toString().includes(filterString.value.toLowerCase()) ??
        false)
    );
  }),
);
</script>

<template>
  <Column :sty="{ width: `1f`, height: `1f` }">
    <ClientActionBar v-model:filterString="filterString" />

    <Body>
      <ClientEntry
        v-for="(client, index) in [...filteredClients].sort((a, b) => {
          //
          if (!a.isLoaded || !exists(a.name)) {
            return 1;
          } else if (!b.isLoaded || !exists(b.name)) {
            return -1;
          } else {
            return a.name.localeCompare(b.name);
          }
        })"
        :key="index"
        :client="client"
      />
    </Body>
  </Column>
</template>
