<script setup lang="ts">
import { pageTransitions } from "@/Nav";
import { appVersion } from "@/AppDetails";
import { ref } from "vue";
import { LOADING, DELETED, useFirestore } from "@/firebase";
import { mdColors } from "@/miwi-md/Box.vue";

function openTkeWebsite() {
  window.open(`tke.us`, `_blank`);
}

const model = useFirestore();
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
            spacing: $Spacing.spaceBetween,
          }"
        >
          <Icon icon="plus" :color="mdColors.transparent" :scale="1.25" />
          <Text title>Fuel Types</Text>
          <Icon
            icon="plus"
            @click.stop="model.createFuelType()"
            :scale="1.25"
          />
        </Row>
        <FuelTypeEntry
          v-for="fuelType in [...model.fuelTypes].sort((a, b) => {
            //
            if (!a.isLoaded) {
              return 1;
            } else if (!b.isLoaded) {
              return -1;
            } else if (
              a.createdPosix === LOADING ||
              a.createdPosix === DELETED
            ) {
              return -1;
            } else if (
              b.createdPosix === LOADING ||
              b.createdPosix === DELETED
            ) {
              return 1;
            } else {
              return b.createdPosix - a.createdPosix;
            }
          })"
          :fuelType="fuelType"
        />
      </Card>
      <!-- Should be pinned to the bottom -->
      <Column>
        <Box :sty="{ height: `1f` }" />
        <Column :sty="{ spacing: 1 }">
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
