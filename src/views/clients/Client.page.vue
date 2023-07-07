<script setup lang="ts">
import { PropType, watchEffect } from "vue";
import { pageTransitions, popPage } from "@/Nav";
import { mdColors } from "@/miwi-md/Box/BoxDecoration";
import { Client, listTanks } from "@/AppData";
import { pushPage } from "@/Nav";
import DeleteDialog from "../components/DeleteDialog.vue";
import CreateTankDialog from "../tanks/CreateTank.dialog.vue";

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
          alignX: $Align.spaceBetween,
          alignY: $Align.start,
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
          align: $Align.spaceBetween,
        }"
      >
        <Box :sty="{ width: 1.75 }" />
        <Text title>Tanks</Text>
        <Box :sty="{ width: 1.75, align: $Align.centerLeft }">
          <Icon
            icon="plus"
            :scale="1.25"
            @click.stop="pushPage(CreateTankDialog, { client })"
          />
        </Box>
      </Row>
      <TankEntry
        v-for="(tank, index) in listTanks(client.tanks)"
        :key="tank._firestoreRef?.path ?? index"
        :tank="tank"
      />
    </Body>
    <Body v-else :sty="{ align: $Align.center }">
      <Text hint>Loading...</Text>
    </Body>
  </Page>
</template>
