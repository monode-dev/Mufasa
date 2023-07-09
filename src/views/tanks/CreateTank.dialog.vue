<script setup lang="ts">
// import { PropType } from "vue";
import { pageTransitions, popPage, pushPage } from "@/Nav";
import { isTankValid, getAppData, FuelType, Client } from "@/AppData";
import { PropType, VNodeRef, computed, ref } from "vue";
import { TankShapeId } from "./ShapeUtils";
import { exists } from "@/utils";

const props = defineProps({
  client: {
    type: Object as PropType<Client>,
    required: true,
  },
});

const appData = getAppData();

const cardRef = ref<VNodeRef | null>(null);
const fuelType = ref<FuelType | null>(null);
const shape = ref<TankShapeId | null>(null);
const length = ref<number | null>(null);
const depth = ref<number | null>(null);
const topDepth = ref<number | null>(null);
const fullDepth = ref<number | null>(null);
const height = ref<number | null>(null);
const squareHeight = ref<number | null>(null);
const wideHeight = ref<number | null>(null);
const fullHeight = ref<number | null>(null);
const diameter = ref<number | null>(null);
const optionalLabel = ref<string>(``);
const computedTank = computed(() => ({
  fuelType: fuelType.value,
  shape: shape.value,
  length: length.value,
  depth: depth.value,
  topDepth: topDepth.value,
  fullDepth: fullDepth.value,
  height: height.value,
  squareHeight: squareHeight.value,
  wideHeight: wideHeight.value,
  fullHeight: fullHeight.value,
  diameter: diameter.value,
  optionalLabel: optionalLabel.value,
}));
const tankIsValid = computed(() => {
  return isTankValid(computedTank.value);
});

function closePopUp() {
  popPage();
}

function handleYes() {
  if (!tankIsValid.value) return;
  closePopUp();
  if (!exists(props.client.tanks)) return;
  props.client.tanks.add(computedTank.value);
}

// Close the pop up when the user clicks outside of it
function popOnClickOutside(e: MouseEvent) {
  if (!cardRef.value?.$el.contains(e.target)) {
    closePopUp();
    e.stopPropagation();
  }
}
</script>

<script lang="ts">
export default {
  transitions: pageTransitions.fadeIn(),
};
</script>

<template>
  <Box
    @click="popOnClickOutside"
    :sty="{
      width: `1f`,
      height: `1f`,
      background: `#00000099`,
    }"
  >
    <Card
      ref="cardRef"
      :sty="{
        width: `75%`,
        shadowSize: 0,
      }"
    >
      <Text title>Create Tank</Text>
      <FuelTypeDropDown v-model:fuelType="fuelType" />
      <TankFields
        singleFile
        v-model:shape="shape"
        v-model:length="length"
        v-model:depth="depth"
        v-model:topDepth="topDepth"
        v-model:fullDepth="fullDepth"
        v-model:height="height"
        v-model:squareHeight="squareHeight"
        v-model:wideHeight="wideHeight"
        v-model:fullHeight="fullHeight"
        v-model:diameter="diameter"
      />
      <Field
        v-model:value="optionalLabel"
        hint="Optional Label"
        icon="label"
        underlined
      />
      <Row :sty="{ width: `1f`, align: $Align.spaceEvenly }">
        <Button outlined :onClick="closePopUp">Cancel</Button>
        <Button
          :onClick="handleYes"
          :sty="{
            background: tankIsValid ? $mdColors.green : $mdColors.grey,
          }"
          >Create</Button
        >
      </Row>
    </Card>
  </Box>
</template>
