<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue';
import B, { Sty, Axis, Align,mdColors, Spacing } from './utils/B.vue';
import { CapacitorUpdater } from '@capgo/capacitor-updater';
import { SplashScreen } from '@capacitor/splash-screen';
import Viewport from './components/Page.vue';
import updatingIcon from '@/assets/download_FILL1_wght400_GRAD0_opsz48.svg';
import router from '@/router';
const logoWidth = 4;

const textSize = 1.25;
const updatingText = ref("Updating...");
getAndApplyPatch();
async function getAndApplyPatch() {
  // Check if there is a patch available
  const latest = await CapacitorUpdater.getLatest();

  // If there is a patch available, download and apply it
  if (latest.url) {
    await SplashScreen.hide();
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
  //router.push('/home');
}
</script>

<template>
  <Viewport>
    <B :sty="{
      width: `1f`,
      height: `1f`,
      background: mdColors.green,
      align: Align.center,
      spacing: 0.5,
    }">
      <div class="prevent-select">
        <!--<B :sty="{height: textSize}"></B>-->
        <B :sty="{
          width: logoWidth,
          height: logoWidth,
        }">
          <img style="width: 100%; height: 100%" :src="updatingIcon" alt="Updating Icon" />
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
        <B :sty="{height: textSize}"></B>
      </div>
    </B>
  </Viewport>
</template>