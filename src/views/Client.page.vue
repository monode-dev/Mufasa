<script setup lang="ts">
import { ref } from "vue";
import { useNav, pageTransitions } from "@/Nav";
import { CapacitorUpdater } from "@capgo/capacitor-updater";
import B, { mdColors } from "@/views/miwi-vue/B.vue";
import MdPage from "@/views/miwi-vue/MdPage.vue";
import backSvg from "@/assets/arrow_back_FILL1_wght400_GRAD0_opsz48.svg";
import MdAppBar from "@/views/miwi-vue/MdAppBar.vue";
import MdBody from "@/views/miwi-vue/MdBody.vue";
import Icon from "@/views/miwi-vue/Icon.vue";
import Field from "./miwi-vue/Field.vue";

const nav = useNav();

const versionNumText = ref("0.0.0");
updateVersionNumText();
async function updateVersionNumText() {
  const currentVersionInfo = await CapacitorUpdater.current();
  versionNumText.value = currentVersionInfo.bundle.version;
}

const name = ref("");
const phone = ref("");
const address = ref("");
const notes = ref("");
</script>

<script lang="ts">
export default {
  transitions: pageTransitions.slideUp(),
};
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
      <template #title> Client </template>
    </MdAppBar>

    <!-- Body -->
    <MdBody>
      <Field underlined hint="Name" v-model:value="name" />
      <Field underlined hint="Phone" v-model:value="phone" />
      <Field underlined hint="Address" v-model:value="address" />
      <Field underlined hint="Notes" v-model:value="notes" />
    </MdBody>
  </MdPage>
</template>
