<script setup lang="ts">
import {
  getAppData,
  Client,
  Tank,
  tankShape,
  getTankShapeName,
} from "@/AppData";
import { ref } from "vue";
import { pushPage } from "@/Nav";
import CreateDeliveryDialog from "./CreateDelivery.dialog.vue";
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
    <Row :sty="{ width: `1f`, spacing: $Spacing.spaceBetween }">
      <Box :sty="{ width: 1.75 }" />
      <Text title>Upcoming Deliveries</Text>
      <Box :sty="{ width: 1.75, align: $Align.centerLeft }">
        <Icon
          icon="plus"
          :scale="1.25"
          @click.stop="pushPage(CreateDeliveryDialog)"
        />
      </Box>
    </Row>
    <UpcomingDeliveryEntry :isAuto="true" />
    <UpcomingDeliveryEntry :isAuto="true" />
    <UpcomingDeliveryEntry :isAuto="false" />
    <Box />
    <Text title>Completed Deliveries</Text>
    <CompletedDeliveryEntry />
    <CompletedDeliveryEntry />
    <CompletedDeliveryEntry />
    <CompletedDeliveryEntry />
    <CompletedDeliveryEntry />
    <CompletedDeliveryEntry />
  </Body>
</template>
