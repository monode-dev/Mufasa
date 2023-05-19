<script setup lang="ts">
import ClientEntry from "@/views/clients/ClientEntry.vue";
import { LOADING, docProx, DELETED, useFirestore, Client } from "@/firebase";
import { ref } from "vue";
import { computed } from "@vue/reactivity";

const model = useFirestore();

const filterString = ref("");
const filteredClients = computed(() =>
  model.clients.filter((client) => {
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

let clientNums: number[] = [];
for (let i = 1; i <= 50; i++) {
  clientNums.push(i);
}
</script>

<template>
  <Column :sty="{ width: `1f`, height: `1f` }">
    <ClientActionBar v-model:filterString="filterString" />

    <Body>
      <ClientEntry
        v-for="(client, index) in [...filteredClients].sort((a, b) => {
          //
          if (!a.isLoaded || a.name === LOADING || a.name === DELETED) {
            return 1;
          } else if (!b.isLoaded || b.name === LOADING || b.name === DELETED) {
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

<!-- <Stack :sty="{
        width: `1f`,
        height: `1f`,
      }">

        <Body>
          <ClientEntry v-for="name in clientNames" :name="name"></ClientEntry>
        </Body>
        <Box :sty="{
          width: `1f`,
          height: `1f`,
          align: Align.bottomRight,
          padding: 0.5,
        }">
          <Button raised round :sty="{ width: 2, height: 2, scale: 1.5 }">
            <Icon :size="1.5" :icon="addSvg" alt="Add Icon" />
          </Button>
        </Box>
      </Stack> -->
