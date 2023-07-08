<script setup lang="ts">
import { defineProps, PropType } from "vue";
import { FuelType } from "@/AppData";
import { pushPage } from "@/Nav";
import DeleteDialogVue from "../components/DeleteDialog.vue";
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

function deletePressed() {
  pushPage(DeleteDialogVue, {
    obj: props.fuelType,
    message: `Are you sure you want to permanently delete "${
      props.fuelType.name ?? `this fuel type`
    }"? Associated tanks will have their fuel type set to "None".`,
  });
}
</script>

<template>
  <Row
    v-if="fuelType.isLoaded"
    :sty="{
      padBetween: 1,
    }"
  >
    <Label
      label="Name"
      :sty="{
        width: `4f`,
      }"
    >
      <Field v-model:value="fuelType.name" underlined hint="Unnamed" />
    </Label>
    <Label
      label="Rate"
      :sty="{
        width: `3f`,
      }"
    >
      <NumField
        :negativesAreAllowed="false"
        underlined
        v-model:value="fuelType.rate"
        hint="$/gal."
      />
    </Label>
    <DeleteOptionsButton @delete="deletePressed" />
  </Row>
  <Text v-else hint :sty="{ width: `1f` }">Loading...</Text>
</template>
