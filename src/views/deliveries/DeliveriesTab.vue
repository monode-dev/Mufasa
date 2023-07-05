<script setup lang="ts">
import {
  UpcomingExistingDelivery,
  getAppData,
  listCompletedDeliveries,
  listUpcomingDeliveries,
} from "@/AppData";
import { pushPage } from "@/Nav";
import UpcomingDeliveryDialog from "./UpcomingDelivery.dialog.vue";
import { computed } from "vue";

const appData = getAppData();

const upcomiingDeliveries = computed(() =>
  listUpcomingDeliveries(appData.deliveries),
);
const completedDeliveries = computed(() =>
  listCompletedDeliveries(appData.deliveries),
);
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
          @click.stop="pushPage(UpcomingDeliveryDialog)"
        />
      </Box>
    </Row>
    <Text v-if="upcomiingDeliveries.length === 0" hint
      >No Upcoming Deliveries</Text
    >
    <UpcomingDeliveryEntry
      v-for="(delivery, index) in upcomiingDeliveries"
      :key="delivery._firestoreRef?.path ?? index"
      :delivery="(delivery as UpcomingExistingDelivery)"
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
