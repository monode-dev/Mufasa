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

      <!-- Upload -->
      <!-- <Row
        :sty="{
          padBetween: 1,
        }"
      >
        <Button
          :onClick="clearFirestore"
          :sty="{
            width: `1f`,
          }"
          >Delete All</Button
        >
        <Button
          :onClick="upload"
          :sty="{
            width: `1f`,
          }"
          >Upload</Button
        >
      </Row> -->

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
          <Text hint>{{
            appVersion.length > 0
              ? `Version: ${appVersion}`
              : `Mode: ${modeText}`
          }}</Text>
          <Text hint
            ><span>Made by <u @click="openTkeWebsite">tke.us</u></span></Text
          >
        </Column>
        <Box :sty="{ height: 0.5 }" />
      </Column>
    </Body>
  </Page>
</template>

<script setup lang="ts">
import { pageTransitions, pushPage } from "@/Nav";
import { FuelType, getAppData, getClientLabel, listFuelTypes } from "@/AppData";
import { mdColors } from "@/miwi-md/Box/BoxDecoration";
import { computed, ref } from "vue";
import { CapacitorUpdater } from "@capgo/capacitor-updater";
import CreateFuelTypeDialog from "./CreateFuelType.dialog.vue";
import { exists } from "@/utils";

function openTkeWebsite() {
  window.open(`https://www.tke.us`, `_blank`);
}

const appData = getAppData();

const modeText = import.meta.env.PROD ? `Production` : `Development`;
const appVersion = (() => {
  const appVersion = ref(``);
  (async () => {
    const currentVersionInfo = await CapacitorUpdater.current();
    appVersion.value = currentVersionInfo.bundle.version;
  })();
  return appVersion;
})();

// function clearFirestore() {
//   [...appData.deliveries].forEach((delivery) => {
//     delivery.deleteDoc();
//   });
//   [...appData.clients].forEach((client) => {
//     [...(client.tanks ?? [])].forEach((tank) => {
//       tank.deleteDoc();
//     });
//     client.deleteDoc();
//   });
//   [...appData.fuelTypes].forEach((fuelType) => {
//     fuelType.deleteDoc();
//   });
// }
// function upload() {
//   (async () => {
//     const data = getData();
//     let uploadCount = 0;
//     function incUploadCount() {
//       uploadCount++;
//       if (uploadCount % 25 === 0) {
//         console.log(`Uploaded ${uploadCount} documents`);
//       }
//     }

//     // Upload Fuel Types
//     const fuelTypeDocs: { [key: string]: FuelType } = {};
//     for (const fuelType of Object.values(data.fuelTypes)) {
//       fuelTypeDocs[fuelType.name] = await appData.fuelTypes.add({
//         ...fuelType,
//         rate: 5,
//       });
//       incUploadCount();
//     }

//     // Upload Clients
//     for (const client of Object.values(data.clients)) {
//       const clientDoc = await appData.clients.add(client.init);
//       incUploadCount();
//       while (!clientDoc.isLoaded) {
//         await new Promise((resolve) => setTimeout(resolve, 100));
//       }
//       for (const tank of client.tanks) {
//         const fuelTypeName = tank.fuelTypeName;
//         delete (tank as any).fuelTypeName;
//         await clientDoc.tanks!.add({
//           ...tank,
//           fuelType: fuelTypeDocs[fuelTypeName],
//         });
//         incUploadCount();
//       }
//       for (const delivery of client.deliveries) {
//         await appData.deliveries!.add({
//           ...delivery,
//           upcomingExistingClient: clientDoc,
//           deliveryLabel: getClientLabel(clientDoc),
//           fuelType: fuelTypeDocs[delivery.completedFuelTypeName],
//         });
//         incUploadCount();
//       }
//     }
//   })();
//   function getData(): {
//     fuelTypes: {
//       [key: string]: {
//         name: string;
//         rate: number;
//         createdPosix: number;
//       };
//     };
//     clients: {
//       [key: string]: {
//         init: {
//           name: string;
//           clientId: string;
//           phoneNumber: string;
//           address: string;
//           notes: string;
//         };
//         deliveries: {
//           deliveryFormat: `completed`;
//           creationTimePosix: number;
//           quantity: number;
//           completedTimePosix: number;
//           completedFuelTypeName: string;
//           completedRate: number;
//         }[];
//         tanks: {
//           fuelTypeName: string;
//           creationTimePosix: number;
//           shape: `horizontalCylinder` | `rectangle` | `oval` | `truckBedTank`;
//           length?: number;
//           diameter?: number;
//           depth?: number;
//           height?: number;
//           fullHeight?: number;
//           squareHeight?: number;
//           fullDepth?: number;
//           wideHeight?: number;
//           topDepth?: number;
//         }[];
//       };
//     };
//   } {
//     return {};
//   }
// }
</script>
