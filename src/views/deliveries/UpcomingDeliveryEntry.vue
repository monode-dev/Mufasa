<script setup lang="ts">
import { getAppData, FuelType, UpcomingDelivery } from "@/AppData";
import { mdColors } from "@/miwi-md/Box.vue";
import { PropType, ref } from "vue";

const props = defineProps({
  delivery: {
    type: Object as PropType<UpcomingDelivery>,
    required: true,
  },
});

const appData = getAppData();
</script>

<template>
  <Card :sty="{ width: `1f` }">
    <Row
      :sty="{
        width: `1f`,
        spacing: $Spacing.spaceBetween,
      }"
    >
      <Field v-model:value="props.delivery.clientName" hint="Client Name" />
      <DeleteOptionsButton />
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
        <Text :sty="{ height: 1 }">of:</Text>
      </Row>
      <Row
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
      </Row>
      <Row
        :sty="{
          width: `1f`,
          align: $Align.centerLeft,
          spacing: 0.25,
        }"
      >
        <Field v-model:value="props.delivery.tankName" hint="Tank" />
      </Row>
    </Row>
  </Card>
</template>
