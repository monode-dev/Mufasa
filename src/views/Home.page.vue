<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { SplashScreen } from "@capacitor/splash-screen";
import { Align, mdColors } from "@/miwi-md/B.vue";
import { pushPage } from "@/Nav";
import ConfettiExplosion from "vue-confetti-explosion";
import settingsSvg from "@/assets/settings_FILL1_wght400_GRAD0_opsz48.svg";
import SettingsPage from "./Settings.page.vue";
import { count, incCount } from "@/firebase";
/* We do this here instead of at the end of AutoUpdateLoadingScreen
 * so that we never accidentally see the loading splash screen. */
SplashScreen.hide();

const selectedTab = ref(1);

// Confetti
const shouldShowConfetti = ref(false);
const confettiRunCount = ref(0);
watchEffect(async () => {
  confettiRunCount.value++;
  if (count.value % 10 !== 0) return;
  if (confettiRunCount.value < 3) return;
  shouldShowConfetti.value = true;
  await new Promise((resolve) => setTimeout(resolve, 3000));
  shouldShowConfetti.value = false;
});
</script>

<template>
  <AppBar>
    Fuel Calculator
    <template #right>
      <Icon
        @click="pushPage(SettingsPage)"
        :size="1.25"
        :icon="settingsSvg"
        alt="Settings Icon"
      />
    </template>
    <template #bottom>
      <TabButtons
        v-model:selectedTab="selectedTab"
        :labels="[`Clients`, `Deliveries`, `Calculator`]"
      />
    </template>
  </AppBar>

  <!-- Body -->
  <TabView v-model:selectedTab="selectedTab">
    <template #tab0>
      <ClientsTab />
    </template>
    <template #tab1>
      <Body :sty="{ align: Align.center }">
        <B>
          Database Sync Tester
          <component
            :is="ConfettiExplosion"
            v-if="shouldShowConfetti"
            :force="0.75"
            :duration="3000"
            :stageHeight="2000"
            :stageWidth="1500"
          />
        </B>
        <Button @click="incCount"> Count: {{ count }} </Button>
      </Body>
    </template>
    <template #tab2>
      <Body :sty="{ align: Align.center, textColor: mdColors.grey }">
        Calculator Comming Soon...
      </Body>
    </template>
  </TabView>
</template>
