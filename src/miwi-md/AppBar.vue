<script setup lang="ts">
import { PropType } from "vue";
import Box, { Align, mdColors, Axis, Sty } from "./Box.vue";
import { useNav } from "@/Nav";
import Icon from "./Icon.vue";

const nav = useNav();
// We dont want this to be reactive since it should only change between loads.
// There is probably a less hacky way to do this.
const numOpenPages = nav.openedPages.length;

// Allow overriding of the default sty
const props = defineProps({
  sty: {
    type: Object as PropType<Partial<Sty>>,
    default: {},
  },
});
</script>

<template>
  <!-- Notch Spacer -->
  <Box
    :sty="{
      width: `1f`,
      height: `env(safe-area-inset-top)`,
      background: sty.background ?? mdColors.green,
      zIndex: 2,
    }"
  />

  <!-- App Bar -->
  <Box
    :sty="{
      width: `1f`,
      background: mdColors.green,
      shadowSize: 1.25,
      shadowDirection: Align.bottomCenter,
      align: Align.bottomCenter,
      textColor: mdColors.white,
      zIndex: 1,
      ...sty,
    }"
  >
    <!-- Main Row -->
    <Box
      :sty="{
        width: `1f`,
        axis: Axis.row,
        padding: 0.5,
        scale: 1.5,
      }"
    >
      <!-- Left -->
      <Box
        :sty="{
          width: `1f`,
          align: Align.centerLeft,
        }"
      >
        <slot name="left">
          <Icon
            v-if="numOpenPages > 1"
            @click="nav.popPage()"
            :scale="1.25"
            icon="arrowLeft"
            alt="Back Icon"
          />
        </slot>
      </Box>

      <!-- Title / Center -->
      <Box
        :sty="{
          width: `3f`,
          align: Align.center,
          textIsBold: true,
          axis: Axis.row,
          // shouldLog: true,
        }"
      >
        <slot></slot>
      </Box>

      <!-- Right -->
      <Box
        :sty="{
          width: `1f`,
          align: Align.centerRight,
        }"
      >
        <slot name="right"></slot>
      </Box>
    </Box>

    <!-- Bottom Row -->
    <Box
      :sty="{
        width: `1f`,
        scale: 1,
      }"
    >
      <slot name="bottom"></slot>
    </Box>
  </Box>
</template>
