<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue';
import B, { Sty, Axis, Align,mdColors, Spacing } from './utils/B.vue';
import {gsap} from "gsap";


const tab0Ref = ref<HTMLElement | null>(null);
const tab1Ref = ref<HTMLElement | null>(null);
const tab2Ref = ref<HTMLElement | null>(null);
const tabUnderline = ref<HTMLElement | null>(null);
const selectedTab = ref(1);
const tabPaddingSty: Partial<Sty> = {
  height: 0.375,
  align: Align.bottomCenter,
};
const tabButtonSty: Partial<Sty> = {
  width: 5,
};
const tabUnderlineRegionSty: Partial<Sty> = {
  width: `1f`,
  height: 0.375,
  axis: Axis.row,
  align: Align.bottomCenter,
  spacing: Spacing.spaceAround,
};
const tabUnderlineFillerSty: Partial<Sty> = {
  width: 5,
  height: 0.125,
};
const tabUnderlineSty: Partial<Sty> = {
  width: 5,
  height: 0.125,
  background: mdColors.white,
};
function selectTab(newTab: number) {
  if (newTab === selectedTab.value) return;
  console.log(`selectTab(${newTab})`);
  selectedTab.value = newTab;
  const newUnderlinePosition = newTab === 0
    ? tab1Ref.value!.offsetLeft - tab2Ref.value!.offsetLeft
    : newTab === 1
      ? 0
      : tab2Ref.value!.offsetLeft - tab1Ref.value!.offsetLeft;
  console.log(tab1Ref.value);
  gsap.to(tabUnderline.value, {
    duration: 0.135,
    x: newUnderlinePosition,
    ease: 'power1.inOut',
  })
}

const appBarSty: Partial<Sty> = {
  width: `1f`,
  background: mdColors.green,
  shadowSize: 1.25,
  shadowDirection: Align.bottomCenter,
  align: Align.center,
  padding: 0,
  textColor: mdColors.white,
  textSize: 1,
}
// const bodyRef = ref(null);
const pageBodySty: Partial<Sty> = {
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
      <B :sty="tabPaddingSty"/>
      <B :sty="{
        width: `1f`,
        axis: Axis.row,
        align: Align.center,
        spacing: Spacing.spaceAround,
      }">
        <div ref="tab0Ref">
          <B :sty="tabButtonSty"
            @click="selectTab(0)">
            Clients
          </B>
        </div>
        <div ref="tab1Ref">
          <B :sty="tabButtonSty"
            @click="selectTab(1)">
            Deliveries
          </B>
        </div>
        <div ref="tab2Ref">
          <B :sty="tabButtonSty"
            @click="selectTab(2)">
            Calculator
          </B>
        </div>
      </B>
      <B :sty="tabUnderlineRegionSty">
        <B :sty="tabUnderlineFillerSty" />
        <div ref="tabUnderline" style="width: 6.06rem; height: 0.152rem; background-color: white" />
        <B :sty="tabUnderlineFillerSty" />
      </B>
    </B>
    <B :sty="pageBodySty">Coming Soon</B>
  </B>
</template>
