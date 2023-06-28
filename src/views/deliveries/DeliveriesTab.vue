<script setup lang="ts">
import { getAppData, listUpcomingDeliveries } from "@/AppData";
import { pushPage } from "@/Nav";
import CreateDeliveryDialog from "./CreateDelivery.dialog.vue";

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
          @click.stop="pushPage(CreateDeliveryDialog)"
        />
      </Box>
    </Row>

    <UpcomingDeliveryEntry
      v-for="(delivery, index) in listUpcomingDeliveries(appData.deliveries)"
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
