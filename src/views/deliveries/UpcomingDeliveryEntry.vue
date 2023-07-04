<script setup lang="ts">
import {
  getAppData,
  UpcomingExistingDelivery,
  getClientLabel,
  getTankLabel,
} from "@/AppData";
import { pushPage } from "@/Nav";
import { PropType } from "vue";
import DeleteDialog from "../components/DeleteDialog.vue";
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
</script>

<template>
  <Card :sty="{ width: `1f` }">
    <Row
      :sty="{
        width: `1f`,
        padBetween: 0.25,
      }"
    >
      <TruncatedText
        :sty="{ width: `1f` }"
        :text="getClientLabel(props.delivery.upcomingExistingClient)"
        :maxChars="35"
      />
      <DeleteOptionsButton
        @delete="handleDelete"
        shouldShowEdit
        shouldShowComplete
        @edit="handleEdit"
        @complete="handleComplete"
      />
    </Row>
    <Row :sty="{ width: `1f`, padBetween: 0.25 }">
      <Row :sty="{ width: `2f`, padBetween: 0.25 }">
        <Text :sty="{ width: `1f` }"
          >{{ props.delivery.quantity }} Gallons</Text
        >
        to</Row
      >
      <TruncatedText
        :sty="{ width: `3f` }"
        :text="getTankLabel(props.delivery.upcomingExistingTank)"
        :maxChars="23"
      />
    </Row>
  </Card>
</template>
