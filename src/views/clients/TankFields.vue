<script setup lang="ts">
import { PropType } from "vue";
import {
  TANK_SHAPE_IDS,
  TankShapeId,
  getTankShape,
} from "../calculators/ShapeUtils";
const props = defineProps({
  shape: {
    type: [String, null, undefined] as PropType<TankShapeId | null | undefined>,
    required: true,
  },
  length: {
    type: Number as PropType<number | null | undefined>,
    required: true,
  },
  depth: {
    type: Number as PropType<number | null | undefined>,
    required: true,
  },
  height: {
    type: Number as PropType<number | null | undefined>,
    required: true,
  },
  shortHeight: {
    type: Number as PropType<number | null | undefined>,
    required: true,
  },
});

const emit = defineEmits([
  "update:shape",
  "update:length",
  "update:depth",
  "update:height",
  "update:shortHeight",
]);
</script>

<template>
  <DropDown
    label="Shape"
    :selected="shape"
    @update:selected="emit(`update:shape`, $event)"
    :getKeyFromData="(data: any) => data"
    :options="[
      ...TANK_SHAPE_IDS.map((x) => ({
        label: getTankShape(x).nameLong,
        data: x,
      })),
    ]"
  />
  <Row
    :sty="{
      width: `1f`,
    }"
  >
    <Label label="Length">
      <NumField
        hint="0"
        :value="length"
        @update:value="emit(`update:length`, $event)"
      />
    </Label>
    <Label label="Depth">
      <NumField
        hint="0"
        :value="depth"
        @update:value="emit(`update:depth`, $event)"
      />
    </Label>
  </Row>
  <Row
    :sty="{
      width: `1f`,
    }"
  >
    <Label label="Height"
      ><NumField
        hint="0"
        :value="height"
        @update:value="emit(`update:height`, $event)"
    /></Label>
    <Label label="Short Height"
      ><NumField
        hint="0"
        :value="shortHeight"
        @update:value="emit(`update:shortHeight`, $event)"
    /></Label>
  </Row>
</template>
