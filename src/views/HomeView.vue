<script setup lang="ts">
import B, { Sty, Axis, Align,mdColors } from './utils/B.vue';

const appBarSty: Partial<Sty> = {
  width: `1f`,
  background: mdColors.green,
  align: Align.center,
  padding: 1,
  textColor: mdColors.white,
  textSize: 1.5,
}
const pageBody: Partial<Sty> = {
  width: `1f`,
  height: `1f`,
  axis: Axis.column,
  align: Align.center,
  textColor: mdColors.black,
  textSize: 1,
  padding: 1,
};
const notchHeight = getComputedStyle(document.documentElement).getPropertyValue("--sat");
</script>

<template>
  <B :sty="{
    width: `100%`,
    height: `100%`,
    axis: Axis.column,
    align: Align.topCenter,
    background: `#f9fafdff`,
  }">
    <B :sty="{
      width: `1f`,
      height: notchHeight,
      background: mdColors.green,
    }"/>
    <B :sty="appBarSty">
      App Bar
    </B>
    <B :sty="pageBody">Under Construction</B>
  </B>
</template>
