<script setup lang="ts">
import { ref } from 'vue';
import router from '@/router';
import { CapacitorUpdater } from '@capgo/capacitor-updater';
import B, { Sty, Axis, Align,mdColors, Spacing } from './utils/B.vue';
import Page from './components/Page.vue';
import backSvg from '@/assets/arrow_back_FILL1_wght400_GRAD0_opsz48.svg';
import MdAppBar from '@/views/components/MdAppBar.vue';
import MdBody from './components/MdBody.vue';
import Icon from './utils/Icon.vue';

const versionNumText = ref('0.0.0');
updateVersionNumText();
async function updateVersionNumText() {
  const currentVersionInfo = await CapacitorUpdater.current();
  versionNumText.value = currentVersionInfo.bundle.version;
}
</script>

<template>
  <Page>
    <!-- App Bar -->
    <MdAppBar>
      <template #left>
        <Icon @click="router.push(`/home`)" :size="1.25" :icon="backSvg" alt="Back Icon"/>
      </template>
      <template #title>
        Settings
      </template>
    </MdAppBar>
    

    <!-- Body -->
    <MdBody>
      <!-- Version Number -->
      <B :sty="{textColor: mdColors.grey}">
        Version: {{ versionNumText }}
      </B>
    </MdBody>
  </Page>
</template>