<script setup lang="ts">
import { ref } from "vue";
import { pageTransitions } from "@/Nav";
import Page from "@/views/miwi-vue/Page.vue";
import AppBar from "@/views/miwi-vue/AppBar.vue";
import Body from "@/views/miwi-vue/Body.vue";
import Field from "./miwi-vue/Field.vue";

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
  <Page>
    <AppBar>Client</AppBar>

    <!-- Body -->
    <Body>
      <Field underlined hint="Name" v-model:value="name" />
      <Field underlined hint="Phone" v-model:value="phone" />
      <Field underlined hint="Address" v-model:value="address" />
      <Field underlined hint="Notes" v-model:value="notes" />
    </Body>
  </Page>
</template>
