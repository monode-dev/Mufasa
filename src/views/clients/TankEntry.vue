<script setup lang="ts">
import { ref, watchEffect } from "vue";
import {
  FuelType,
  Tank,
  getAppData,
  tankShape,
  getTankShapeName,
} from "@/AppData";
import { popPage, pushPage } from "@/Nav";
import DeleteDialogVue from "../components/DeleteDialog.vue";
const appData = getAppData();

const props = defineProps({
  tank: {
    type: Object as () => Tank,
    required: true,
  },
});

function deletePressed() {
  pushPage(DeleteDialogVue, {
    obj: props.tank,
    message: `Are you sure you want to permanently delete this tank? Associated delvieries will NOT be deleted.`,
  });
}
</script>

<template>
  <Card :sty="{ width: `1f` }">
    <Box
      :sty="{
        width: `1f`,
        spacing: $Spacing.spaceBetween,
        axis: $Axis.row,
      }"
    >
      <Text>#<slot /></Text>

      <DeleteOptionsButton @delete="deletePressed" />
    </Box>
    <DropDown
      label="Fuel"
      v-model:selected="tank.fuelType"
      :getKeyFromData="(data: FuelType | null) => {
        return data?._firestoreRef?.path;
      }"
      :options="[
        { label: `None`, data: undefined },
        ...appData.fuelTypes
          .filter((x) => x.name !== `` && x.name !== null && x.name !== undefined)
          .map((x) => ({ label: x.name!, data: x })),
      ]"
    />
    <TankFields
      v-model:shape="tank.shape"
      v-model:length="tank.length"
      v-model:depth="tank.depth"
      v-model:height="tank.height"
      v-model:shortHeight="tank.shortHeight"
    />
  </Card>
</template>
