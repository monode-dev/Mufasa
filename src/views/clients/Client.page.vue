<script setup lang="ts">
import { PropType, watchEffect } from "vue";
import { pageTransitions, popPage } from "@/Nav";
import { Align, mdColors } from "@/miwi-md/Box.vue";
import { Client } from "@/AppData";
import { pushPage } from "@/Nav";
import DeleteClientPage from "@/views/clients/DeleteClient.dialog.vue";
import { FuelType, getAppData } from "@/AppData";
const appData = getAppData();

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

watchEffect(() => {
  console.log(props.client.tanks?.length);
});
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
        <DropDown
          v-if="client.fuelType?.isLoaded"
          label="Fuel"
          v-model:selected="client.fuelType"
          :options="[
            { label: `None`, doc: null },
            ...appData.fuelTypes
              .filter((x) => x.name !== ``)
              .map((x) => {
                return { label: x.name, doc: x };
              }),
          ]"
        />
      </Card>
      <Box />
      <Row
        :sty="{
          width: `1f`,
          spacing: $Spacing.spaceBetween,
          align: $Align.topCenter,
        }"
      >
        <Box :sty="{ width: 1.75 }" />
        <Text title>Tanks</Text>
        <Box :sty="{ width: 1.75, align: $Align.centerLeft }">
          <Icon icon="plus" :scale="1.25" @click.stop="client.tanks?.add({})" />
        </Box>
      </Row>
      <TankEntry
        v-for="(tank, index) in client.tanks"
        :key="index"
        :tank="tank"
        >{{ index + 1 }}</TankEntry
      >
    </Body>
    <Body v-else :sty="{ align: Align.center }">
      <Text hint>Loading...</Text>
    </Body>
  </Page>
</template>
