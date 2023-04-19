<script setup lang="ts">
import { pageTransitions } from "@/Nav";
import B, { mdColors } from "@/views/miwi-vue/B.vue";
import Page from "@/views/miwi-vue/Page.vue";
import AppBar from "@/views/miwi-vue/AppBar.vue";
import Body from "@/views/miwi-vue/Body.vue";
import { appVersion } from "@/AppDetails";
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
      <!-- <Text preset="hint">Version: {{ appVersion }}</Text> -->
      <B :sty="{ textColor: mdColors.grey }"> Version: {{ appVersion }} </B>
    </Body>
  </Page>
</template>
