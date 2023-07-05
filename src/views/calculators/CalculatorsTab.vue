<script setup lang="ts">
import {
  getAppData,
  Client,
  Tank,
  UpcomingExistingDelivery,
  getTankLabel,
  getClientLabel,
  Delivery,
  listUpcomingDeliveries,
} from "@/AppData";
import { computed, ref, watchEffect } from "vue";
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
const delivery = ref<UpcomingExistingDelivery | null>(null);

// Tank
const client = ref<Client | null>(null);
const tank = ref<Tank | null>(null);

// Dimensions
const dimTankShape = ref<TankShapeId | null>(null);
const dimLength = ref<number | null>(null);
const dimDepth = ref<number | null>(null);
const dimHeight = ref<number | null>(null);
const dimShortHeight = ref<number | null>(null);
const dimDiameter = ref<number | null>(null);
const dimPseudoTank = computed(() => ({
  shape: dimTankShape.value,
  length: dimLength.value,
  depth: dimDepth.value,
  height: dimHeight.value,
  shortHeight: dimShortHeight.value,
  diameter: dimDiameter.value,
}));

// Other
const stickedInches = ref<number | null>(null);

// Estimates
const emptyText = `--`;
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
    dimPseudoTank.value,
    stickedInches.value,
    desiredFill.value,
  );
  return exists(estimate) ? Math.round(estimate).toString() : emptyText;
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
          align: $Align.spaceBetween,
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
          padBetween: 1,
        }"
      >
        <DropDown
          label="Delivery"
          v-model:selected="delivery"
          :getKeyFromData="(data: Delivery | null) => {
            return data?._firestoreRef?.path;
          }"
          :options="[
            //{ label: `None`, data: null },
            ...listUpcomingDeliveries(appData.deliveries).map((x) => ({
              label: `${getClientLabel((x as any)?.upcomingExistingClient)} - ${getTankLabel(
                (x as any)?.upcomingExistingTank,
              )}`,
              data: x,
            })),
          ]"
        />
      </Box>
      <ClientAndTankSelector
        v-if="isTankTab"
        v-model:client="client"
        v-model:tank="tank"
      />
      <TankFields
        v-if="isDimensionsTab"
        v-model:shape="dimTankShape"
        v-model:length="dimLength"
        v-model:depth="dimDepth"
        v-model:height="dimHeight"
        v-model:shortHeight="dimShortHeight"
        v-model:diameter="dimDiameter"
      />
      <Label label="Sticked Inches"
        ><NumField v-model:value="stickedInches" underlined :hint="emptyText"
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
              ? `${Math.round(100 * currentFillPercent)}%`
              : emptyText
          }}</Label
        >
        <Label
          label="Current Gallons"
          :sty="{ align: $Align.centerLeft, width: `1f` }"
        >
          {{
            exists(currentGallons) ? Math.round(currentGallons) : emptyText
          }}</Label
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
    </Card>
    <Box />
    <Box />
    <Button :sty="{ width: `1f`, background: $mdColors.grey }"
      >Record Delivery</Button
    >
  </Body>
</template>
