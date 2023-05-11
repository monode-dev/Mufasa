<script setup lang="ts">
import ClientEntry from "@/views/clients/ClientEntry.vue";
import { docProx, isLoaded, useFirestore } from "@/firebase";

const model = useFirestore();
</script>

<template>
  <Column :sty="{ width: `1f`, height: `1f` }">
    <ClientSearchBar :filteredClients="model.clients" />

    <Body>
      <ClientEntry
        v-for="(client, index) in [...model.clients].sort((a, b) => {
          //
          if (!isLoaded(a.name)) {
            return 1;
          } else if (!isLoaded(b.name)) {
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
