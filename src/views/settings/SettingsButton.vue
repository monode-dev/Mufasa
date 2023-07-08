<script setup lang="ts">
import { pushPage } from "@/Nav";
import SettingsPage from "@/views/settings/Settings.page.vue";
</script>

<template>
  <Icon :onClick="() => pushPage(SettingsPage)" :scale="1.25" icon="cog" />
</template>
