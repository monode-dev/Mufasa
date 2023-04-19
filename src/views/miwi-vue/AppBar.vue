<script setup lang="ts">
import { defineProps, PropType } from "vue";
import B, { Align, mdColors, Axis, Sty } from "./B.vue";
import { useNav } from "@/Nav";
import Icon from "./Icon.vue";
import backSvg from "@/assets/arrow_back_FILL1_wght400_GRAD0_opsz48.svg";

const nav = useNav();

// Allow overriding of the default sty
const props = defineProps({
  sty: {
    type: Object as PropType<Partial<Sty>>,
    default: {},
  },
});
</script>

<template>
  <B
    :sty="{
      width: `1f`,
      background: mdColors.green,
      shadowSize: 1.25,
      shadowDirection: Align.bottomCenter,
      align: Align.bottomCenter,
      textColor: mdColors.white,
      ...sty,
    }"
  >
    <!-- Main Row -->
    <B
      :sty="{
        width: `1f`,
        axis: Axis.row,
        padding: 0.5,
        textSize: 1.5,
      }"
    >
      <!-- Left -->
      <B
        :sty="{
          width: `1f`,
          align: Align.centerLeft,
        }"
      >
        <slot name="left">
          <Icon
            v-if="nav.openedPages.length > 1"
            @click="nav.popPage()"
            :size="1.25"
            :icon="backSvg"
            alt="Back Icon"
        /></slot>
      </B>

      <!-- Title / Center -->
      <B
        :sty="{
          width: `3f`,
          align: Align.center,
          textIsBold: true,
          axis: Axis.row,
          // shouldLog: true,
        }"
      >
        <slot></slot>
      </B>

      <!-- Right -->
      <B
        :sty="{
          width: `1f`,
          align: Align.centerRight,
        }"
      >
        <slot name="right"></slot>
      </B>
    </B>

    <!-- Bottom Row -->
    <B
      :sty="{
        width: `1f`,
        textSize: 1,
      }"
    >
      <slot name="bottom"></slot>
    </B>
  </B>
</template>
