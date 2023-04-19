<script setup lang="ts">
import { pageTransitions } from "@/Nav";
import { appVersion } from "@/AppDetails";
// import Mufasa from "@/Mufasa";
</script>

<script lang="ts">
export default {
  transitions: pageTransitions.slideUp(),
};
</script>

<template>
  <AppBar>Settings</AppBar>
  <Body>
    <Text hint>Version: {{ appVersion }}</Text>
  </Body>
</template>
