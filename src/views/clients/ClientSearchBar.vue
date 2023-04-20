<script setup lang="ts">
import { mdColors } from "@/miwi-md/Box.vue";

const props = defineProps({
  sty: {
    type: Object as StyProp,
    default: {},
  },
});
</script>

<template>
  <Box :sty="{
    width: `1f`,
    background: mdColors.green,
    axis: $Axis.row,
    padding: 0.5,
    shadowSize: 1.25,
    shadowDirection: $Align.bottomCenter,
    spacing: 0.5,
    ...sty,
  }">
    <Box :sty="{
        width: `1f`,
        padding: 0.25,
        cornerRadius: 0.75,
        align: $Align.centerLeft,
        background: mdColors.white,
        textColor: mdColors.grey,
        axis: $Axis.row,
      }">
      <Box :sty="{ width: 0.25 }" />
      Add New or Search
      <Box :sty="{ width: 0.25 }" />
    </Box>
    <Box :sty="{
        align: $Align.center,
        textColor: mdColors.white,
      }">
      <Icon :scale="1.5" icon="plus" />
    </Box>
  </Box>
</template>
