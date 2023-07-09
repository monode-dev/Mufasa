<script setup lang="ts">
import {
  FuelType,
  Tank,
  getAppData,
  getTankLabel,
  isTankValid,
} from "@/AppData";
import { pushPage } from "@/Nav";
import DeleteDialogVue from "@/views/components/DeleteDialog.vue";
import { PropType } from "vue";
const appData = getAppData();

const props = defineProps({
  tank: {
    type: Object as PropType<Tank>,
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
        :hint="!isTankValid(tank)"
        :sty="{
          width: `1f`,
          overflowX: $Overflow.crop,
        }"
      >
        {{ getTankLabel(tank) }}
      </Text>

      <DeleteOptionsButton @delete="deletePressed" />
    </Row>
    <FuelTypeDropDown v-model:fuel-type="tank.fuelType" />
    <TankFields
      v-model:shape="tank.shape"
      v-model:length="tank.length"
      v-model:depth="tank.depth"
      v-model:topDepth="tank.shortDepth"
      v-model:fullDepth="tank.fullDepth"
      v-model:height="tank.height"
      v-model:wideHeight="tank.shortHeight"
      v-model:fullHeight="tank.fullHeight"
      v-model:diameter="tank.diameter"
    />
    <Field
      v-model:value="tank.optionalLabel"
      hint="Optional Label"
      icon="label"
      underlined
    />
  </Card>
</template>
