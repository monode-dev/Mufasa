<script setup lang="ts">
import { mdColors } from "@/miwi-md/Box.vue";
import { CapacitorUpdater } from "@capgo/capacitor-updater";
import { SplashScreen } from "@capacitor/splash-screen";
import { pushPage, useNav } from "@/Nav";
import { App } from "@capacitor/app";
import HomePage from "@/views/Home.page.vue";
import { exists } from "@/utils";
import { ref } from "vue";
const textSize = 1.25;
let haveCheckedForUpdates = false;
let haveDownloadedUpdate = false;
let haveStartedTheApp = false;
let appShouldBeRunning = false;
// Single thread app startup so we don't accidentally do it twice
(async () => {
  while (!haveStartedTheApp) {
    if (appShouldBeRunning && !haveStartedTheApp) {
      haveStartedTheApp = true;
      pushPage(HomePage);
    } else {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
})();

// Check for updates
getAndApplyPatch();
async function getAndApplyPatch() {
  // If have not checked for updates after a short bit, then apply the update after start
  setTimeout(() => {
    if (!haveStartedTheApp && !haveCheckedForUpdates) {
      appShouldBeRunning = true;
    }
  }, 1500);
  setTimeout(() => {
    if (!haveStartedTheApp && !haveDownloadedUpdate) {
      appShouldBeRunning = true;
    }
  }, 8000);

  try {
    // Check if there is a patch available
    const latest = await CapacitorUpdater.getLatest();
    haveCheckedForUpdates = true;

    // If there is a patch available, download and apply it
    if (exists(latest.url) && latest.url !== ``) {
      SplashScreen.hide(); //await SplashScreen.hide();

      // Download the latest patch
      const patchData = await CapacitorUpdater.download({
        url: latest.url,
        version: latest.version,
      });
      haveDownloadedUpdate = true;

      if (!haveStartedTheApp) {
        CapacitorUpdater.set({ id: patchData.id });
        appShouldBeRunning = true;
      } else {
        // Apply the patch on close
        App.addListener("appStateChange", async ({ isActive }) => {
          if (!isActive) {
            await CapacitorUpdater.set({ id: patchData.id });
          }
        });
      }
    } else {
      appShouldBeRunning = true;
    }
  } catch (e) {
    console.error(e);
  }
}
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
