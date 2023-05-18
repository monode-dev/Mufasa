<script setup lang="ts">
import { ref } from "vue";

const length = ref(`0`);
const depth = ref(`0`);
const height = ref(`0`);
const shortHeight = ref(`0`);
</script>

<template>
  <Card :sty="{ width: `1f` }">
    <Box
      :sty="{
        width: `1f`,
        spacing: $Spacing.spaceBetween,
        axis: $Axis.row,
      }"
    >
      <Text>#<slot /></Text>

      <DeleteOptionsButton />
    </Box>
    <DropDown label="Fuel" selected="GAPRMC" />
    <DropDown label="Shape" selected="Horizontal Cylinder" />
    <Row
      :sty="{
        width: `1f`,
      }"
    >
      <Label label="Length"><Field v-model:value="length" /></Label>
      <Label label="Depth"><Field v-model:value="depth" /></Label>
    </Row>
    <Row
      :sty="{
        width: `1f`,
      }"
    >
      <Label label="Height"><Field v-model:value="height" /></Label>
      <Label label="Short Height"><Field v-model:value="shortHeight" /></Label>
    </Row>
  </Card>
</template>
