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
import { exists } from "@/utils";

const appData = getAppData();
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
          @click.stop="appData.upcomingDeliveries?.add({})"
        />
      </Box>
    </Row>

    <UpcomingDeliveryEntry
      v-for="(delivery, index) in [...(appData.upcomingDeliveries ?? [])].sort(
        (a, b) => {
          if (!a.isLoaded || !exists(a.creationTimePosix)) {
            return 1;
          } else if (!b.isLoaded || !exists(b.creationTimePosix)) {
            return -1;
          } else {
            return a.creationTimePosix - b.creationTimePosix;
          }
        },
      )"
      :key="delivery._firestoreRef?.path ?? index"
      :delivery="delivery"
    />
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
