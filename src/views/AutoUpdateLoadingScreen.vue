<script setup lang="ts">
import { onMounted, Ref, ref } from "vue";
import B, { Sty, Axis, Align, mdColors, Spacing } from "@/views/miwi-vue/B.vue";
import { CapacitorUpdater } from "@capgo/capacitor-updater";
import { SplashScreen } from "@capacitor/splash-screen";
import Page from "@/views/miwi-vue/MdPage.vue";
import updatingIcon from "@/assets/download_FILL1_wght400_GRAD0_opsz48.svg";
import Icon from "@/views/miwi-vue/Icon.vue";
// import router from '@/router';
// import { usePageStore, pages } from '@/PageStore';
// const { pushPage } = usePageStore();
import { pushPage } from "@/Nav";
import HomePage from "./Home.page.vue";
const textSize = 1.25;

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
  // pushPage(pages.home);
  pushPage(HomePage);
}
</script>

<template>
  <Page :sty="{ background: mdColors.green }">
    <div class="prevent-select">
      <B
        :sty="{
          align: Align.center,
        }"
      >
        <Icon
          :size="4"
          :color="mdColors.white"
          :icon="updatingIcon"
          alt="Updating Icon"
        />
        <B
          :sty="{
            height: textSize,
            textSize: textSize,
            textColor: mdColors.white,
          }"
          >Updating...</B
        >
        <B :sty="{ height: 2 * textSize }"></B>
      </B>
    </div>
  </Page>
</template>
