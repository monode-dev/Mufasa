<script setup lang="ts">
import { mdColors } from "@/miwi-md/Box.vue";
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

      <Icon icon="dotsVertical" />
    </Box>
    <Row :sty="{ width: `1f`, spacing: 0.5, align: $Align.topCenter }">
      <Text>Fuel:</Text>
      <DropDown selected="GAPRMC" />
    </Row>
    <Row :sty="{ width: `1f`, spacing: 0.5, align: $Align.topCenter }">
      <Text>Shape:</Text>
      <DropDown selected="Horizontal Cylinder" />
    </Row>
    <!-- <Box
      :sty="{
        width: `1f`,
        axis: $Axis.row,
        spacing: 1,
      }"
    >
      <Row :sty="{ width: `1f`, spacing: 0.25, align: $Align.topCenter }">
        <Text>Shape:</Text>
        <DropDown selected="Cylinder H" />
      </Row>
      <Row :sty="{ width: `1f`, spacing: 0.25, align: $Align.topCenter }">
        <Text>Fuel:</Text>
        <DropDown selected="GAPRMC" />
      </Row>
    </Box> -->
  </Card>
</template>
