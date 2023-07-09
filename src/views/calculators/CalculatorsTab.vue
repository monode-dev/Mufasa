<script setup lang="ts">
import {
  getAppData,
  Client,
  Tank,
  getTankLabel,
  getClientLabel,
  Delivery,
  listUpcomingDeliveries,
  isTankValid,
} from "@/AppData";
import { computed, ref } from "vue";
import { exists } from "@/utils";
import { mdColors } from "@/miwi-md/Box/BoxDecoration";
import {
  calcGallonsToReachPercent,
  TankShapeId,
  getTankShape,
} from "@/views/tanks/ShapeUtils";

const appData = getAppData();
const tabIndex = ref(0);
const isDeliveryTab = computed(() => tabIndex.value === 0);
const toDeliverTab = () => {
  tabIndex.value = 0;
};
const isTankTab = computed(() => tabIndex.value === 1);
const toTankTab = () => {
  tabIndex.value = 1;
};
const isDimensionsTab = computed(() => tabIndex.value === 2);
const toDimensionsTab = () => {
  tabIndex.value = 2;
};

// Delivery
const delivery = ref<Delivery | null>(null);

// Tank
const client = ref<Client | null>(null);
const tank = ref<Tank | null>(null);

// Dimensions
const dimTankShape = ref<TankShapeId | null>(null);
const dimLength = ref<number | null>(null);
const dimDepth = ref<number | null>(null);
const dimTopDepth = ref<number | null>(null);
const dimFullDepth = ref<number | null>(null);
const dimHeight = ref<number | null>(null);
const dimSquareHeight = ref<number | null>(null);
const dimWideHeight = ref<number | null>(null);
const dimFullHeight = ref<number | null>(null);
const dimDiameter = ref<number | null>(null);

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
const pseudoTank = computed(() => {
  return isDeliveryTab.value
    ? delivery.value?.upcomingExistingTank
    : isTankTab.value
    ? tank.value
    : {
        shape: dimTankShape.value,
        length: dimLength.value,
        depth: dimDepth.value,
        topDepth: dimTopDepth.value,
        fullDepth: dimFullDepth.value,
        height: dimHeight.value,
        squareHeight: dimSquareHeight.value,
        wideHeight: dimWideHeight.value,
        fullHeight: dimFullHeight.value,
        diameter: dimDiameter.value,
      };
});
const desiredFill = ref(0.9);
const totalGallons = computed(() =>
  getTankShape(tankShapeCalc.value)?.calcTotalVolume(pseudoTank.value),
);
const currentGallons = computed(() =>
  getTankShape(tankShapeCalc.value)?.calcFilledVolume(
    pseudoTank.value,
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
const gallonsToReachDesiredFill = computed(() =>
  calcGallonsToReachPercent(
    pseudoTank.value,
    stickedInches.value,
    desiredFill.value,
  ),
);
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
        <Button pill :outlined="!isDeliveryTab" :onClick="toDeliverTab"
          >Delivery</Button
        >
        <Button pill :outlined="!isTankTab" :onClick="toTankTab">Tank</Button>
        <Button pill :outlined="!isDimensionsTab" :onClick="toDimensionsTab"
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
            ...listUpcomingDeliveries(appData.deliveries).filter((x) => exists(x.upcomingExistingTank) && isTankValid(x.upcomingExistingTank)).map((x) => ({
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
        v-model:topDepth="dimTopDepth"
        v-model:fullDepth="dimFullDepth"
        v-model:height="dimHeight"
        v-model:squareHeight="dimSquareHeight"
        v-model:wideHeight="dimWideHeight"
        v-model:fullHeight="dimFullHeight"
        v-model:diameter="dimDiameter"
      />
      <Label label="Sticked Inches"
        ><NumField
          v-model:value="stickedInches"
          underlined
          :hint="`in.`"
          :negativesAreAllowed="false"
      /></Label>
      <!-- <Box /> -->
      <Box :sty="{ width: `1f`, height: 0.125, background: mdColors.grey }" />
      <Row>
        <Label
          label="Current Fill"
          :sty="{ align: $Align.centerLeft, width: `1f` }"
        >
          {{
            exists(currentFillPercent) && !isNaN(currentFillPercent)
              ? `${Math.round(100 * currentFillPercent)}%`
              : emptyText
          }}</Label
        >
        <Label
          label="Current Gallons"
          :sty="{ align: $Align.centerLeft, width: `1f` }"
        >
          {{
            exists(currentGallons) && !isNaN(currentGallons)
              ? Math.round(currentGallons)
              : emptyText
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
          >{{
            exists(gallonsToReachDesiredFill) &&
            !isNaN(gallonsToReachDesiredFill)
              ? Math.round(gallonsToReachDesiredFill).toString()
              : emptyText
          }}</Label
        >
      </Row>

      <Slider :min="0.75" v-model:value="desiredFill" :max="1" />
    </Card>
    <Box />
    <Box />
    <Button :sty="{ width: `1f`, background: $mdColors.grey }"
      >Record Delivery</Button
    >
  </Body>
</template>
