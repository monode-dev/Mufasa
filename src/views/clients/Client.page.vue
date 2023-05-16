<script setup lang="ts">
import { PropType, watchEffect } from "vue";
import { pageTransitions, popPage } from "@/Nav";
import { Align, mdColors } from "@/miwi-md/Box.vue";
import { Client } from "@/firebase";
import { pushPage } from "@/Nav";
import DeleteClientPage from "@/views/clients/DeleteClient.page.vue";

const props = defineProps({
  client: {
    type: Object as () => Client,
    required: true,
  },
});

watchEffect(() => {
  if (props.client.isDeleted) {
    popPage();
  }
});

const tankNums: number[] = [];
for (let i = 1; i <= 5; i++) {
  tankNums.push(i);
}

function deletePressed() {
  pushPage(DeleteClientPage, { client: props.client });
}
</script>

<script lang="ts">
export default {
  transitions: pageTransitions.slideUp(),
};
</script>

<template>
  <Page>
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
        <DeleteOptionsButton @delete="deletePressed" />
      </Box>
      <!-- title="Client Info" -->
      <Card :sty="{ width: `1f` }">
        <Field
          underlined
          hint="Name"
          icon="account"
          v-model:value="client.name"
          :sty="{ width: `1f` }"
        />
        <Field
          underlined
          hint="Client ID"
          icon="identifier"
          v-model:value="client.clientId"
          :sty="{ width: `1f` }"
        />
        <Field
          underlined
          hint="Phone"
          icon="phone"
          v-model:value="client.phoneNumber"
          :sty="{ width: `1f` }"
        />
        <Field
          underlined
          hint="Address"
          icon="mapMarker"
          v-model:value="client.address"
          :sty="{ width: `1f` }"
        />
        <Field
          underlined
          hint="Notes"
          icon="textBox"
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
  </Page>
</template>
