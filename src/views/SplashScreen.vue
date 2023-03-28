<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue';
import B, { Sty, Axis, Align,mdColors, Spacing } from './utils/B.vue';
import { CapacitorUpdater } from '@capgo/capacitor-updater';
import type { BundleInfo } from '@capgo/capacitor-updater';
import logo from '@/assets/logo.png';
import router from '@/router';
const logoWidth = 8;
const logoHeight = logoWidth * 618 / 755;

const shouldShowUpdatingText = ref(false);
getAndApplyPatch();
async function getAndApplyPatch() {
  // Check if there is a patch available
  const latest = await CapacitorUpdater.getLatest();

  // If there is a patch available, download and apply it
  if (latest.url) {
    shouldShowUpdatingText.value = true;

    // Download the latest patch
    const patchData = await CapacitorUpdater.download({
      url: latest.url,
      version: latest.version,
    });

    // Apply the patch
    await CapacitorUpdater.set({ id: patchData.id });
  }

  // Start the app
  router.push('/home');
}
</script>

<template>
  <B :sty="{
    width: `100%`,
    height: `100%`,
    background: mdColors.green,
    align: Align.center,
    spacing: 1,
  }">
    <B :sty="{
      width: logoWidth,
      height: logoHeight,
    }">
      <img style="width: 100%; height: 100%" :src="logo" alt="90% Logo" />
    </B>
    <B v-if="shouldShowUpdatingText"
      :sty="{
        textSize: 1.5,
        textColor: mdColors.white,
      }"
    >
      Updating...
    </B>
  </B>
</template>