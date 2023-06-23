<script setup lang="ts">
import { ref } from "vue";

const selectedTab = ref(1);
</script>

<template>
  <Page>
    <!-- We adjust shadow size, because of stacking contexts we can't put the shadow above the body but below the action bar. -->
    <AppBar :sty="{ shadowSize: selectedTab === 0 ? 0 : 1.25 }">
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
        <DeliveriesTab />
      </template>
      <template #tab2>
        <CalculatorsTab />
      </template>
    </TabView>
  </Page>
</template>
