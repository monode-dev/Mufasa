<script setup lang="ts">
import { mdColors } from "@/miwi-md/Box/BoxDecoration";
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

// Check for updates
getAndApplyPatch();
async function getAndApplyPatch() {
  // If have not checked for updates after a short bit, then apply the update after start
  setTimeout(() => {
    if (!appStartRequested && !haveCheckedForUpdates) {
      appStartRequested = true;
    }
  }, 3 * 1000);
  setTimeout(() => {
    if (!appStartRequested && !haveDownloadedUpdate) {
      appStartRequested = true;
    }
  }, 10 * 1000);

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

      if (!appStartRequested) {
        CapacitorUpdater.set({ id: patchData.id });
        // I don't know if this does anything, since CapacitorUpdater.set might refresh the whole app and reload this page.
        appStartRequested = true;
      } else {
        // Apply the patch on close
        App.addListener("appStateChange", async ({ isActive }) => {
          if (!isActive) {
            await CapacitorUpdater.set({ id: patchData.id });
          }
        });
      }
    } else {
      appStartRequested = true;
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
