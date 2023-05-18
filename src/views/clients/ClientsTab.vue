<script setup lang="ts">
import ClientEntry from "@/views/clients/ClientEntry.vue";
import { LOADING, docProx, DELETED, useFirestore } from "@/firebase";

const model = useFirestore();
</script>

<template>
  <Column :sty="{ width: `1f`, height: `1f` }">
    <!-- <ClientSearchBar :filteredClients="model.clients" /> -->
    <ClientActionBar />

    <Body>
      <ClientEntry
        v-for="(client, index) in [...model.clients].sort((a, b) => {
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
      ></ClientEntry>
    </Body>
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
  </Column>
</template>
