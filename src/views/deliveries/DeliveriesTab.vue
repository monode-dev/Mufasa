<script setup lang="ts">
import {
  getAppData,
  Client,
  Tank,
  tankShape,
  getTankShapeName,
} from "@/AppData";
import { ref } from "vue";
// import { exists } from "@/utils";

// const appData = getAppData();
const isLookUp = ref(true);

// Look Up
const client = ref<Client | null>(null);
const tank = ref<Tank | null>(null);

// Use Dimensions
const dimTankShape = ref(tankShape.none);
const dimLength = ref(0);
const dimDepth = ref(0);
const dimHeight = ref(0);
const dimShortHeight = ref(0);
</script>

<template>
  <Body>
    <Text title>Upcoming Deliveries</Text>
    <Text hint>Incomplete deliveries will go here.</Text>
    <Box />
    <Text title>Completed Deliveries</Text>
    <Text hint>Completed deliveries will go here.</Text>
  </Body>
</template>
