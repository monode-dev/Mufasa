<script setup lang="ts">
import { pageTransitions, pushPage } from "@/Nav";
import { getAppData, listFuelTypes } from "@/AppData";
import { mdColors } from "@/miwi-md/Box/BoxDecoration";
import { ref } from "vue";
import { CapacitorUpdater } from "@capgo/capacitor-updater";
import CreateFuelTypeDialog from "./CreateFuelType.dialog.vue";

function openTkeWebsite() {
  window.open(`https://www.tke.us`, `_blank`);
}

const appData = getAppData();

const appVersion = (() => {
  const appVersion = ref("-.-.-");
  (async () => {
    const currentVersionInfo = await CapacitorUpdater.current();
    appVersion.value = currentVersionInfo.bundle.version;
  })();
  return appVersion;
})();
</script>

<script lang="ts">
export default {
  transitions: pageTransitions.slideUp(),
};
</script>

<template>
  <Page>
    <AppBar>Settings</AppBar>

    <Body>
      <!-- Account -->
      <Card :sty="{ width: `1f` }">
        <Text title>Account</Text>
        <Text hint>Account settings will go here.</Text>
      </Card>

      <!-- Fuel Types -->
      <Card>
        <Row
          :sty="{
            width: `1f`,
            align: $Align.spaceBetween,
          }"
        >
          <Icon icon="plus" :color="mdColors.transparent" :scale="1.25" />
          <Text title>Fuel Types</Text>
          <Icon
            icon="plus"
            :onClick="() => pushPage(CreateFuelTypeDialog)"
            :scale="1.25"
          />
        </Row>
        <Text v-if="appData.fuelTypes.length === 0" hint>No Fuel Types</Text>
        <FuelTypeEntry
          v-for="fuelType in listFuelTypes(appData.fuelTypes)"
          :fuelType="fuelType"
        />
      </Card>
      <!-- Should be pinned to the bottom -->
      <Column>
        <Box :sty="{ height: `1f` }" />
        <Column :sty="{ padBetween: 1 }">
          <Text hint>Version: {{ appVersion }}</Text>
          <Text hint
            ><span>Made by <u @click="openTkeWebsite">tke.us</u></span></Text
          >
        </Column>
        <Box :sty="{ height: 0.5 }" />
      </Column>
    </Body>
  </Page>
</template>
