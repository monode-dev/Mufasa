<script setup lang="ts">
import { PropType, computed } from "vue";
import {
  TANK_SHAPE_IDS,
  TankShapeId,
  getDimensionLabel,
  getTankShape,
} from "@/views/tanks/ShapeUtils";
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
  shortDepth: {
    type: [Number, null, undefined] as PropType<number | null | undefined>,
    required: true,
  },
  fullDepth: {
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
  fullHeight: {
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
  "update:shortDepth",
  "update:fullDepth",
  "update:height",
  "update:shortHeight",
  "update:fullHeight",
  "update:diameter",
]);

const dimensions = computed(() => {
  const tankShape = getTankShape(props.shape);
  if (!exists(tankShape)) return [];
  return tankShape.dimensions;
});

const dimensionHintText = `in.`;
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
        :negativesAreAllowed="false"
        :hint="dimensionHintText"
        :value="props[dimensions[0]]"
        @update:value="emit(`update:${dimensions[0]}`, $event)"
        underlined
        :sty="{
          textColor:
            exists(props[dimensions[0]]) && props[dimensions[0]]! > 0 ? $mdColors.black : $mdColors.grey,
        }"
      />
    </Label>
    <Box v-else :sty="{ width: `1f` }" />
    <Label
      v-if="dimensions.length > 1"
      :label="getDimensionLabel(dimensions[1])"
    >
      <NumField
        :negativesAreAllowed="false"
        :hint="dimensionHintText"
        :value="props[dimensions[1]]"
        @update:value="emit(`update:${dimensions[1]}`, $event)"
        underlined
        :sty="{
          textColor:
            exists(props[dimensions[1]]) && props[dimensions[1]]! > 0 ? $mdColors.black : $mdColors.grey,
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
        :negativesAreAllowed="false"
        :hint="dimensionHintText"
        :value="props[dimensions[2]]"
        @update:value="emit(`update:${dimensions[2]}`, $event)"
        underlined
        :sty="{
          textColor:
            exists(props[dimensions[2]]) && props[dimensions[2]]! > 0 ? $mdColors.black : $mdColors.grey,
        }"
    /></Label>
    <Box v-else :sty="{ width: `1f` }" />
    <Label
      v-if="dimensions.length > 3"
      :label="getDimensionLabel(dimensions[3])"
      ><NumField
        :negativesAreAllowed="false"
        :hint="dimensionHintText"
        :value="props[dimensions[3]]"
        @update:value="emit(`update:${dimensions[3]}`, $event)"
        underlined
        :sty="{
          textColor:
            exists(props[dimensions[3]]) && props[dimensions[3]]! > 0
              ? $mdColors.black
              : $mdColors.grey,
        }"
    /></Label>
    <Box v-else :sty="{ width: `1f` }" />
  </Row>
  <Row
    v-if="exists(shape) && dimensions.length > 4"
    :sty="{
      width: `1f`,
      padBetween: 1,
    }"
  >
    <Label
      v-if="dimensions.length > 4"
      :label="getDimensionLabel(dimensions[4])"
      ><NumField
        :negativesAreAllowed="false"
        :hint="dimensionHintText"
        :value="props[dimensions[4]]"
        @update:value="emit(`update:${dimensions[4]}`, $event)"
        underlined
        :sty="{
          textColor:
            exists(props[dimensions[4]]) && props[dimensions[4]]! > 0 ? $mdColors.black : $mdColors.grey,
        }"
    /></Label>
    <Box v-else :sty="{ width: `1f` }" />
    <Label
      v-if="dimensions.length > 5"
      :label="getDimensionLabel(dimensions[5])"
      ><NumField
        :negativesAreAllowed="false"
        :hint="dimensionHintText"
        :value="props[dimensions[5]]"
        @update:value="emit(`update:${dimensions[5]}`, $event)"
        underlined
        :sty="{
          textColor:
            exists(props[dimensions[5]]) && props[dimensions[5]]! > 0
              ? $mdColors.black
              : $mdColors.grey,
        }"
    /></Label>
    <Box v-else :sty="{ width: `1f` }" />
  </Row>
</template>
