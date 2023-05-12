<script setup lang="ts">
import { pageTransitions } from "@/Nav";
import { appVersion } from "@/AppDetails";

function openTkeWebsite() {
  window.open(`tke.us`, `_blank`);
}
</script>

<script lang="ts">
export default {
  transitions: pageTransitions.slideUp(),
};
</script>

<template>
  <Page>
    <AppBar>Settings</AppBar>

    <Body>
      <Text hint>Version: {{ appVersion }}</Text>
      <!-- <Text hint><span>Made by <u @click="openTkeWebsite">tke.us</u></span></Text> -->
    </Body>
  </Page>
</template>
