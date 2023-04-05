<script setup lang="ts">
import { ComponentPublicInstance, onMounted, ref } from 'vue';
import { SplashScreen } from '@capacitor/splash-screen';
import B, { Sty, Axis, Align,mdColors, Spacing, Overflow } from '@/views/miwi-vue/B.vue';
import MdPage from '@/views/miwi-vue/MdPage.vue';
import { usePageStore, pages } from '@/PageStore';
import ConfettiExplosion from "vue-confetti-explosion";
import {gsap} from "gsap";
import settingsSvg from '@/assets/settings_FILL1_wght400_GRAD0_opsz48.svg';
import MdAppBar from '@/views/miwi-vue/MdAppBar.vue';
import MdBody from '@/views/miwi-vue/MdBody.vue';
import ClientsTab from './clients/ClientsTab.vue';
import Icon from '@/views/miwi-vue/Icon.vue';
import Button from './miwi-vue/Button.vue';
import { count, incCount } from '@/firebase';
/* We do this here instead of at the end of AutoUpdateLoadingScreen
 * so that we never accidentally see the loading splash screen. */
SplashScreen.hide();

const { pushPage } = usePageStore();
// const { count, incCount } = useCountStore();

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

// Swipe gesture
onMounted(() => {
  let swipeStartTime = 0;
  let swipeStartX = 0;
  let swipeStartY = 0;
  let lastSwipeX = 0;
  let lastSwipeY = 0;
  tabBodiesParent.value?.$el.addEventListener('touchstart', (e: TouchEvent) => {
    const touch = e.touches[0];
    swipeStartX = touch.clientX;
    swipeStartY = touch.clientY;
    swipeStartTime = Date.now();
  });
  tabBodiesParent.value?.$el.addEventListener('touchmove', (e: TouchEvent) => {
    const touch = e.touches[0];
    lastSwipeX = touch.clientX;
    lastSwipeY = touch.clientY;
  });
  tabBodiesParent.value?.$el.addEventListener('touchend', (e: TouchEvent) => {
    const deltaX = lastSwipeX - swipeStartX;
    const deltaY = lastSwipeY - swipeStartY;
    const deltaTime = Date.now() - swipeStartTime;
    const velocityX = deltaX / deltaTime;
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 25 && Math.abs(velocityX) > 0.2) {
      // e.preventDefault();
      if (deltaX > 0) {
        selectTab(Math.max(0, selectedTab.value - 1));
      } else {
        selectTab(Math.min(2, selectedTab.value + 1));
      }
    }
  });
});

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

// Confetti
const shouldShowConfetti = ref(false);
async function explodeConfetti() {
  // About to roll over
  if (count.value % 10 !== 9) return;
  shouldShowConfetti.value = true;
  await new Promise(resolve => setTimeout(resolve, 3000));
  shouldShowConfetti.value = false;
}
</script>

<template>
  <MdPage>
    <!-- App Bar -->
    <MdAppBar>
      <template #title>
        Fuel Calculator
      </template>
      <template #right>
        <Icon @click="pushPage(pages.settings)" :size="1.25" :icon="settingsSvg" alt="Settings Icon"/>
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
      <MdBody :sty="{align: Align.center}">
        <B>
          Deliveries Tab Comming Soon...
          <component
            :is="ConfettiExplosion"
            v-if="shouldShowConfetti"
            :force="0.75"
            :duration="3000"
            :stageHeight="2000"
            :stageWidth="1500"/>
        </B>
        <Button @click="() => { incCount(); explodeConfetti(); }">
          Count: {{count}}
        </Button>
      </MdBody>
      <MdBody :sty="{align: Align.center}">Calculator Tab Comming Soon...</MdBody>
    </B>
  </MdPage>
</template>
