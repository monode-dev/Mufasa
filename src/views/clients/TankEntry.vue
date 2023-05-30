<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { FuelType, Tank, getAppData } from "@/AppData";
const appData = getAppData();

const props = defineProps({
  tank: {
    type: Object as () => Tank,
    required: true,
  },
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
      :options="[
        { label: `None`, doc: null },
        ...appData.fuelTypes
          .filter((x) => x.name !== ``)
          .map((x) => {
            return { label: x.name, doc: x };
          }),
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
      <Label label="Short Height"><Field v-model:value="tank.shortHeight" /></Label>
    </Row>
  </Card>
</template>
