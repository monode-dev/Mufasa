<script setup lang="ts">
import {
  getAppData,
  listCompletedDeliveries,
  listUpcomingDeliveries,
} from "@/AppData";
import { pushPage } from "@/Nav";
import UpcomingDeliveryDialog from "./UpcomingDelivery.dialog.vue";
import { computed } from "vue";

const appData = getAppData();

const upcomingDeliveries = computed(() =>
  listUpcomingDeliveries(appData.deliveries),
);
const completedDeliveries = computed(() => {
  const result = listCompletedDeliveries(appData.deliveries);
  return result.slice(0, 10);
});
</script>

<template>
  <Body>
    <!-- Upcoming Delvieries -->
    <Row :sty="{ width: `1f`, align: $Align.spaceBetween }">
      <Box :sty="{ width: 1.75 }" />
      <Text title>Upcoming Deliveries</Text>
      <Box :sty="{ width: 1.75, align: $Align.centerLeft }">
        <Icon
          icon="plus"
          :scale="1.25"
          :onClick="() => pushPage(UpcomingDeliveryDialog)"
        />
      </Box>
    </Row>
    <Text v-if="upcomingDeliveries.length === 0" hint
      >No Upcoming Deliveries</Text
    >
    <UpcomingDeliveryEntry
      v-for="(delivery, index) in upcomingDeliveries"
      :key="delivery._firestoreRef?.path ?? index"
      :delivery="delivery"
    />

    <!-- Competed Deliveries -->
    <Box />
    <Text title>Completed Deliveries</Text>
    <Text v-if="completedDeliveries.length === 0" hint
      >No Completed Deliveries</Text
    >
    <CompletedDeliveryEntry
      v-for="(delivery, index) in completedDeliveries"
      :key="delivery._firestoreRef?.path ?? index"
      :delivery="delivery"
    />
  </Body>
</template>
