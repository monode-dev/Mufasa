<script setup lang="ts">
import {
  UpcomingExistingDelivery,
  getAppData,
  listCompletedDeliveries,
  listUpcomingDeliveries,
} from "@/AppData";
import { pushPage } from "@/Nav";
import UpcomingDeliveryDialog from "./UpcomingDelivery.dialog.vue";

const appData = getAppData();
</script>

<template>
  <Body>
    <!-- <Row
      :sty="{
        width: `1f`,
        align: $Align.centerLeft,
      }"
    >
      <Box
        :sty="{
          width: `1f`, //18
          height: 1,
          background: $mdColors.orange,
          align: $Align.centerLeft,
          overflowX: $Overflow.crop,
        }"
      >
        <Text
          :sty="{
            overflowX: $Overflow.crop,
          }"
          >asfdasdgjfasdfasfdasdffasdfasdfasdfjkljsdfkjaskdfjaskdjfkadjsfkljadskfjkasjdfklajsdfkjasdkfjasdkf</Text
        >
      </Box>
      <Box :sty="{ width: `1f`, height: 1, background: $mdColors.blue }" />
    </Row> -->

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
    <UpcomingDeliveryEntry
      v-for="(delivery, index) in listUpcomingDeliveries(appData.deliveries)"
      :key="delivery._firestoreRef?.path ?? index"
      :delivery="(delivery as UpcomingExistingDelivery)"
    />

    <!-- Competed Deliveries -->
    <Box />
    <Text title>Completed Deliveries</Text>
    <CompletedDeliveryEntry
      v-for="(delivery, index) in listCompletedDeliveries(appData.deliveries)"
      :key="delivery._firestoreRef?.path ?? index"
      :delivery="delivery"
    />
  </Body>
</template>
