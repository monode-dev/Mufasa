<script setup lang="ts">
import {
  getAppData,
  FuelType,
  UpcomingDelivery,
  Client,
  Tank,
} from "@/AppData";
import { pushPage } from "@/Nav";
import { mdColors } from "@/miwi-md/Box.vue";
import { PropType, ref, watchEffect } from "vue";
import DeleteDialog from "../components/DeleteDialog.vue";
import { orderDocs } from "@/utils";

const props = defineProps({
  delivery: {
    type: Object as PropType<UpcomingDelivery>,
    required: true,
  },
});

const appData = getAppData();

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
        spacing: $Spacing.spaceBetween,
      }"
    >
      <DropDown
        v-model:selected="props.delivery.client"
        :getKeyFromData="(data: Client | null) => {
            return data?._firestoreRef?.path;
          }"
        :options="[
            { label: `No Client Selected`, data: undefined },
            ...orderDocs(appData.clients, (x) => x.name)
              .filter((x) => x.name !== `` && x.name !== null && x.name !== undefined)
              .map((x) => ({ label: x.name!, data: x })),
          ]"
      />
      <DeleteOptionsButton @delete="handleDelete" />
    </Row>
    <Row
      :sty="{
        width: `1f`,
        spacing: 0.25,
      }"
    >
      <Row
        :sty="{
          width: `1f`,
          spacing: 0.25,
        }"
      >
        <Field
          :sty="{ height: 1 }"
          v-model:value="props.delivery.amount"
          hint="Amount"
        />
        <Text :sty="{ height: 1 }">to:</Text>
      </Row>
      <!-- <Row
        :sty="{
          width: `1f`,
          spacing: 0.25,
        }"
      >
        <DropDown
          v-model:selected="props.delivery.fuelType"
          :getKeyFromData="(data: FuelType | null) => {
            return data?._firestoreRef?.path;
          }"
          :options="[
            { label: `Fuel`, data: undefined },
            ...appData.fuelTypes
              .filter((x) => x.name !== `` && x.name !== null && x.name !== undefined)
              .map((x) => ({ label: x.name!, data: x })),
          ]"
        />
        <Text :sty="{ height: 1 }">to:</Text>
      </Row> -->
      <Row
        :sty="{
          width: `1f`,
          align: $Align.centerLeft,
          spacing: 0.25,
        }"
      >
        <DropDown
          v-model:selected="props.delivery.tank"
          :getKeyFromData="(data: Tank | null) => {
            return data?._firestoreRef?.path;
          }"
          :options="[
            { label: `No Tank Selected`, data: undefined },
            ...orderDocs(
              props.delivery?.client?.tanks ?? [],
              (x) => x.creationTimePosix,
            ).map((x, index) => ({ label: `#${index}`, data: x })),
          ]"
        />
      </Row>
    </Row>
  </Card>
</template>
