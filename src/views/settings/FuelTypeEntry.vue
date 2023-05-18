<script setup lang="ts">
import { defineProps, PropType } from "vue";
import { Sty } from "@/miwi-md/Box.vue";
import { FuelType } from "@/firebase";
import { mdColors } from "@/miwi-md/Box.vue";
// Allow overriding of the default sty
const props = defineProps({
  sty: {
    type: Object as PropType<Partial<Sty>>,
    default: {},
  },
  fuelType: {
    type: Object as PropType<FuelType>,
    required: true,
  },
});

// function deletePressed() {
//   props.fuelType.deleteDoc();
// }
</script>

<template>
  <Row
    v-if="fuelType.isLoaded"
    :sty="{
      ...sty,
      textColor: fuelType.isVisible ? sty.textColor : mdColors.grey,
    }"
  >
    <Label
      label="Name"
      :sty="{
        width: `1f`,
      }"
    >
      <Field v-model:value="fuelType.name" hint="Unnamed" />
    </Label>
    <Label
      label="Rate"
      :sty="{
        width: `1f`,
      }"
    >
      <Field v-model:value="fuelType.rate" hint="$/Unit" />
    </Label>
    <Icon
      :icon="fuelType.isVisible ? `eye` : `eyeOff`"
      @click.stop="fuelType.isVisible = !fuelType.isVisible"
    />
    <!-- <DeleteOptionsButton @delete="deletePressed" /> -->
  </Row>
  <Text v-else hint :sty="{ width: `1f` }">Loading...</Text>
</template>
