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
const shortDepth = ref<number | null>(null);
const fullDepth = ref<number | null>(null);
const height = ref<number | null>(null);
const shortHeight = ref<number | null>(null);
const fullHeight = ref<number | null>(null);
const diameter = ref<number | null>(null);
const optionalLabel = ref<string>(``);
const computedTank = computed(() => ({
  fuelType: fuelType.value,
  shape: shape.value,
  length: length.value,
  depth: depth.value,
  shortDepth: shortDepth.value,
  fullDepth: fullDepth.value,
  height: height.value,
  shortHeight: shortHeight.value,
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
      <DropDown
        label="Fuel"
        v-model:selected="fuelType"
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
        v-model:shape="shape"
        v-model:length="length"
        v-model:depth="depth"
        v-model:shortDepth="shortDepth"
        v-model:fullDepth="fullDepth"
        v-model:height="height"
        v-model:shortHeight="shortHeight"
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
        <Button outlined @click.stop="closePopUp">Cancel</Button>
        <Button
          @click.stop="handleYes"
          :sty="{
            background: tankIsValid ? $mdColors.green : $mdColors.grey,
          }"
          >Create</Button
        >
      </Row>
    </Card>
  </Box>
</template>
