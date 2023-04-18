<script setup lang="ts">
import { ref } from "vue";
import { useNav } from "@/Nav";
import { CapacitorUpdater } from "@capgo/capacitor-updater";
import B, { mdColors } from "@/views/miwi-vue/B.vue";
import MdPage from "@/views/miwi-vue/MdPage.vue";
import backSvg from "@/assets/arrow_back_FILL1_wght400_GRAD0_opsz48.svg";
import MdAppBar from "@/views/miwi-vue/MdAppBar.vue";
import MdBody from "@/views/miwi-vue/MdBody.vue";
import Icon from "@/views/miwi-vue/Icon.vue";

const nav = useNav();

const versionNumText = ref("0.0.0");
updateVersionNumText();
async function updateVersionNumText() {
  const currentVersionInfo = await CapacitorUpdater.current();
  versionNumText.value = currentVersionInfo.bundle.version;
}
</script>

<script lang="ts">
import { pageTransitions } from "@/PageTransitions";
export const transitions = pageTransitions.slideUp();
</script>

<template>
  <MdPage>
    <!-- App Bar -->
    <MdAppBar>
      <template #left>
        <Icon
          @click="nav.popPage()"
          :size="1.25"
          :icon="backSvg"
          alt="Back Icon"
        />
      </template>
      <template #title> Settings </template>
    </MdAppBar>

    <!-- Body -->
    <MdBody>
      <!-- Version Number -->
      <B :sty="{ textColor: mdColors.grey }"> Version: {{ versionNumText }} </B>
    </MdBody>
  </MdPage>
</template>
