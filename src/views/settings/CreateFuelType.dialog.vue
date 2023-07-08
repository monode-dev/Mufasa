<script setup lang="ts">
// import { PropType } from "vue";
import { pageTransitions, popPage, pushPage } from "@/Nav";
import { getAppData, isFuelTypeValid } from "@/AppData";
import { PropType, VNodeRef, computed, ref } from "vue";
import { TankShapeId } from "@/views/tanks/ShapeUtils";
import { exists } from "@/utils";

const props = defineProps({});

const appData = getAppData();

const cardRef = ref<VNodeRef | null>(null);
const name = ref<string>(``);
const rate = ref<number | null>(null);
const computedFuelType = computed(() => ({
  name: name.value,
  rate: rate.value,
}));
const fuelTypeIsValid = computed(() => {
  return isFuelTypeValid(computedFuelType.value);
});

function closePopUp() {
  popPage();
}

function handleYes() {
  if (!fuelTypeIsValid.value) return;
  closePopUp();
  appData.fuelTypes.add(computedFuelType.value);
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
      <Text title>Create Fuel Type</Text>
      <Label
        label="Name"
        :sty="{
          width: `1f`,
        }"
      >
        <Field v-model:value="name" underlined hint="Unnamed" />
      </Label>
      <Label
        label="Rate"
        :sty="{
          width: `1f`,
        }"
      >
        <NumField
          :negativesAreAllowed="false"
          underlined
          v-model:value="rate"
          hint="$/gal."
        />
      </Label>
      <Row :sty="{ width: `1f`, align: $Align.spaceEvenly }">
        <Button outlined @click.stop="closePopUp">Cancel</Button>
        <Button
          @click.stop="handleYes"
          :sty="{
            background: fuelTypeIsValid ? $mdColors.green : $mdColors.grey,
          }"
          >Create</Button
        >
      </Row>
    </Card>
  </Box>
</template>
