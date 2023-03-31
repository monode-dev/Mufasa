<script setup lang="ts">
import { CapacitorUpdater } from '@capgo/capacitor-updater';
import { onMounted, Ref, ref } from 'vue';
import B, { Sty, Axis, Align,mdColors, Spacing } from './utils/B.vue';
import Page from './components/Page.vue';
import router from '@/router';
import {gsap} from "gsap";
import settingsSvg from '@/assets/settings_FILL1_wght400_GRAD0_opsz48.svg';
import ClientEntry from './clients/ClientEntry.vue';
import MdAppBar from '@/views/components/MdAppBar.vue';
import { SplashScreen } from '@capacitor/splash-screen';
import Icon from './utils/Icon.vue';
SplashScreen.hide();

const tab0Ref = ref<HTMLElement | null>(null);
const tab1Ref = ref<HTMLElement | null>(null);
const tab2Ref = ref<HTMLElement | null>(null);
const tabUnderline = ref<HTMLElement | null>(null);
const selectedTab = ref(1);
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
    duration: 0.15,
    x: newUnderlinePosition,
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
  <Page>
    <B :sty="{
      width: `1f`,
      height: `1f`,
      axis: Axis.column,
      align: Align.topCenter,
      background: `#f9fafdff`,
    }">
      <!-- App Bar -->
      <!--@click="router.push('/home/settings')"-->
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
            <div ref="tabUnderline">
              <B :sty="tabUnderlineSty" />
            </div>
            <B :sty="tabUnderlineFillerSty" />
          </B>
        </template>
      </MdAppBar>

      <!-- Body -->
      <B :sty="{
        width: `1f`,
        height: `1f`,
        axis: Axis.column,
        align: Align.topCenter,
        textColor: mdColors.black,
        textSize: 1,
        padding: 1,
        spacing: 1,
        overflowY: `scroll`,
      }">
        <ClientEntry name="A&P Logging"></ClientEntry>
        <ClientEntry name="Aaron Hohman"></ClientEntry>
        <ClientEntry name="Abigail Rodgers"></ClientEntry>
        <ClientEntry name="Advanced Tree Service"></ClientEntry>
        <ClientEntry name="Affordable Lawn Care"></ClientEntry>
        <ClientEntry name="Airport Fire Station"></ClientEntry>
        <ClientEntry name="Alan Battenfield"></ClientEntry>
        <ClientEntry name="Alanna Keneshiro"></ClientEntry>
        <ClientEntry name="Alice Conner"></ClientEntry>
        <ClientEntry name="All Creatures Animal Hospital"></ClientEntry>
        <ClientEntry name="All In One Rental"></ClientEntry>
        <ClientEntry name="Alyshia Peck"></ClientEntry>
        <ClientEntry name="Amy's Kitchen"></ClientEntry>
        <ClientEntry name="Ancheta Holdings"></ClientEntry>
        <ClientEntry name="Andrew Barnes"></ClientEntry>
        <ClientEntry name="Andrew Watson"></ClientEntry>
        <ClientEntry name="Andy Pollack"></ClientEntry>
        <ClientEntry name="Anthony Molle"></ClientEntry>
        <ClientEntry name="Applegate Store"></ClientEntry>
        <ClientEntry name="Art of Plumbing"></ClientEntry>
        <ClientEntry name="Asante"></ClientEntry>
        <ClientEntry name="Ashland Bus Shop"></ClientEntry>
        <ClientEntry name="Ashland Parks & Recreation"></ClientEntry>
        <ClientEntry name="Aurupa Spring Ranch"></ClientEntry>
        <ClientEntry name="Bart Cunningham"></ClientEntry>
        <ClientEntry name="Bart Masciarelli"></ClientEntry>
        <ClientEntry name="BBMD-Medford, Boise Phoenix"></ClientEntry>
        <ClientEntry name="Bear Creek Orchard"></ClientEntry>
      </B>
    </B>
  </Page>
</template>
