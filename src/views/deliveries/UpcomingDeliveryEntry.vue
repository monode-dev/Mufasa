<script setup lang="ts">
import { getAppData, getClientLabel, getTankLabel, Delivery } from "@/AppData";
import { pushPage } from "@/Nav";
import { PropType, computed, watchEffect } from "vue";
import DeleteDialog from "../components/DeleteDialog.vue";
import CompleteDeliveryDialog from "./CompleteDelivery.dialog.vue";
import UpcomingDeliveryDialog from "./UpcomingDelivery.dialog.vue";

const props = defineProps({
  delivery: {
    type: Object as PropType<Delivery>,
    required: true,
  },
});

const appData = getAppData();

const isExistingDelivery = computed(
  () => props.delivery.deliveryFormat === `upcomingFromExisting`,
);
const deliveryLabel = computed(() =>
  isExistingDelivery.value
    ? getClientLabel(props.delivery.upcomingExistingClient)
    : props.delivery.deliveryLabel,
);

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
</script>

<template>
  <Card :sty="{ width: `1f` }">
    <Row
      :sty="{
        width: `1f`,
        padBetween: 0.25,
      }"
    >
      <Text
        :sty="{
          width: `1f`,
          overflowX: $Overflow.crop,
        }"
      >
        {{ deliveryLabel }}
      </Text>
      <DeleteOptionsButton
        @delete="handleDelete"
        shouldShowEdit
        shouldShowComplete
        @edit="handleEdit"
        @complete="handleComplete"
      />
    </Row>
    <Row :sty="{ width: `1f`, padBetween: 0.25 }">
      <Row :sty="{ width: isExistingDelivery ? `2f` : `1f`, padBetween: 0.25 }">
        <Text :sty="{ width: `1f` }">{{ props.delivery.quantity }} Gallons</Text
        >{{ isExistingDelivery ? `to` : `of` }}</Row
      >
      <Text
        :sty="{
          width: isExistingDelivery ? `3f` : `1f`,
          overflowX: $Overflow.crop,
        }"
      >
        {{
          isExistingDelivery
            ? getTankLabel(props.delivery.upcomingExistingTank)
            : props.delivery.upcomingOneTimeFuelType?.name ?? `Unknown Fuel`
        }}
      </Text>
    </Row>
  </Card>
</template>
