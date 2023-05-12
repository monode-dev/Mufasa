<script setup lang="ts">
import { PropType } from "vue";
import { pageTransitions } from "@/Nav";
import { Align, mdColors } from "@/miwi-md/Box.vue";
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

const tankNums: number[] = [];
for (let i = 1; i <= 5; i++) {
  tankNums.push(i);
}
</script>

<script lang="ts">
export default {
  transitions: pageTransitions.slideUp(),
};
</script>

<template>
  <AppBar
    >Edit Client
    <template #right>
      <SettingsButton />
    </template>
  </AppBar>

  <Body v-if="client.isLoaded">
    <Box
      :sty="{
        width: `1f`,
        axis: $Axis.row,
        spacing: $Spacing.spaceBetween,
        align: $Align.topCenter,
      }"
    >
      <Icon icon="dotsVertical" :color="mdColors.transparent" />
      <Text title>Client Info</Text>
      <DeleteOptionsButton />
    </Box>
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
    <Box>
      <Text title>Tanks</Text>
    </Box>
    <!-- title="Tanks"  -->
    <TankEntry v-for="num in tankNums" :key="num">{{ num }}</TankEntry>
  </Body>
  <Body v-else :sty="{ align: Align.center }">
    <Text hint>Loading...</Text>
  </Body>
</template>
