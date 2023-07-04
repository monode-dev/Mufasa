<script setup lang="ts">
import { PropType, watchEffect } from "vue";
import { pageTransitions, popPage } from "@/Nav";
import { mdColors } from "@/miwi-md/Box/BoxDecoration";
import { Client } from "@/AppData";
import { pushPage } from "@/Nav";
import { FuelType, getAppData } from "@/AppData";
import DeleteDialog from "../components/DeleteDialog.vue";
import { orderDocs } from "@/utils";
// const appData = getAppData();

const props = defineProps({
  client: {
    type: Object as PropType<Client>,
    required: true,
  },
});

watchEffect(() => {
  if (props.client.isDeleted) {
    popPage();
  }
});

function deletePressed() {
  pushPage(DeleteDialog, {
    obj: props.client,
    message: `Are you sure you want to permanently delete "${
      props.client.clientId ?? ``
    } ${props.client.clientId && props.client.name ? ` - ` : ``} ${
      props.client.name ?? ``
    }"?`,
  });
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
      ><Text title>Edit Client</Text>
      <template #right>
        <SettingsButton />
      </template>
    </AppBar>

    <Body v-if="client.isLoaded">
      <Row
        :sty="{
          width: `1f`,
          spacing: $Spacing.spaceBetween,
          align: $Align.topCenter,
        }"
      >
        <Icon icon="dotsVertical" :color="mdColors.transparent" />
        <Text title>Client Info</Text>
        <DeleteOptionsButton @delete="deletePressed" />
      </Row>
      <Card :sty="{ width: `1f` }">
        <ClientFields
          v-model:name="client.name"
          v-model:clientId="client.clientId"
          v-model:phoneNumber="client.phoneNumber"
          v-model:address="client.address"
          v-model:notes="client.notes"
        />
      </Card>
      <Box />
      <Row
        :sty="{
          width: `1f`,
          spacing: $Spacing.spaceBetween,
        }"
      >
        <Box :sty="{ width: 1.75 }" />
        <Text title>Tanks</Text>
        <Box :sty="{ width: 1.75, align: $Align.centerLeft }">
          <Icon icon="plus" :scale="1.25" @click.stop="client.tanks?.add({})" />
        </Box>
      </Row>
      <TankEntry
        v-for="(tank, index) in orderDocs(
          client.tanks ?? [],
          (x) => x.creationTimePosix,
        )"
        :key="index"
        :tank="tank"
        >{{ index + 1 }}</TankEntry
      >
    </Body>
    <Body v-else :sty="{ align: $Align.center }">
      <Text hint>Loading...</Text>
    </Body>
  </Page>
</template>
