<script setup lang="ts">
import { PropType, computed } from "vue";
import {
  TANK_SHAPE_IDS,
  TankShapeId,
  getDimensionLabel,
  getTankShape,
} from "../calculators/ShapeUtils";
import { exists } from "@/utils";
import { Tank } from "@/AppData";
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
  diameter: {
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
  "update:diameter",
]);

const dimensions = computed(() => {
  const tankShape = getTankShape(props.shape);
  if (!exists(tankShape)) return [];
  return tankShape.dimensions;
});
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
    v-if="exists(shape) && dimensions.length > 0"
    :sty="{
      width: `1f`,
      padBetween: 1,
    }"
  >
    <Label
      v-if="dimensions.length > 0"
      :label="getDimensionLabel(dimensions[0])"
    >
      <NumField
        hint="--"
        :value="length"
        @update:value="emit(`update:${dimensions[0]}`, $event)"
        underlined
        :sty="{
          textColor:
            exists(length) && length > 0 ? $mdColors.black : $mdColors.grey,
        }"
      />
    </Label>
    <Box v-else :sty="{ width: `1f` }" />
    <Label
      v-if="dimensions.length > 1"
      :label="getDimensionLabel(dimensions[1])"
    >
      <NumField
        hint="--"
        :value="depth"
        @update:value="emit(`update:${dimensions[1]}`, $event)"
        underlined
        :sty="{
          textColor:
            exists(depth) && depth > 0 ? $mdColors.black : $mdColors.grey,
        }"
      />
    </Label>
    <Box v-else :sty="{ width: `1f` }" />
  </Row>
  <Row
    v-if="exists(shape) && dimensions.length > 2"
    :sty="{
      width: `1f`,
      padBetween: 1,
    }"
  >
    <Label
      v-if="dimensions.length > 2"
      :label="getDimensionLabel(dimensions[2])"
      ><NumField
        hint="--"
        :value="height"
        @update:value="emit(`update:${dimensions[2]}`, $event)"
        underlined
        :sty="{
          textColor:
            exists(height) && height > 0 ? $mdColors.black : $mdColors.grey,
        }"
    /></Label>
    <Box v-else :sty="{ width: `1f` }" />
    <Label
      v-if="dimensions.length > 3"
      :label="dimensions.length < 4 ? `` : getDimensionLabel(dimensions[3])"
      ><NumField
        hint="--"
        :value="shortHeight"
        @update:value="emit(`update:${dimensions[3]}`, $event)"
        underlined
        :sty="{
          textColor:
            exists(shortHeight) && shortHeight > 0
              ? $mdColors.black
              : $mdColors.grey,
        }"
    /></Label>
    <Box v-else :sty="{ width: `1f` }" />
  </Row>
</template>
