<script setup lang="ts">
import {
  getAppData,
  Client,
  Tank,
  tankShape,
  getTankShapeName,
  UpcomingDelivery,
} from "@/AppData";
import { computed, ref } from "vue";
import { orderDocs } from "@/utils";
import { mdColors } from "@/miwi-md/Box.vue";
import { rectangleTankCalcs, gallonsToFillPercent } from "./ShapeUtils";

const appData = getAppData();
const tabIndex = ref(0);
const isDeliveryTab = computed(() => tabIndex.value === 0);
const toDeliverTab = () => (tabIndex.value = 0);
const isTankTab = computed(() => tabIndex.value === 1);
const toTankTab = () => (tabIndex.value = 1);
const isDimensionsTab = computed(() => tabIndex.value === 2);
const toDimensionsTab = () => (tabIndex.value = 2);

// Delivery
const delivery = ref(null as UpcomingDelivery | null);

// Client
const client = ref(null as Client | null);
const tank = ref(null as Tank | null);

// Dimensions
const dimTankShape = ref(tankShape.none);
const dimLength = ref(0);
const dimDepth = ref(0);
const dimHeight = ref(0);
const dimShortHeight = ref(0);

// Other
const stickedDepth = ref(0);

// Estimates
const estGallons = ref(0);
const estPercent = ref(0);

// Desired Fill: 90% // Desired Volume:
// Gallons to Add: 105
// |---------o------|
</script>

<template>
  <Body>
    <Text title>Tank Details</Text>
    <Card
      :sty="{
        width: `1f`,
        // padding: `1 0`,
      }"
    >
      <Row
        :sty="{
          width: `1f`,
          spacing: $Spacing.spaceBetween,
          align: $Align.centerLeft, //$Align.center,
        }"
      >
        <Button pill :outlined="!isDeliveryTab" @click.stop="toDeliverTab"
          >Delivery</Button
        >
        <Button pill :outlined="!isTankTab" @click.stop="toTankTab"
          >Tank</Button
        >
        <Button pill :outlined="!isDimensionsTab" @click.stop="toDimensionsTab"
          >Dimensions</Button
        >
      </Row>
      <Box
        v-if="isDeliveryTab"
        :sty="{
          width: `1f`,
          spacing: 1,
        }"
      >
        <DropDown
          label="Delivery"
          v-model:selected="delivery"
          :getKeyFromData="(data: UpcomingDelivery | null) => {
            return data?._firestoreRef?.path;
          }"
          :options="[
            { label: `None`, data: undefined },
            ...orderDocs(
              appData.upcomingDeliveries,
              (x) => x.creationTimePosix,
            ).map((x) => ({
              label: `${x.client?.name ?? `Unnamed`} - Tank - ${x.amount}`,
              data: x,
            })),
          ]"
        />
      </Box>
      <Row
        v-if="isTankTab"
        :sty="{
          width: `1f`,
          spacing: 0.5,
        }"
      >
        <DropDown
          v-model:selected="client"
          :getKeyFromData="(data: Client | null) => {
            return data?._firestoreRef?.path;
          }"
          :options="[
            { label: `None`, data: undefined },
            ...orderDocs(appData.clients, (x) => x.name)
              .filter((x) => x.name !== `` && x.name !== null && x.name !== undefined)
              .map((x) => ({ label: x.name!, data: x })),
          ]"
        />
        <DropDown
          v-model:selected="tank"
          :getKeyFromData="(data: Tank | null) => {
            return data?._firestoreRef?.path;
          }"
          :options="[
            { label: `None`, data: undefined },
            ...orderDocs(client?.tanks ?? [], (x) => x.creationTimePosix).map(
              (x, index) => ({ label: `#${index}`, data: x }),
            ),
          ]"
        />
      </Row>
      <Box
        v-if="isDimensionsTab"
        :sty="{
          width: `1f`,
          spacing: 1,
        }"
      >
        <DropDown
          label="Shape"
          v-model:selected="dimTankShape"
          :getKeyFromData="(data: any) => data"
          :options="[
            ...Object.values(tankShape).map((x) => ({
              label: getTankShapeName(x),
              data: x,
            })),
          ]"
        />
        <Row
          :sty="{
            width: `1f`,
          }"
        >
          <Label label="Length"><Field v-model:value="dimLength" /></Label>
          <Label label="Depth"><Field v-model:value="dimDepth" /></Label>
        </Row>
        <Row
          :sty="{
            width: `1f`,
          }"
        >
          <Label label="Height"><Field v-model:value="dimHeight" /></Label>
          <Label label="Short Height"
            ><Field v-model:value="dimShortHeight"
          /></Label>
        </Row>
      </Box>
      <Row :sty="{ spacing: 0.25 }">
        <Label label="Sticked Depth"
          ><Field v-model:value="stickedDepth" /></Label
        >.in
      </Row>
      <!-- <Box /> -->
      <Box :sty="{ width: `1f`, height: 0.125, background: mdColors.grey }" />
      <Row>
        <Label
          label="Current Fill"
          :sty="{ align: $Align.centerLeft, width: `1f` }"
        >
          30%</Label
        >
        <Label
          label="Current Gallons"
          :sty="{ align: $Align.centerLeft, width: `1f` }"
        >
          25</Label
        >
      </Row>

      <!-- <Box v-if="isTankTab || isDeliveryTab" :sty="{ height: 1 }" />
      <Box v-if="isDeliveryTab" :sty="{ height: 1 }" /> -->
    </Card>
    <Box />
    <!-- <Box :sty="{ height: 1 }" /> -->
    <Text title>Fill Details</Text>
    <Card
      :sty="{
        width: `1f`,
      }"
    >
      <!-- <Box :sty="{ width: `1f`, height: 0.125, background: mdColors.grey }" /> -->
      <Row>
        <Label
          label="Desired Fill"
          :sty="{ align: $Align.centerLeft, width: `1f` }"
        >
          90%</Label
        >
        <Label
          label="Gallons to Add"
          :sty="{ align: $Align.centerLeft, width: `1f` }"
        >
          105</Label
        >
      </Row>

      <!-- <Slider /> -->
      <Row :sty="{ spacing: 0.375 }">
        <Box> 80%</Box>
        <Slider />
        <Box> 100%</Box>
      </Row>
      <!-- <Button :sty="{ width: `1f` }"
        >Record Delivery</Button
      > -->
    </Card>
    <Box />
    <Box />
    <Button :sty="{ width: `1f` }">Record Delivery</Button>
    <!-- <Box :sty="{ height: `1f` }" />
    <Button :sty="{ width: `1f` }">Record Delivery</Button> -->
  </Body>
</template>
