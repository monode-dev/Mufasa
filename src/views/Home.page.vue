<script setup lang="ts">
import { ref } from "vue";
import { mdColors } from "@/miwi-md/Box.vue";

const selectedTab = ref(1);
</script>

<template>
  <Page>
    <AppBar>
      Fuel Calculator
      <template #right>
        <SettingsButton />
      </template>
      <template #bottom>
        <TabButtons
          v-model:selectedTab="selectedTab"
          :labels="[`Clients`, `Deliveries`, `Calculators`]"
        />
      </template>
    </AppBar>

    <!-- Body -->
    <TabView v-model:selectedTab="selectedTab">
      <template #tab0>
        <ClientsTab />
      </template>
      <template #tab1>
        <ConfettiTab />
      </template>
      <template #tab2>
        <Body :sty="{ align: $Align.center }">
          <Text hint>Calculator Comming Soon...</Text>
        </Body>
      </template>
    </TabView>
  </Page>
</template>
