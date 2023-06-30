<script setup lang="ts">
import { getAppData, Client, Tank, UpcomingExistingDelivery } from "@/AppData";
import { computed, ref } from "vue";
import { exists, orderDocs } from "@/utils";
import { mdColors } from "@/miwi-md/Box/BoxDecoration";
import {
  calcGallonsToReachPercent,
  TankShapeId,
  TANK_SHAPE_IDS,
  getTankShape,
} from "./ShapeUtils";

const appData = getAppData();
const tabIndex = ref(0);
const isDeliveryTab = computed(() => tabIndex.value === 0);
const toDeliverTab = () => (tabIndex.value = 0);
const isTankTab = computed(() => tabIndex.value === 1);
const toTankTab = () => (tabIndex.value = 1);
const isDimensionsTab = computed(() => tabIndex.value === 2);
const toDimensionsTab = () => (tabIndex.value = 2);

// Delivery
const delivery = ref(undefined as UpcomingExistingDelivery | undefined);

// Client
const client = ref(undefined as Client | undefined);
// TODO: Should go to null when client changes.
const tank = ref(undefined as Tank | undefined);

// Dimensions
const dimTankShape = ref<TankShapeId | undefined>(undefined);
const dimLength = ref(0);
const dimDepth = ref(0);
const dimHeight = ref(0);
const dimShortHeight = ref(0);

// Other
const stickedInches = ref(0);

// Estimates
const tankShapeCalc = computed(() =>
  isDeliveryTab.value
    ? delivery.value?.upcomingExistingTank?.shape ?? tank.value?.shape
    : isTankTab.value
    ? tank.value?.shape
    : dimTankShape.value,
);
const tankLength = computed(() =>
  isDeliveryTab.value
    ? delivery.value?.upcomingExistingTank?.length ?? 0
    : isTankTab.value
    ? tank.value?.length ?? 0
    : dimLength.value ?? 0,
);
const tankDepth = computed(() =>
  isDeliveryTab.value
    ? delivery.value?.upcomingExistingTank?.depth ?? 0
    : isTankTab.value
    ? tank.value?.depth ?? 0
    : dimDepth.value ?? 0,
);
const tankHeight = computed(() =>
  isDeliveryTab.value
    ? delivery.value?.upcomingExistingTank?.height ?? 0
    : isTankTab.value
    ? tank.value?.height ?? 0
    : dimHeight.value ?? 0,
);
const tankShortHeight = computed(() =>
  isDeliveryTab.value
    ? delivery.value?.upcomingExistingTank?.shortHeight ?? 0
    : isTankTab.value
    ? tank.value?.shortHeight ?? 0
    : dimShortHeight.value ?? 0,
);
const desiredFill = ref(0.9);
const totalGallons = computed(() =>
  getTankShape(tankShapeCalc.value)?.calcTotalVolume({
    length: tankLength.value,
    depth: tankDepth.value,
    height: tankHeight.value,
    shortHeight: tankShortHeight.value,
  }),
);
const currentGallons = computed(() =>
  getTankShape(tankShapeCalc.value)?.calcFilledVolume(
    {
      length: tankLength.value,
      depth: tankDepth.value,
      height: tankHeight.value,
      shortHeight: tankShortHeight.value,
    },
    stickedInches.value,
  ),
);
const currentFillPercent = computed(() =>
  exists(totalGallons.value) && exists(currentGallons.value)
    ? totalGallons.value === 0
      ? 0
      : currentGallons.value / totalGallons.value
    : undefined,
);
const gallonsToReachDesiredFill = computed(() => {
  const estimate = calcGallonsToReachPercent(
    {
      length: tankLength.value,
      depth: tankDepth.value,
      height: tankHeight.value,
      shortHeight: tankShortHeight.value,
    },
    stickedInches.value,
    desiredFill.value,
  );
  return exists(estimate) ? Math.round(estimate).toString() : `-`;
});
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
        <!-- <DropDown
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
        /> -->
      </Box>
      <Label label="Client" v-if="isTankTab">
        <DropDown
          v-model:selected="client"
          :getKeyFromData="(data: Client | undefined) => {
            return data?._firestoreRef?.path;
          }"
          :speciaolOptions="[{ label: `None`, data: undefined }]"
          :options="[
            ...orderDocs(appData.clients, (x) => x.name)
              .filter((x) => x.name !== `` && x.name !== null && x.name !== undefined)
              .map((x) => ({ label: x.name!, data: x })),
          ]"
      /></Label>
      <Label label="Tank" v-if="isTankTab && exists(client)">
        <DropDown
          v-model:selected="tank"
          :getKeyFromData="(data: Tank | undefined) => {
            return data?._firestoreRef?.path;
          }"
          :speciaolOptions="[{ label: `None`, data: undefined }]"
          :options="[
            ...orderDocs(client?.tanks ?? [], (x) => x.creationTimePosix).map(
              (x, index) => ({ label: `#${index}`, data: x }),
            ),
          ]"
      /></Label>
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
            ...Object.values(TANK_SHAPE_IDS).map((x) => ({
              label: getTankShape(x).nameLong,
              data: x,
            })),
          ]"
        />
        <Row
          :sty="{
            width: `1f`,
          }"
        >
          <Label label="Length"><NumField v-model:value="dimLength" /></Label>
          <Label label="Depth"><NumField v-model:value="dimDepth" /></Label>
        </Row>
        <Row
          :sty="{
            width: `1f`,
          }"
        >
          <Label label="Height"><NumField v-model:value="dimHeight" /></Label>
          <Label label="Short Height"
            ><NumField v-model:value="dimShortHeight"
          /></Label>
        </Row>
      </Box>
      <Label label="Sticked Inches"
        ><NumField v-model:value="stickedInches"
      /></Label>
      <!-- <Box /> -->
      <Box :sty="{ width: `1f`, height: 0.125, background: mdColors.grey }" />
      <Row>
        <Label
          label="Current Fill"
          :sty="{ align: $Align.centerLeft, width: `1f` }"
        >
          {{
            exists(currentFillPercent)
              ? Math.round(100 * currentFillPercent)
              : `-`
          }}%</Label
        >
        <Label
          label="Current Gallons"
          :sty="{ align: $Align.centerLeft, width: `1f` }"
        >
          {{ exists(currentGallons) ? Math.round(currentGallons) : `-` }}</Label
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
          {{ Math.round(desiredFill * 100) }}%</Label
        >
        <Label
          label="Gallons to Add"
          :sty="{ align: $Align.centerLeft, width: `1f` }"
          >{{ gallonsToReachDesiredFill }}</Label
        >
      </Row>

      <Slider :min="0.8" v-model:value="desiredFill" :max="1" />
      <!-- <Row :sty="{ spacing: 0.375 }">
        <Box> 80%</Box>
        <Slider :min="0.8" v-model:value="desiredFill" :max="1" />
        <Box> 100%</Box>
      </Row> -->
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
