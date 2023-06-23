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
        <Label label="Sticked Depth"><Field v-model:value="dimLength" /></Label
        >.in
      </Row>

      <!-- <Box v-if="isTankTab || isDeliveryTab" :sty="{ height: 1 }" />
      <Box v-if="isDeliveryTab" :sty="{ height: 1 }" /> -->
    </Card>
    <Box />
    <!-- <Box :sty="{ height: 1 }" /> -->
    <Text title>Estimates</Text>
    <Card
      :sty="{
        width: `1f`,
      }"
    >
      <Row
        :sty="{
          width: `1f`,
        }"
      >
        <Label label="70%" :sty="{ align: $Align.centerLeft }">5 Units</Label>
        <Label label="80%" :sty="{ align: $Align.centerLeft }">10 Units</Label>
      </Row>
      <Row
        :sty="{
          width: `1f`,
        }"
      >
        <Label label="90%" :sty="{ align: $Align.centerLeft }">50 Units</Label>
        <Label label="100%" :sty="{ align: $Align.centerLeft }"
          >100 Units</Label
        >
      </Row>
    </Card>
  </Body>
</template>
