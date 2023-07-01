<script setup lang="ts">
import {
  getAppData,
  FuelType,
  UpcomingOneTimeDelivery,
  UpcomingExistingDelivery,
  Client,
  Tank,
  getClientLabel,
  getTankLabel,
} from "@/AppData";
import { pushPage } from "@/Nav";
import { mdColors } from "@/miwi-md/Box/BoxDecoration";
import { PropType, computed, ref, watchEffect } from "vue";
import DeleteDialog from "../components/DeleteDialog.vue";
import { orderDocs } from "@/utils";
import CompleteDeliveryDialog from "./CompleteDelivery.dialog.vue";
import UpcomingDeliveryDialog from "./UpcomingDelivery.dialog.vue";

const props = defineProps({
  delivery: {
    type: Object as PropType<UpcomingExistingDelivery>,
    required: true,
  },
});

const appData = getAppData();

function handleEdit() {
  pushPage(UpcomingDeliveryDialog, {
    dialogType: `edit`,
    delivery: props.delivery,
  });
}

function handleComplete() {
  pushPage(CompleteDeliveryDialog, {
    delivery: props.delivery,
  });
}

function handleDelete() {
  pushPage(DeleteDialog, {
    obj: props.delivery,
    message: `Are you sure you want to permanently delete this delivery?`,
  });
}

watchEffect(() => {
  // console.log(`${props.delivery?.client} changed.`);
  // console.log(
  //   `${props.delivery?.client?._firestoreRef?.path} has ${props.delivery?.client?.tanks?.length} tanks.`,
  // );
});
</script>

<template>
  <Card :sty="{ width: `1f` }">
    <Row
      :sty="{
        width: `1f`,
        spacing: 0.25,
      }"
    >
      <Text :sty="{ width: `1f` }">{{
        getClientLabel(props.delivery.upcomingExistingClient)
      }}</Text>
      <!-- <DeleteOptionsButton @delete="handleDelete" :shouldShowEdit="true" /> -->
      <DeleteOptionsButton
        @delete="handleDelete"
        shouldShowEdit
        shouldShowComplete
        @edit="handleEdit"
        @complete="handleComplete"
      />
    </Row>
    <Row :sty="{ width: `1f`, spacing: 0.25 }">
      <Row :sty="{ width: `2f`, spacing: 0.25 }">
        <Text :sty="{ width: `1f` }"
          >{{ props.delivery.quantity }} Gallons</Text
        >
        to</Row
      >
      <Text :sty="{ width: `3f` }">{{
        getTankLabel(props.delivery.upcomingExistingTank)
      }}</Text>
    </Row>
    <!-- <Row
      :sty="{
        width: `1f`,
        spacing: 0.25,
      }"
    >
      <Button outlined :sty="{ width: `1f`, textColor: $mdColors.grey }"
        >Edit</Button
      >
      <Button outlined :sty="{ width: `1f`, textColor: $mdColors.grey }"
        >Complete</Button
      >
    </Row> -->
  </Card>
</template>
