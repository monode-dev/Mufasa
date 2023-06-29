<script setup lang="ts">
import { tankShape, getTankShapeName, TankShape } from "@/AppData";
import { PropType } from "vue";
const props = defineProps({
  shape: {
    type: Number as PropType<TankShape | null | undefined>,
    required: true,
  },
  length: {
    type: [Number, String] as PropType<number | string | null | undefined>,
    required: true,
  },
  depth: {
    type: [Number, String] as PropType<number | string | null | undefined>,
    required: true,
  },
  height: {
    type: [Number, String] as PropType<number | string | null | undefined>,
    required: true,
  },
  shortHeight: {
    type: [Number, String] as PropType<number | string | null | undefined>,
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
      ...Object.values(tankShape).map((x) => ({
        label: getTankShapeName(x),
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
      <Field
        hint="0"
        :value="length"
        @update:value="emit(`update:length`, $event)"
      />
    </Label>
    <Label label="Depth">
      <Field
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
      ><Field
        hint="0"
        :value="height"
        @update:value="emit(`update:height`, $event)"
    /></Label>
    <Label label="Short Height"
      ><Field
        hint="0"
        :value="shortHeight"
        @update:value="emit(`update:shortHeight`, $event)"
    /></Label>
  </Row>
</template>
