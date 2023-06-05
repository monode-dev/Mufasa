<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { FuelType, Tank, getAppData } from "@/AppData";
import { popPage } from "@/Nav";
const appData = getAppData();

const props = defineProps({
  tank: {
    type: Object as () => Tank,
    required: true,
  },
});

watchEffect(() => {
  if (props.tank.isDeleted) {
    popPage();
  }
});
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

      <DeleteOptionsButton />
    </Box>
    <DropDown
      label="Fuel"
      v-model:selected="tank.fuelType"
      :getKeyFromData="(data: FuelType | null) => {
        return data?._firestoreRef?.path;
      }"
      :options="[
        { label: `None`, data: null },
        ...appData.fuelTypes
          .filter((x) => x.name !== `` && x.name !== null && x.name !== undefined)
          .map((x) => ({ label: x.name!, data: x })),
      ]"
    />
    <!-- <DropDown label="Shape" selected="Horizontal Cylinder" /> -->
    <Row
      :sty="{
        width: `1f`,
      }"
    >
      <Label label="Length"><Field v-model:value="tank.length" /></Label>
      <Label label="Depth"><Field v-model:value="tank.depth" /></Label>
    </Row>
    <Row
      :sty="{
        width: `1f`,
      }"
    >
      <Label label="Height"><Field v-model:value="tank.height" /></Label>
      <Label label="Short Height"
        ><Field v-model:value="tank.shortHeight"
      /></Label>
    </Row>
  </Card>
</template>
