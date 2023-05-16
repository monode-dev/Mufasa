<script setup lang="ts">
import { mdColors } from "@/miwi-md/Box.vue";
import { CapacitorUpdater } from "@capgo/capacitor-updater";
import { SplashScreen } from "@capacitor/splash-screen";
import { pushPage, useNav } from "@/Nav";
import HomePage from "@/views/Home.page.vue";
const textSize = 1.25;

// Calculate notchHeight
// const nav = useNav();
// nav.notchHeight = (() => {
//   const bodyStyle = getComputedStyle(document.body);
//   return bodyStyle.paddingTop;
// })();

// Check for updates
getAndApplyPatch();
async function getAndApplyPatch() {
  try {
    // Check if there is a patch available
    const latest = await CapacitorUpdater.getLatest();

    // If there is a patch available, download and apply it
    if (latest.url) {
      await SplashScreen.hide();

      // Download the latest patch
      const patchData = await CapacitorUpdater.download({
        url: latest.url,
        version: latest.version,
      });

      // Apply the patch
      await CapacitorUpdater.set({ id: patchData.id });
    }
  } catch (e) {
    console.error(e);
  }

  // Start the app
  pushPage(HomePage);
}
</script>

<template>
  <Page :sty="{ background: mdColors.green }">
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
