<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue';
import B, { Sty, Axis, Align,mdColors, Spacing } from './utils/B.vue';
import { CapacitorUpdater } from '@capgo/capacitor-updater';
import logo from '@/assets/logo.png';
import router from '@/router';
const logoWidth = 5;
const logoHeight = logoWidth * 618 / 755;

const textSize = 1.5;
const updatingText = ref("");
getAndApplyPatch();
async function getAndApplyPatch() {
  // Check if there is a patch available
  const latest = await CapacitorUpdater.getLatest();

  // If there is a patch available, download and apply it
  if (latest.url) {
    updatingText.value = "Updating...";

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
  <B :sty="{height: textSize}"></B>
    <B :sty="{
      width: logoWidth,
      height: logoHeight,
    }">
      <img style="width: 100%; height: 100%" :src="logo" alt="90% Logo" />
    </B>
    <B
      :sty="{
        height: textSize,
        textSize: textSize,
        textColor: mdColors.white,
      }"
    >
    {{updatingText}}
    </B>
  </B>
</template>