<script setup lang="ts">
import { ref } from "vue";
import { pageTransitions } from "@/Nav";

const name = ref("");
const clientId = ref("");
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
  <AppBar>Client
    <template #right>
      <SettingsButton />
    </template>
  </AppBar>

  <Body>
    <Card :sty="{ width: `1f` }">
      <Text title>Client Info</Text>
      <Field underlined hint="Name" v-model:value="name" />
      <Field underlined hint="Client ID" v-model:value="clientId" />
      <Field underlined hint="Phone" v-model:value="phone" />
      <Field underlined hint="Address" v-model:value="address" />
      <Field underlined hint="Notes" v-model:value="notes" />
    </Card>
  </Body>
</template>
