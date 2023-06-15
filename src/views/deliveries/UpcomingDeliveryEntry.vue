<script setup lang="ts">
import { mdColors } from "@/miwi-md/Box.vue";
import { ref } from "vue";

const props = defineProps({
  isAuto: {
    type: Boolean,
    required: true,
  },
});

const clientName = ref("12345 - Client A");
const amount = ref(10.5);
const fuelType = ref("GAUL");
const tank = ref("Tank B");
</script>

<template>
  <Card :sty="{ width: `1f` }">
    <Row
      :sty="{
        width: `1f`,
        spacing: $Spacing.spaceBetween,
      }"
    >
      <Field v-model:value="clientName" hint="Client Name" />
      <DeleteOptionsButton />
    </Row>
    <Row
      :sty="{
        width: `1f`,
        spacing: 0.25,
      }"
    >
      <Row
        :sty="{
          width: `1f`,
        }"
      >
        <Field v-model:value="amount" hint="Amount" />
        <Text>of:</Text>
      </Row>
      <Row
        :sty="{
          width: `1f`,
        }"
      >
        <Field v-model:value="fuelType" hint="Fuel" />
        <Text>to:</Text>
      </Row>
      <Row
        :sty="{
          width: `1f`,
          align: $Align.centerLeft,
        }"
      >
        <Field v-model:value="tank" hint="Tank" />
      </Row>
    </Row>
  </Card>
</template>
