<script setup lang="ts">
import { ref } from 'vue';
// import router from '@/router';
import { pages, usePageStore } from '@/PageStore';
import { CapacitorUpdater } from '@capgo/capacitor-updater';
import B, { Sty, Axis, Align,mdColors, Spacing } from '@/views/miwi-vue/B.vue';
import B00 from '@/views/miwi-vue/B00.vue.js';
import MdPage from '@/views/miwi-vue/MdPage.vue';
import backSvg from '@/assets/arrow_back_FILL1_wght400_GRAD0_opsz48.svg';
import MdAppBar from '@/views/miwi-vue/MdAppBar.vue';
import MdBody from '@/views/miwi-vue/MdBody.vue';
import Icon from '@/views/miwi-vue/Icon.vue';

const { pushPage } = usePageStore();

const versionNumText = ref('0.0.0');
updateVersionNumText();
async function updateVersionNumText() {
  const currentVersionInfo = await CapacitorUpdater.current();
  versionNumText.value = currentVersionInfo.bundle.version;
}
</script>

<template>
  <MdPage>
    <!-- App Bar -->
    <MdAppBar>
      <template #left>
        <Icon @click="pushPage(pages.home)" :size="1.25" :icon="backSvg" alt="Back Icon"/>
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
      <!-- <B :sty="{
        width: -1,
        height: 10,
        background: mdColors.grey,
        axis: Axis.stack,
        align: Align.bottomRight,
      }">
        <B :sty="{ width: 4, height: 4, background: mdColors.blue }" />
        <B :sty="{ width: 2, height: 6, background: mdColors.red }" />
      </B> -->
    </MdBody>
  </MdPage>
</template>