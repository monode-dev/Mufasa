<script setup lang="ts">
import {
  FuelType,
  Tank,
  getAppData,
  getTankLabel,
  tankIsValid,
} from "@/AppData";
import { pushPage } from "@/Nav";
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
    <Row
      :sty="{
        width: `1f`,
        align: $Align.spaceBetween,
      }"
    >
      <!-- Hint should be toggled when the tank is complete -->
      <Text
        :hint="!tankIsValid(tank)"
        :sty="{
          width: `1f`,
          overflowX: $Overflow.crop,
        }"
      >
        {{ getTankLabel(tank) }}
      </Text>

      <DeleteOptionsButton @delete="deletePressed" />
    </Row>
    <DropDown
      label="Fuel"
      v-model:selected="tank.fuelType"
      :getKeyFromData="(data: FuelType | null) => {
        return data?._firestoreRef?.path;
      }"
      :options="[
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
    <Field
      v-model:value="tank.optionalLabel"
      hint="Optional Label"
      icon="label"
      underlined
    />
  </Card>
</template>
