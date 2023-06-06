<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  isAuto: {
    type: Boolean,
    required: true,
  },
});

const amount = ref(0);

// Auto
const client = ref(`None`);
const tank = ref(`None`);

// Manual
const clientName = ref(`Client A`);
const fuelType = ref(`None`);
</script>

<template>
  <Card :sty="{ width: `1f` }">
    <Box
      v-if="isAuto"
      :sty="{
        width: `1f`,
        spacing: 1,
      }"
    >
      <DropDown
        label="Client"
        v-model:selected="client"
        :getKeyFromData="(data: any) => data"
        :options="[
          {
            label: `None`,
            data: `None`,
          },
          {
            label: `Client A`,
            data: `Client A`,
          },
          {
            label: `Client B`,
            data: `Client B`,
          },
          {
            label: `Client C`,
            data: `Client C`,
          },
        ]"
      />
      <DropDown
        label="Tank"
        v-model:selected="tank"
        :getKeyFromData="(data: any) => data"
        :options="[
          {
            label: `None`,
            data: `None`,
          },
          {
            label: `Tank A`,
            data: `Tank A`,
          },
          {
            label: `Tank B`,
            data: `Tank B`,
          },
          {
            label: `Tank C`,
            data: `Tank C`,
          },
        ]"
      />
    </Box>
    <Box
      v-if="!isAuto"
      :sty="{
        width: `1f`,
        spacing: 1,
      }"
    >
      <Label label="Client Name"
        ><Field v-model:value="clientName" hint="Client Name"
      /></Label>
      <DropDown
        label="Fuel Type"
        v-model:selected="fuelType"
        :getKeyFromData="(data: any) => data"
        :options="[
          {
            label: `None`,
            data: `None`,
          },
          {
            label: `Fuel Type A`,
            data: `Fuel Type A`,
          },
          {
            label: `Fuel Type B`,
            data: `Fuel Type B`,
          },
          {
            label: `Fuel Type C`,
            data: `Fuel Type C`,
          },
        ]"
      />
    </Box>
    <Label label="Amount"><Field v-model:value="amount" /></Label>
    <Button outlined :sty="{ width: `1f` }">Complete</Button>
  </Card>
</template>
