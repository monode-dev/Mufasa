<script setup lang="ts">
import {
  getAppData,
  Client,
  Tank,
  tankShape,
  getTankShapeName,
} from "@/AppData";
import { ref } from "vue";
// import { exists } from "@/utils";

// const appData = getAppData();
const isLookUp = ref(true);

// Look Up
const client = ref<Client | null>(null);
const tank = ref<Tank | null>(null);

// Use Dimensions
const dimTankShape = ref(tankShape.none);
const dimLength = ref(0);
const dimDepth = ref(0);
const dimHeight = ref(0);
const dimShortHeight = ref(0);
</script>

<template>
  <Body>
    <Card
      :sty="{
        width: `1f`,
        // padding: `1 0`,
      }"
    >
      <Row
        :sty="{
          width: `1f`,
          spacing: $Spacing.spaceAround,
          align: $Align.centerLeft, //$Align.center,
        }"
      >
        <Button pill :outlined="!isLookUp" @click.stop="isLookUp = true"
          >Look Up</Button
        >
        <Button pill :outlined="isLookUp" @click.stop="isLookUp = false"
          >Use Dimensions</Button
        >
      </Row>
      <Box
        v-if="isLookUp"
        :sty="{
          width: `1f`,
          spacing: 1,
        }"
      >
        <Text>Client</Text>
        <Text>Tank</Text>
      </Box>
      <Box
        v-else
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
    </Card>
    <Card
      :sty="{
        width: `1f`,
      }"
    >
      <Text>Sticked Depth</Text>
      <Text>90%</Text>
    </Card>
  </Body>
</template>
