<script setup lang="ts">
import { PropType } from "vue";
import { pageTransitions } from "@/Nav";
import { Client } from "@/firebase";
import { Align } from "@/miwi-md/Box.vue";

const props = defineProps({
  client: {
    type: Object as PropType<Client>,
    // required: true,
    default: {
      name: "",
      clientId: "",
      phoneNumber: "",
      address: "",
      notes: "",
    },
  },
});
</script>

<script lang="ts">
export default {
  transitions: pageTransitions.slideUp(),
};
</script>

<template>
  <AppBar
    >Client
    <template #right>
      <SettingsButton />
    </template>
  </AppBar>

  <Body v-if="client.isLoaded">
    <Card title="Client Info" :sty="{ width: `1f` }">
      <Field
        underlined
        hint="Name"
        v-model:value="client.name"
        :sty="{ width: `1f` }"
      />
      <Field
        underlined
        hint="Client ID"
        v-model:value="client.clientId"
        :sty="{ width: `1f` }"
      />
      <Field
        underlined
        hint="Phone"
        v-model:value="client.phoneNumber"
        :sty="{ width: `1f` }"
      />
      <Field
        underlined
        hint="Address"
        v-model:value="client.address"
        :sty="{ width: `1f` }"
      />
      <Field
        underlined
        hint="Notes"
        v-model:value="client.notes"
        :sty="{ width: `1f` }"
      />
    </Card>
    <Card title="Tanks" :sty="{ width: `1f` }">
      <Text hint>Tanks coming soon.</Text>
    </Card>
    <Card title="Deliveries" :sty="{ width: `1f` }">
      <Text hint>Deliveries coming soon.</Text>
    </Card>
  </Body>
  <Body v-else :sty="{ align: Align.center }">
    <Text hint>Loading...</Text>
  </Body>
</template>
