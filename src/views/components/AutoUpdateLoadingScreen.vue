<script setup lang="ts">
import { mdColors } from "@/miwi-md/Box/BoxDecoration";
import { CapacitorUpdater } from "@capgo/capacitor-updater";
import { SplashScreen } from "@capacitor/splash-screen";
import { pushPage } from "@/Nav";
import { App } from "@capacitor/app";
import HomePage from "@/views/Home.page.vue";
import { exists } from "@/utils";
import { getAppData } from "@/AppData";

// We want to start loading the database immedietly
(async () => {
  getAppData();
})();
// getAppData();
// Prevent tree shaking.
// console.log(Object.keys(appData));

const textSize = 1.25;
let haveCheckedForUpdates = false;
let haveDownloadedUpdate = false;
let appStartRequested = false;

// Single thread app startup so we don't accidentally do it twice
(async () => {
  let haveStartedTheApp = false;
  while (!haveStartedTheApp) {
    if (appStartRequested && !haveStartedTheApp) {
      haveStartedTheApp = true;
      pushPage(HomePage);
    } else {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
})();

// If have not checked for updates after a short bit, then apply the update after start
setTimeout(() => {
  if (!haveCheckedForUpdates) {
    appStartRequested = true;
  }
}, 2 * 1000);
// setTimeout(() => {
//   if (!haveCheckedForUpdates) {
//     appStartRequested = true;
//   }
// }, 6.5 * 1000);
setTimeout(() => {
  if (!haveDownloadedUpdate) {
    appStartRequested = true;
  }
}, 11 * 1000);

// Check for updates;
(async () => {
  try {
    // Check if there is a patch available
    const latest = await CapacitorUpdater.getLatest();
    haveCheckedForUpdates = true;

    // If there is a patch available, download and apply it
    if (exists(latest.url) && latest.url !== ``) {
      SplashScreen.hide();

      // Download the latest patch
      const patchData = await CapacitorUpdater.download({
        url: latest.url,
        version: latest.version,
      });
      haveDownloadedUpdate = true;

      // Apply the update at the right time.
      if (appStartRequested) {
        // Apply the patch on close
        App.addListener("appStateChange", async ({ isActive }) => {
          if (!isActive) {
            // I don't know whether or no we want to await this.
            await CapacitorUpdater.set({ id: patchData.id });
          }
        });
      } else {
        CapacitorUpdater.set({ id: patchData.id });
        // I don't know if this does anything, since CapacitorUpdater.set might refresh the whole app and reload this page.
        appStartRequested = true;
      }
    } else {
      appStartRequested = true;
    }
  } catch (e) {
    console.error(e);
  }
})();
</script>

<template>
  <Page :sty="{ background: mdColors.green, align: $Align.center }">
    <div class="prevent-select">
      <Box
        :sty="{
          align: $Align.center,
          textColor: mdColors.white,
        }"
      >
        <Icon :scale="4" :color="mdColors.white" icon="trayArrowDown" />
        <Box
          :sty="{
            height: textSize,
            scale: textSize,
          }"
          >Updating...</Box
        >
        <!-- <Box :sty="{ height: 2 * textSize }"></Box> -->
      </Box>
    </div>
  </Page>
</template>
