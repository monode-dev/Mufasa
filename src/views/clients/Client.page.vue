<script setup lang="ts">
import { PropType } from "vue";
import { pageTransitions } from "@/Nav";
import { Align } from "@/miwi-md/Box.vue";
import { Client } from "@/firebase";

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
    <Text title>Client Info</Text>
    <!-- title="Client Info" -->
    <Card :sty="{ width: `1f` }">
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
    <Box />
    <Text title>Tanks</Text>
    <!-- title="Tanks"  -->
    <Card :sty="{ width: `1f`, align: Align.centerLeft }">
      <Text>Tank A</Text>
    </Card>
    <Card :sty="{ width: `1f`, align: Align.centerLeft }">
      <Text>Tank B</Text>
    </Card>
    <Card :sty="{ width: `1f`, align: Align.centerLeft }">
      <Text>Tank C</Text>
    </Card>
    <Card :sty="{ width: `1f`, align: Align.centerLeft }">
      <Text>Tank D</Text>
    </Card>
    <Card :sty="{ width: `1f`, align: Align.centerLeft }">
      <Text>Tank E</Text>
    </Card>
    <Card :sty="{ width: `1f`, align: Align.centerLeft }">
      <Text>Tank F</Text>
    </Card>
    <Card :sty="{ width: `1f`, align: Align.centerLeft }">
      <Text>Tank G</Text>
    </Card>
    <Card :sty="{ width: `1f`, align: Align.centerLeft }">
      <Text>Tank H</Text>
    </Card>
    <Card :sty="{ width: `1f`, align: Align.centerLeft }">
      <Text>Tank I</Text>
    </Card>
    <Card :sty="{ width: `1f`, align: Align.centerLeft }">
      <Text>Tank J</Text>
    </Card>
    <Card :sty="{ width: `1f`, align: Align.centerLeft }">
      <Text>Tank K</Text>
    </Card>
  </Body>
  <Body v-else :sty="{ align: Align.center }">
    <Text hint>Loading...</Text>
  </Body>
</template>
