<script setup lang="ts">
import { PropType } from "vue";
import {
  TANK_SHAPE_IDS,
  TankShapeId,
  getTankShape,
} from "../calculators/ShapeUtils";
import { exists } from "@/utils";
const props = defineProps({
  shape: {
    type: [String, null, undefined] as PropType<TankShapeId | null | undefined>,
    required: true,
  },
  length: {
    type: [Number, null, undefined] as PropType<number | null | undefined>,
    required: true,
  },
  depth: {
    type: [Number, null, undefined] as PropType<number | null | undefined>,
    required: true,
  },
  height: {
    type: [Number, null, undefined] as PropType<number | null | undefined>,
    required: true,
  },
  shortHeight: {
    type: [Number, null, undefined] as PropType<number | null | undefined>,
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
    v-if="exists(shape)"
    :sty="{
      width: `1f`,
      spacing: 1,
    }"
  >
    <Label label="Length">
      <NumField
        hint="0"
        :value="length"
        @update:value="emit(`update:length`, $event)"
        underlined
        :sty="{
          textColor:
            exists(length) && length > 0 ? $mdColors.black : $mdColors.grey,
        }"
      />
    </Label>
    <Label label="Depth">
      <NumField
        hint="0"
        :value="depth"
        @update:value="emit(`update:depth`, $event)"
        underlined
        :sty="{
          textColor:
            exists(depth) && depth > 0 ? $mdColors.black : $mdColors.grey,
        }"
      />
    </Label>
  </Row>
  <Row
    v-if="exists(shape)"
    :sty="{
      width: `1f`,
      spacing: 1,
    }"
  >
    <Label label="Height"
      ><NumField
        hint="0"
        :value="height"
        @update:value="emit(`update:height`, $event)"
        underlined
        :sty="{
          textColor:
            exists(height) && height > 0 ? $mdColors.black : $mdColors.grey,
        }"
    /></Label>
    <Label label="Short Height"
      ><NumField
        hint="0"
        :value="shortHeight"
        @update:value="emit(`update:shortHeight`, $event)"
        underlined
        :sty="{
          textColor:
            exists(shortHeight) && shortHeight > 0
              ? $mdColors.black
              : $mdColors.grey,
        }"
    /></Label>
  </Row>
</template>
