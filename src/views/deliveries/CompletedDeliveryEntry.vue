<script setup lang="ts">
import { ref } from "vue";

// Auto
const client = ref(`None`);
const tank = ref(`None`);

// Manual
const clientName = ref(`Client A`);
const fuelTypeName = ref(`Fuel Type A`);
const rate = ref(0);
const amount = ref(0);
</script>

<template>
  <Card :sty="{ width: `1f` }">
    <Row
      :sty="{
        width: `1f`,
      }"
    >
      <Text hint :sty="{ width: `1f`, align: $Align.centerLeft }"
        >Tue: March 10th 2021</Text
      >
      <DeleteOptionsButton />
    </Row>
    <Row
      :sty="{
        width: `1f`,
      }"
    >
      <Label label="Client"><Field v-model:value="clientName" /></Label>
      <Label label="Fuel"><Field v-model:value="fuelTypeName" /></Label>
    </Row>
    <Row
      :sty="{
        width: `1f`,
      }"
    >
      <Label label="Rate"><Field v-model:value="rate" /></Label>
      <Label label="Amount"><Field v-model:value="amount" /></Label>
    </Row>
  </Card>
</template>
