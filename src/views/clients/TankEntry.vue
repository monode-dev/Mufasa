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
        spacing: 1,
      }"
    >
      <Label label="Length"><Field v-model:value="length" underlined /></Label>
      <Label label="Depth"><Field v-model:value="depth" underlined /></Label>
    </Row>
    <Row
      :sty="{
        width: `1f`,
        spacing: 1,
      }"
    >
      <Label label="Height"><Field v-model:value="height" underlined /></Label>
      <Label label="Short Height"
        ><Field v-model:value="shortHeight" underlined
      /></Label>
    </Row>
  </Card>
</template>
