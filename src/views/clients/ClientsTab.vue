<script setup lang="ts">
import ClientEntry from "@/views/clients/ClientEntry.vue";
import { clientIsValid, getAppData } from "@/AppData";
import { ref } from "vue";
import { computed } from "@vue/reactivity";
import { exists } from "@/utils";

const appData = getAppData();

const filterString = ref("");
const filteredClients = computed(() => {
  const filtered = appData.clients.filter((client) => {
    if (filterString.value.length === 0) return true;
    if (!clientIsValid(client)) return false;
    return (
      (client.name?.toLowerCase().includes(filterString.value.toLowerCase()) ??
        false) ||
      (client.clientId
        ?.toLowerCase()
        .includes(filterString.value.toLowerCase()) ??
        false)
    );
  });
  return [...filtered].sort((a, b) => {
    if (!a.isLoaded || !exists(a.name)) {
      return 1;
    } else if (!b.isLoaded || !exists(b.name)) {
      return -1;
    } else {
      return a.name.localeCompare(b.name);
    }
  });
});
</script>

<template>
  <Column :sty="{ width: `1f`, height: `1f`, overflowY: $Overflow.crop }">
    <ClientActionBar v-model:filterString="filterString" />

    <Body>
      <Text v-if="filteredClients.length === 0" hint>No Clients</Text>
      <ClientEntry
        v-for="(client, index) in filteredClients"
        :key="index"
        :client="client"
      />
    </Body>
  </Column>
</template>
