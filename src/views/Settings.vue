<script setup lang="ts">
import { ref } from 'vue';
import router from '@/router';
import { CapacitorUpdater } from '@capgo/capacitor-updater';
import B, { Sty, Axis, Align,mdColors, Spacing } from './utils/B.vue';
import Page from './components/Page.vue';
import backSvg from '@/assets/arrow_back_FILL1_wght400_GRAD0_opsz48.svg';
import MdAppBar from '@/views/components/MdAppBar.vue';

const settingsBoxSty = {
  width: 1.25,
  height: 1.25,
};

const versionNumText = ref('0.0.0');
updateVersionNumText();
async function updateVersionNumText() {
  const currentVersionInfo = await CapacitorUpdater.current();
  versionNumText.value = currentVersionInfo.bundle.version;
}
</script>

<template>
  <Page>
    <B :sty="{
      width: `1f`,
      height: `1f`,
      axis: Axis.column,
      align: Align.topCenter,
      background: `#f9fafdff`,
    }">
      <!-- App Bar -->
      <MdAppBar>
        <template #left>
          <router-link to="/home">
              <B :sty="settingsBoxSty">
                <img style="width: 100%; height: 100%" :src="backSvg" alt="Settings Button" />
              </B>
            </router-link>
        </template>
        <template #title>
          Settings
        </template>
      </MdAppBar>
      

      <!-- Body -->
      <B :sty="{
        width: `1f`,
        height: `1f`,
        axis: Axis.column,
        align: Align.topCenter,
        padding: 1,
        spacing: 1,
      }">
        <!-- Version Number -->
        <B :sty="{
          textColor: mdColors.grey,
          textSize: 1,
        }">
          Version: {{ versionNumText }}
        </B>
      </B>
    </B>
  </Page>
</template>