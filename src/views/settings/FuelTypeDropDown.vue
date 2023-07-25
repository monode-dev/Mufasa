<script setup lang="ts">
import { FuelType, getAppData, listFuelTypes } from "@/AppData";
import { PropType } from "vue";
const appData = getAppData();

const props = defineProps({
  fuelType: {
    type: [Object, null, undefined] as PropType<FuelType | null | undefined>,
    required: true,
  },
});

const emit = defineEmits(["update:fuelType"]);
</script>

<template>
  <DropDown
    label="Fuel"
    :selected="fuelType"
    @update:selected="emit(`update:fuelType`, $event)"
    :getKeyFromData="(data: FuelType | null) => {
      return data?._id ?? undefined;
    }"
    :options="listFuelTypes(appData.fuelTypes, true).map((x) => ({ label: x.name!, data: x }))"
  />
</template>
