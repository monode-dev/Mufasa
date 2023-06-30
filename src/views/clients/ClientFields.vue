<script setup lang="ts">
import { PropType } from "vue";

const props = defineProps({
  name: {
    type: String as PropType<string | null | undefined>,
    required: true,
  },
  clientId: {
    type: Number as PropType<number | null | undefined>,
    required: true,
  },
  phoneNumber: {
    type: String as PropType<string | null | undefined>,
    required: true,
  },
  address: {
    type: String as PropType<string | null | undefined>,
    required: true,
  },
  notes: {
    type: String as PropType<string | null | undefined>,
    required: true,
  },
});
const emit = defineEmits([
  "update:name",
  "update:clientId",
  "update:phoneNumber",
  "update:address",
  "update:notes",
]);
</script>

<template>
  <Field
    underlined
    hint="Name"
    icon="account"
    :value="name"
    @update:value="emit(`update:name`, $event)"
    :sty="{ width: `1f` }"
  />
  <NumField
    underlined
    hint="Client ID"
    icon="identifier"
    :value="clientId"
    @update:value="emit(`update:clientId`, $event)"
    :sty="{ width: `1f` }"
  />
  <Field
    underlined
    hint="Phone"
    icon="phone"
    :value="phoneNumber"
    @update:value="emit(`update:phoneNumber`, $event)"
    :sty="{ width: `1f` }"
  />
  <Field
    underlined
    hint="Address"
    icon="mapMarker"
    :value="address"
    @update:value="emit(`update:address`, $event)"
    :sty="{ width: `1f` }"
  />
  <Field
    underlined
    hint="Notes"
    icon="textBox"
    :value="notes"
    @update:value="emit(`update:notes`, $event)"
    :sty="{ width: `1f` }"
  />
</template>
