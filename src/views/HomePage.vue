<script setup lang="ts">
import { Component, ComponentInternalInstance, ComponentPublicInstance, ref } from 'vue';
import { SplashScreen } from '@capacitor/splash-screen';
import B, { Sty, Axis, Align,mdColors, Spacing, Overflow } from '@/views/miwi-vue/B.vue';
import MdPage from '@/views/miwi-vue/MdPage.vue';
import router from '@/router';
import {gsap} from "gsap";
import settingsSvg from '@/assets/settings_FILL1_wght400_GRAD0_opsz48.svg';
import ClientEntry from './clients/ClientEntry.vue';
import MdAppBar from '@/views/miwi-vue/MdAppBar.vue';
import MdBody from '@/views/miwi-vue/MdBody.vue';
import ClientsTab from './clients/ClientsTab.vue';
import Icon from '@/views/miwi-vue/Icon.vue';
/* We do this here instead of at the end of AutoUpdateLoadingScreen
 * so that we never accidentally see the loading splash screen. */
SplashScreen.hide();

const tab0Ref = ref<ComponentPublicInstance | null>(null);
const tab1Ref = ref<ComponentPublicInstance | null>(null);
const tab2Ref = ref<ComponentPublicInstance | null>(null);
const tabUnderline = ref<ComponentPublicInstance | null>(null);
const tabBodiesParent = ref<ComponentPublicInstance | null>(null);
const selectedTab = ref(1);
function selectTab(newTab: number) {
  if (newTab === selectedTab.value) return;
  selectedTab.value = newTab;
  const newUnderlinePosition = newTab === 0
    ? tab1Ref.value!.$el.offsetLeft - tab2Ref.value!.$el.offsetLeft
    : newTab === 1
      ? 0
      : tab2Ref.value!.$el.offsetLeft - tab1Ref.value!.$el.offsetLeft;
  const newTabPosition = newTab === 0
    ? `100vw`
    : newTab === 1
      ? 0
      : `-100vw`;
  gsap.to(tabUnderline.value!.$el, {
    duration: 0.15,
    x: newUnderlinePosition,
    ease: 'power1.out',
  })
  gsap.to(tabBodiesParent.value!.$el, {
    duration: 0.15,
    x: newTabPosition,
    ease: 'power1.out',
  })
}

// Sty
const tabButtonWidth = 4.75;
const tabButtonSty: Partial<Sty> = {
  width: tabButtonWidth,
};
const tabUnderlineRegionSty: Partial<Sty> = {
  width: `1f`,
  height: 0.375,
  axis: Axis.row,
  align: Align.bottomCenter,
  spacing: Spacing.spaceAround,
};
const tabUnderlineFillerSty: Partial<Sty> = {
  width: tabButtonWidth,
  height: 0.125,
};
const tabUnderlineSty: Partial<Sty> = {
  width: tabButtonWidth,
  height: 0.125,
  background: mdColors.sameAsText,
};
</script>

<template>
  <MdPage>
    <!-- App Bar -->
    <MdAppBar>
      <template #title>
        Fuel Calculator
      </template>
      <template #right>
        <Icon @click="router.push(`/home/settings`)" :size="1.25" :icon="settingsSvg" alt="Settings Icon"/>
      </template>
      <template #bottom>
        <B :sty="{
          width: `1f`,
          axis: Axis.row,
          align: Align.center,
          spacing: Spacing.spaceAround,
        }">
          <B :sty="tabButtonSty"
            class="tab0"
            ref="tab0Ref"
            @click="selectTab(0)">
            Clients
          </B>
          <B :sty="tabButtonSty"
            class="tab1"
            ref="tab1Ref"
            @click="selectTab(1)">
            Deliveries
          </B>
          <B :sty="tabButtonSty"
            class="tab2"
            ref="tab2Ref"
            @click="selectTab(2)">
            Calculator
          </B>
        </B>
        <B :sty="tabUnderlineRegionSty">
          <B :sty="tabUnderlineFillerSty" />
          <B :sty="tabUnderlineSty" ref="tabUnderline"/>
          <B :sty="tabUnderlineFillerSty" />
        </B>
      </template>
    </MdAppBar>

    <!-- Body -->
    <B ref="tabBodiesParent"
      :sty="{
        width: `300%`,
        height: `1f`,
        axis: Axis.row,
        align: Align.topCenter,
        overflowX: Overflow.crop,
      }">
      <ClientsTab />
      <MdBody :sty="{align: Align.center}">Deliveries Tab Comming Soon...</MdBody>
      <MdBody :sty="{align: Align.center}">Calculator Tab Comming Soon...</MdBody>
    </B>
  </MdPage>
</template>
