<script setup lang="ts">
// import { PropType } from "vue";
import { pageTransitions, popPage, pushPage } from "@/Nav";
import { Client, getAppData } from "@/AppData";
import { PropType, VNodeRef, computed, ref } from "vue";

const appData = getAppData();

const cardRef = ref<VNodeRef | null>(null);
const isAuto = ref(true);
const amount = ref(0);

// Auto
const client = ref(`None`);
const tank = ref(`None`);

// Manual
const clientName = ref(``);
const fuelType = ref(`None`);

function closePopUp() {
  popPage();
}
function handleYes() {
  closePopUp();
  // TODO: Create Delivery
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
      <Text title>Create Delivery</Text>
      <Row
        :sty="{
          width: `1f`,
          spacing: $Spacing.spaceAround,
          align: $Align.centerLeft, //$Align.center,
        }"
      >
        <Button pill :outlined="!isAuto" @click.stop="isAuto = true"
          >Auto</Button
        >
        <Button pill :outlined="isAuto" @click.stop="isAuto = false"
          >Manual</Button
        >
      </Row>
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
      <Row :sty="{ width: `1f`, spacing: $Spacing.spaceEvenly }">
        <Button outlined @click.stop="closePopUp">Cancel</Button>
        <Button @click.stop="handleYes">Create</Button>
      </Row>
    </Card>
  </Box>
</template>
