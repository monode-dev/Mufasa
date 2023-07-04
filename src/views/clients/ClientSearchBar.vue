<script setup lang="ts">
import { defineProps, PropType, defineEmits } from "vue";
import { mdColors } from "@/miwi-md/Box/BoxDecoration";

const props = defineProps({
  filterString: {
    type: String,
    required: true,
  },
  sty: {
    type: Object as PropType<Partial<Sty>>,
    default: {},
  },
});

const emit = defineEmits(["update:filterString", "close"]);
</script>

<template>
  <Row
    :sty="{
      width: `1f`,
      background: mdColors.green,
      pad: 0.5,
      shadowSize: 1.25,
      shadowDirection: $Align.bottomCenter,
      zIndex: 1,
      ...sty,
    }"
  >
    <Row
      :sty="{
        width: `1f`,
        pad: 0.25,
        cornerRadius: 0.75,
        align: $Align.centerLeft,
        background: mdColors.white,
        textColor: mdColors.grey,
      }"
    >
      <Box :sty="{ width: 0.25 }" />
      <Field
        hint="Search by Name or ID"
        :value="filterString"
        @update:value="emit(`update:filterString`, $event)"
      />
      <Box :sty="{ width: 0.25 }" />
    </Row>
    <Icon
      @click="emit(`close`)"
      :scale="1.5"
      icon="close"
      :color="mdColors.white"
    />
    <!-- <Icon
      @click="addPressed"
      :scale="1.5"
      icon="plus"
      :color="mdColors.white"
    /> -->
  </Row>
</template>
