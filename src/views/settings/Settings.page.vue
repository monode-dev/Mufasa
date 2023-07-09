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
      <Row
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
      </Row>

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

function clearFirestore() {
  [...appData.deliveries].forEach((delivery) => {
    delivery.deleteDoc();
  });
  [...appData.clients].forEach((client) => {
    [...(client.tanks ?? [])].forEach((tank) => {
      tank.deleteDoc();
    });
    client.deleteDoc();
  });
  [...appData.fuelTypes].forEach((fuelType) => {
    fuelType.deleteDoc();
  });
}
function upload() {
  (async () => {
    const data = getData();
    for (const fuelType of Object.values(data.fuelTypes)) {
      await appData.fuelTypes.add(fuelType);
    }
  })();
  function getData(): {
    fuelTypes: {
      [key: string]: {
        name: string;
        rate: null;
        createdPosix: number;
      };
    };
    clients: {
      [key: string]: {
        init: {
          name: string;
          clientId: string;
          phoneNumber: string;
          address: string;
          notes: string;
        };
        deliveries: {
          deliveryFormat: `completed`;
          creationTimePosix: number;
          quantity: number;
          completedTimePosix: number;
          completedFuelTypeName: string;
          completedRate: number | null;
        }[];
        tanks: {
          fuelTypeName: string;
          creationTimePosix: number;
          shape: `horizontalCylinder` | `rectangle` | `oval` | `truckBedTank`;
          length?: number;
          diameter?: number;
          depth?: number;
          height?: number;
          fullHeight?: number;
          squareHeight?: number;
          fullDepth?: number;
          wideHeight?: number;
          topDepth?: number;
        }[];
      };
    };
  } {
    return {
      fuelTypes: {
        DLS: {
          name: "DLS",
          rate: null,
          createdPosix: 1688874068640,
        },
        DHS: {
          name: "DHS",
          rate: null,
          createdPosix: 1688874068641,
        },
        HO1: {
          name: "HO1",
          rate: null,
          createdPosix: 1688874068642,
        },
        GUL: {
          name: "GUL",
          rate: null,
          createdPosix: 1688874068643,
        },
        HO2: {
          name: "HO2",
          rate: null,
          createdPosix: 1688874068644,
        },
        PRM: {
          name: "PRM",
          rate: null,
          createdPosix: 1688874068645,
        },
        Mix: {
          name: "Mix",
          rate: null,
          createdPosix: 1688874068646,
        },
        R99: {
          name: "R99",
          rate: null,
          createdPosix: 1688874068647,
        },
        PD8: {
          name: "PD8",
          rate: null,
          createdPosix: 1688874068648,
        },
        PD3: {
          name: "PD3",
          rate: null,
          createdPosix: 1688874068649,
        },
        PD7: {
          name: "PD7",
          rate: null,
          createdPosix: 1688874068650,
        },
      },
      clients: {
        "1": {
          init: {
            name: "Hays Oil Transfer",
            clientId: "1",
            phoneNumber: "",
            address: "",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "65": {
          init: {
            name: "White City CFN",
            clientId: "65",
            phoneNumber: "",
            address: "",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "138": {
          init: {
            name: "Gary Longbrake",
            clientId: "138",
            phoneNumber: "541-531-0274",
            address: "820 Glass Lane\nWhite City",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 36,
            },
          ],
        },
        "141": {
          init: {
            name: "Dale Jolly",
            clientId: "141",
            phoneNumber: "651-830-3456",
            address: "6525 Foothill Rd\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "146": {
          init: {
            name: "Mike & Marty Hill",
            clientId: "146",
            phoneNumber: "541-879-1600",
            address: "250 Bigham Brown Rd\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
          ],
        },
        "244": {
          init: {
            name: "John Fisher Trucking",
            clientId: "244",
            phoneNumber: "541-826-3677",
            address: "12294 Agate Rd\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "oval",
              length: 60,
              depth: 27,
              fullHeight: 44,
              squareHeight: 17,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 38,
            },
          ],
        },
        "264": {
          init: {
            name: "Cook Crane",
            clientId: "264",
            phoneNumber: "541-770-1101",
            address: "1350 Justice Rd\nMedford",
            notes: "Combo: 6636",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DLS",
              creationTimePosix: 0,
              shape: "rectangle",
              length: 120,
              depth: 42,
              height: 24,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 1,
              shape: "rectangle",
              length: 92,
              depth: 23,
              height: 29,
            },
          ],
        },
        "279": {
          init: {
            name: "Dardanelles Store",
            clientId: "279",
            phoneNumber: "541-855-4048",
            address: "9625 Old Stage Rd\nCentral Point",
            notes: "4’ 7” is full",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "PRM",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 80,
              diameter: 62,
            },
          ],
        },
        "280": {
          init: {
            name: "Hillcrest Orchards",
            clientId: "280",
            phoneNumber: "541-944-4294",
            address: "3285 Hillcrest Rd\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "286": {
          init: {
            name: "David Norris Contracting",
            clientId: "286",
            phoneNumber: "541-941-3206",
            address: "4161 Coleman Creek Rd\nMedford",
            notes: "Lock: 1776",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DLS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 81,
              diameter: 45,
            },
          ],
        },
        "300": {
          init: {
            name: "Central Point Plant",
            clientId: "300",
            phoneNumber: "",
            address: "",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "382": {
          init: {
            name: "Gordon Elliot",
            clientId: "382",
            phoneNumber: "541-621-5167",
            address: "15145 Antioch Rd\nWhite City",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 60,
              diameter: 45,
            },
          ],
        },
        "384": {
          init: {
            name: "Jim Tuttle",
            clientId: "384",
            phoneNumber: "541-601-6823",
            address: "13295 Weowna Way\nWhite City",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "rectangle",
              length: 90,
              depth: 16,
              height: 84,
            },
          ],
        },
        "388": {
          init: {
            name: "Jan Dusenberry",
            clientId: "388",
            phoneNumber: "541-878-7340",
            address: "266 Old Trail Creek Rd",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 81,
              diameter: 45,
            },
          ],
        },
        "391": {
          init: {
            name: "Melody Bean",
            clientId: "391",
            phoneNumber: "541-560-3607",
            address: "40971 Hwy 62\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 49,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "447": {
          init: {
            name: "Gary / Sandy Steven’s",
            clientId: "447",
            phoneNumber: "541-621-0859",
            address: "1385 Wedgewood Dr\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 61,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "476": {
          init: {
            name: "Payroll Specialties",
            clientId: "476",
            phoneNumber: "541-772-0100",
            address: "2736 Lake Shore Dr",
            notes: "Gate: 1987#",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 80,
              diameter: 45,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 80,
              diameter: 45,
            },
          ],
        },
        "496": {
          init: {
            name: "Powell Ranch",
            clientId: "496",
            phoneNumber: "541-292-1527",
            address: "6010 Hughes\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 80,
              diameter: 30,
            },
          ],
        },
        "538": {
          init: {
            name: "Wayne Escalona",
            clientId: "538",
            phoneNumber: "541-878-8244",
            address: "3686 Hwy 227\nTrail",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 61,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "539": {
          init: {
            name: "Diane Holm",
            clientId: "539",
            phoneNumber: "541-865-3427",
            address: "450 Oak St\nButte Falls",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 61,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "551": {
          init: {
            name: "Ken Lund",
            clientId: "551",
            phoneNumber: "541-535-8094",
            address: "2802 Deer Trail Ln\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "620": {
          init: {
            name: "Eagle Point National Cemetary",
            clientId: "620",
            phoneNumber: "541-826-2511",
            address: "2763 Riley Rd\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "rectangle",
              length: 121,
              depth: 29,
              height: 33,
            },
          ],
        },
        "629": {
          init: {
            name: "John Unruh",
            clientId: "629",
            phoneNumber: "541-601-8121",
            address: "3325 Deer Trail Ln\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "649": {
          init: {
            name: "Dwight Burson",
            clientId: "649",
            phoneNumber: "541-261-7928",
            address: "3268 Scenic Dr\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "656": {
          init: {
            name: "Jerry Lehman",
            clientId: "656",
            phoneNumber: "541-944-2757",
            address: "807 Reiten Dr\nAshland",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "660": {
          init: {
            name: "Equinox Agribusiness LLC",
            clientId: "660",
            phoneNumber: "541-865-7777",
            address: "10070 Butte Falls Hwy\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DLS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 37,
            },
            {
              fuelTypeName: "DLS",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 37,
            },
          ],
        },
        "732": {
          init: {
            name: "Siskiyou Memorial Park",
            clientId: "732",
            phoneNumber: "541-772-4013",
            address: "2100 Siskiyou Blvd\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 29,
              diameter: 45,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 51,
              diameter: 45,
            },
          ],
        },
        "736": {
          init: {
            name: "Robert Hunter",
            clientId: "736",
            phoneNumber: "541-535-1563",
            address: "1850 Pioneer Rd\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "780": {
          init: {
            name: "Dunbar Orchards",
            clientId: "780",
            phoneNumber: "541-773-2800",
            address: "2881 Hillcrest\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 60,
              diameter: 45,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
          ],
        },
        "792": {
          init: {
            name: "Chad Zerger",
            clientId: "792",
            phoneNumber: "541-890-4018",
            address: "460 Nick Young Rd\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 49,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "803": {
          init: {
            name: "Ted Birdseye",
            clientId: "803",
            phoneNumber: "541-659-9161",
            address: "15000 Butte Falls/Prospect Hwy\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 74,
              diameter: 47,
            },
          ],
        },
        "812": {
          init: {
            name: "David Romero",
            clientId: "812",
            phoneNumber: "458-228-8093",
            address: "51 Mill Creek Dr #2\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "830": {
          init: {
            name: "Estremado Ranch Inc",
            clientId: "830",
            phoneNumber: "541-855-9075",
            address: "30 Sardine Creek Rd\nGold Hill",
            notes:
              "Entrance is not on Sardine Creek. Enter from hwy, east of Sardine Creek. Tank is one closest to hwy. Remove vent and fill.",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 217,
              diameter: 105,
            },
          ],
        },
        "846": {
          init: {
            name: "Andrew Barnes",
            clientId: "846",
            phoneNumber: "541-941-9347",
            address: "445 Fern Valley Rd",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "880": {
          init: {
            name: "Brent Cook",
            clientId: "880",
            phoneNumber: "541-535-5029",
            address: "3120 Anderson Creek Rd\nTalent",
            notes:
              "2 Tanks on side of house at top of driveway. Only fill the one that’s hooked up.",
          },
          deliveries: [],
          tanks: [],
        },
        "884": {
          init: {
            name: "John Vinatieri",
            clientId: "884",
            phoneNumber: "541-324-8672",
            address: "5495 Hillcrest\nMedford",
            notes: "Gate: 5250",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 49,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "924": {
          init: {
            name: "Tina Astor",
            clientId: "924",
            phoneNumber: "541-778-6784",
            address: "475 E Nevada St\nAshland",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "oval",
              length: 60,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "930": {
          init: {
            name: "Topaz Farms",
            clientId: "930",
            phoneNumber: "Kevin Kostman\n541-951-9080",
            address: "6000 Blackwell Rd\nCentral Point",
            notes: "Per Customer: Always top off tanks",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 60,
              diameter: 45,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 72,
              diameter: 45,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 2,
              shape: "horizontalCylinder",
              length: 61,
              diameter: 45,
            },
          ],
        },
        "936": {
          init: {
            name: "James Owen",
            clientId: "936",
            phoneNumber: "541-664-3748",
            address: "5168 Dobrot Way\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "oval",
              length: 60,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "947": {
          init: {
            name: "Gerald Boykin",
            clientId: "947",
            phoneNumber: "541-261-2800",
            address: "676 Vista Park Dr\nEagle Point",
            notes: "Gate: 1325#",
          },
          deliveries: [],
          tanks: [],
        },
        "964": {
          init: {
            name: "Xtreme Wildland Corp",
            clientId: "964",
            phoneNumber: "541-840-6235",
            address: "2817 Ball Rd\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "997": {
          init: {
            name: "Gerald Boykin",
            clientId: "997",
            phoneNumber: "541-261-2800",
            address: "676 Vista Park Dr\nEagle Point",
            notes:
              "Gate: 1325#\nTank is in ground. Look for square grate near steps by patio. Have a small pipe wrench.",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 61,
              diameter: 46,
            },
          ],
        },
        "998": {
          init: {
            name: "George Reed",
            clientId: "998",
            phoneNumber: "541-890-0483",
            address: "1948 Meridian\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 73,
              diameter: 45,
            },
          ],
        },
        "999": {
          init: {
            name: "William Glenn",
            clientId: "999",
            phoneNumber: "541-973-8066",
            address: "1486 Hillcourt St\nMedford",
            notes: "First tank behind gate on right side of house.",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "oval",
              length: 72,
              depth: 18,
              fullHeight: 30,
              squareHeight: 13,
            },
          ],
        },
        "1011": {
          init: {
            name: "Bruce Buckmaster",
            clientId: "1011",
            phoneNumber: "541-842-0206",
            address: "14095 E Evans Creek\nRogue River",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 72,
              diameter: 45,
            },
          ],
        },
        "1032": {
          init: {
            name: "Alan Battenfield",
            clientId: "1032",
            phoneNumber: "541-878-3413",
            address: "726 Busch Rd\nTrail",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "1040": {
          init: {
            name: "John Williams / Deanna",
            clientId: "1040",
            phoneNumber: "541-778-9405",
            address: "3157 Old Stage Rd\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 73,
              diameter: 45,
            },
          ],
        },
        "1059": {
          init: {
            name: "Belmont Industries",
            clientId: "1059",
            phoneNumber: "909-900-5332",
            address: "939 Carpenter Hill Rd",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 79,
              diameter: 45,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 1,
              shape: "rectangle",
              length: 79,
              depth: 36,
              height: 55,
            },
          ],
        },
        "1088": {
          init: {
            name: "Butte Creek Ranch, Farm",
            clientId: "1088",
            phoneNumber: "541-621-6690",
            address: "1485 Brownsboro Meridian\nEagle Point",
            notes: "Gate: 8523#",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 80,
              diameter: 45,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 41,
            },
          ],
        },
        "1116": {
          init: {
            name: "John & Cynthia Jenkins",
            clientId: "1116",
            phoneNumber: "541-840-6722",
            address: "3075 Coker Butte\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 48,
              depth: 27,
              fullHeight: 44,
              squareHeight: 17,
            },
            {
              fuelTypeName: "HO1",
              creationTimePosix: 1,
              shape: "oval",
              length: 61,
              depth: 27,
              fullHeight: 44,
              squareHeight: 17,
            },
          ],
        },
        "1127": {
          init: {
            name: "Edna Quigley",
            clientId: "1127",
            phoneNumber: "541-826-4038",
            address: "647 Riley Rd\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 80,
              diameter: 45,
            },
          ],
        },
        "1131": {
          init: {
            name: "Rogue Transfer & Recycling",
            clientId: "1131",
            phoneNumber: "",
            address: "8001 Table Rock Rd\nWhite City",
            notes: "4’ 9” Max fill",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 133,
              diameter: 76,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 83,
              diameter: 45,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 2,
              shape: "horizontalCylinder",
              length: 70,
              diameter: 63,
            },
          ],
        },
        "1132": {
          init: {
            name: "Dry Creek Landfill",
            clientId: "1132",
            phoneNumber: "541-210-6526",
            address: "",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 70,
              diameter: 63,
            },
          ],
        },
        "1138": {
          init: {
            name: "Rogue Compost",
            clientId: "1138",
            phoneNumber: "",
            address: "8001 Table Rock Rd\nWhite City",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 83,
              diameter: 45,
            },
          ],
        },
        "1165": {
          init: {
            name: "Pete & Sheri Eary",
            clientId: "1165",
            phoneNumber: "541-821-1751",
            address: "772 Mather Rd\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 48,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "1194": {
          init: {
            name: "Don Ferris",
            clientId: "1194",
            phoneNumber: "541-826-7656",
            address: "2545 Meridian\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
            {
              fuelTypeName: "HO1",
              creationTimePosix: 1,
              shape: "oval",
              length: 61,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "1234": {
          init: {
            name: "Variations by Valentino",
            clientId: "1234",
            phoneNumber: "541-665-0695",
            address: "153 Schultz\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "oval",
              length: 60,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "1261": {
          init: {
            name: "Craig Singleton",
            clientId: "1261",
            phoneNumber: "541-821-1893",
            address: "8100 Yank Gulch Rd\nTalent",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 48,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "1326": {
          init: {
            name: "Rainbow Ridge",
            clientId: "1326",
            phoneNumber: "541-840-4288",
            address: "4902 McLoughlin Dr\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 45,
            },
            {
              fuelTypeName: "PRM",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 72,
              diameter: 45,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 2,
              shape: "horizontalCylinder",
              length: 80,
              diameter: 45,
            },
          ],
        },
        "1425": {
          init: {
            name: "Emi Lusardi",
            clientId: "1425",
            phoneNumber: "541-326-2627\n541-944-2017",
            address: "10053 Butte Falls Hwy",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "rectangle",
              length: 60,
              depth: 50,
              height: 40,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 1,
              shape: "oval",
              length: 49,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "1439": {
          init: {
            name: "Shirley J. Schultz",
            clientId: "1439",
            phoneNumber: "541-560-3234",
            address: "51 Mill Creek Dr Spc#4\nProspect",
            notes: "E.A.",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
          ],
        },
        "1440": {
          init: {
            name: "Diane Whisman",
            clientId: "1440",
            phoneNumber: "541-601-3769",
            address: "1000 Sterling Creek Rd\nJacksonville",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
          ],
        },
        "1491": {
          init: {
            name: "Robert Stockton",
            clientId: "1491",
            phoneNumber: "541-690-9666",
            address: "970 Laurel\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 48,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "1509": {
          init: {
            name: "Weekly Bros",
            clientId: "1509",
            phoneNumber: "541-530-1148",
            address: "",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 97,
              diameter: 46,
            },
          ],
        },
        "1524": {
          init: {
            name: "William & Kathleen Bethany",
            clientId: "1524",
            phoneNumber: "541-770-3746",
            address: "4893 W Griffin Creek Rd\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "oval",
              length: 48,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "1537": {
          init: {
            name: "Cindy Benson",
            clientId: "1537",
            phoneNumber: "541-855-5503",
            address: "788 Pelton Ln\nGold Hill",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 48,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "1562": {
          init: {
            name: "Abigail Rodgers",
            clientId: "1562",
            phoneNumber: "541-944-6123",
            address: "5599 Hwy 238\nJacksonville",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 45,
            },
          ],
        },
        "1587": {
          init: {
            name: "PK Manufacturing",
            clientId: "1587",
            phoneNumber: "541-778-4492",
            address: "2695 Kirtland Drive",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 70,
              diameter: 70,
            },
          ],
        },
        "1739": {
          init: {
            name: "John Cox",
            clientId: "1739",
            phoneNumber: "541-261-0485",
            address: "1299 Hwy 234\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 84,
              diameter: 29,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 42,
            },
          ],
        },
        "1759": {
          init: {
            name: "Willow Springs Ranch",
            clientId: "1759",
            phoneNumber: "541-727-2822",
            address: "3737 Willow Springs Dr\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 61,
              diameter: 45,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 144,
              diameter: 45,
            },
          ],
        },
        "1776": {
          init: {
            name: "Knife River",
            clientId: "1776",
            phoneNumber: "",
            address: "",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "R99",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 280,
              diameter: 84,
            },
            {
              fuelTypeName: "R99",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 280,
              diameter: 95,
            },
            {
              fuelTypeName: "R99",
              creationTimePosix: 2,
              shape: "horizontalCylinder",
              length: 85,
              diameter: 60,
            },
            {
              fuelTypeName: "R99",
              creationTimePosix: 3,
              shape: "horizontalCylinder",
              length: 96,
              diameter: 45,
            },
            {
              fuelTypeName: "R99",
              creationTimePosix: 4,
              shape: "horizontalCylinder",
              length: 97,
              diameter: 69,
            },
          ],
        },
        "1838": {
          init: {
            name: "Ground Control",
            clientId: "1838",
            phoneNumber: "541-776-2275",
            address: "6351 Blackwell Rd\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "PRM",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 37,
            },
          ],
        },
        "1878": {
          init: {
            name: "R & L Excavating",
            clientId: "1878",
            phoneNumber: "541-405-2372",
            address: "476 Red Blanket Rd",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 145,
              diameter: 46,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 80,
              diameter: 45,
            },
          ],
        },
        "1880": {
          init: {
            name: "Crater Lake RV Park",
            clientId: "1880",
            phoneNumber: "541-560-3399",
            address: "46611 Hwy 62\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "oval",
              length: 49,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "1896": {
          init: {
            name: "Wilson Pro Pole",
            clientId: "1896",
            phoneNumber: "541-944-5044",
            address: "1790 Ave G\nWhite City",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "rectangle",
              length: 48,
              depth: 24,
              height: 48,
            },
          ],
        },
        "1943": {
          init: {
            name: "Bruce & Debbie Baker",
            clientId: "1943",
            phoneNumber: "541-973-0784",
            address: "2251 Mill Creek\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 49,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "1959": {
          init: {
            name: "Quality Tree",
            clientId: "1959",
            phoneNumber: "541-951-9953",
            address: "6620 Tolo Rd\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DLS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 96,
              diameter: 41,
            },
          ],
        },
        "1974": {
          init: {
            name: "David Jackson",
            clientId: "1974",
            phoneNumber: "541-621-8828",
            address: "1440 Mill Creek\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 49,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "1987": {
          init: {
            name: "Kevin Campbell",
            clientId: "1987",
            phoneNumber: "541-802-6854",
            address: "12350 Hwy 238\nJacksonville",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 45,
            },
          ],
        },
        "1993": {
          init: {
            name: "Anthony Molle",
            clientId: "1993",
            phoneNumber: "541-601-7464",
            address: "3360 Taylor Rd\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 41,
            },
          ],
        },
        "2113": {
          init: {
            name: "Larry Baker",
            clientId: "2113",
            phoneNumber: "541-826-4549",
            address: "6607 McLoughlin",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 49,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "2201": {
          init: {
            name: "Celtic Moon Vineyard",
            clientId: "2201",
            phoneNumber: "707-849-2052",
            address: "766 Meridian Rd\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
          ],
        },
        "2228": {
          init: {
            name: "PP&L",
            clientId: "2228",
            phoneNumber: "530-221-2558",
            address: "1111 Mill Creek Dr\nProspect",
            notes: "Gate: #0963",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "rectangle",
              length: 73,
              depth: 64,
              height: 48,
            },
            {
              fuelTypeName: "DLS",
              creationTimePosix: 1,
              shape: "rectangle",
              length: 36,
              depth: 64,
              height: 48,
            },
          ],
        },
        "2232": {
          init: {
            name: "Affordable Lawn Care",
            clientId: "2232",
            phoneNumber: "",
            address: "6620 Tolo Rd\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "2247": {
          init: {
            name: "Superior Automotive Ser. LLC",
            clientId: "2247",
            phoneNumber: "541-779-2806",
            address: "8486 Crater Lake Hwy",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "2249": {
          init: {
            name: "Jesse Brannock",
            clientId: "2249",
            phoneNumber: "541-826-9302\n541-821-2644",
            address: "200 Butte Falls Hwy\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 60,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "2255": {
          init: {
            name: "Ken Brown Construction",
            clientId: "2255",
            phoneNumber: "541-727-7827",
            address: "8147 Blackwell Rd\nCentral Point",
            notes: "Gate: 5224",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 95,
              diameter: 40,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 72,
              diameter: 45,
            },
          ],
        },
        "2269": {
          init: {
            name: "Caroline Van Doren",
            clientId: "2269",
            phoneNumber: "541-538-1175",
            address: "1948 Brownsboro Meridian\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
          ],
        },
        "2295": {
          init: {
            name: "Bryan Baumgartner",
            clientId: "2295",
            phoneNumber: "541-261-2465",
            address: "6044 Foothill Rd\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "oval",
              length: 60,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "2360": {
          init: {
            name: "Ray Giles",
            clientId: "2360",
            phoneNumber: "541-601-6806",
            address: "201 Crossway\nGold Hill",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "oval",
              length: 60,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "2391": {
          init: {
            name: "Bonnie Bretches",
            clientId: "2391",
            phoneNumber: "541-690-6047",
            address: "127 McDonough, 171 McDonough\nGold Hill",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 41,
            },
            {
              fuelTypeName: "HO1",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 54,
              diameter: 34,
            },
          ],
        },
        "2405": {
          init: {
            name: "Joe Ivory",
            clientId: "2405",
            phoneNumber: "541-821-1876",
            address: "1449 E Dutton\nEagle Point",
            notes: "My hose is about 7’ too short to reach.",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 60,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "2426": {
          init: {
            name: "Tom Schauer",
            clientId: "2426",
            phoneNumber: "541-261-0895",
            address: "5987 Rhodes Ln\nShady Cove",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 48,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "2436": {
          init: {
            name: "Aurupa Spring Ranch",
            clientId: "2436",
            phoneNumber: "907-203-8564",
            address: "657 South Stage rd\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "oval",
              length: 49,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "2449": {
          init: {
            name: "June Shepard",
            clientId: "2449",
            phoneNumber: "541-840-5830",
            address: "185 Maywood Way\nAshland",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "2470": {
          init: {
            name: "Peter Adesman",
            clientId: "2470",
            phoneNumber: "541-301-6778\n541-671-7872",
            address: "4897 Santa Barbara Dr\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 26,
            },
          ],
        },
        "2475": {
          init: {
            name: "Thomas Brookins",
            clientId: "2475",
            phoneNumber: "541-821-1222",
            address: "218 Reese Creek Rd\nEagle Point",
            notes:
              "Back into driveway, tanks are all the way behind garage. Big is gas, small is HS",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 48,
            },
          ],
        },
        "2551": {
          init: {
            name: "Westpoint Construction",
            clientId: "2551",
            phoneNumber: "541-210-3857",
            address: "3530 Bellinger Lane\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DLS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 72,
              diameter: 45,
            },
          ],
        },
        "2597": {
          init: {
            name: "Cindy / Mitch Benson",
            clientId: "2597",
            phoneNumber: "541-855-5503",
            address: "720 Pelton Ln\nGold Hill",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
          ],
        },
        "2605": {
          init: {
            name: "Ted Cooper",
            clientId: "2605",
            phoneNumber: "541-826-1788",
            address: "20990 Antioch Rd\nWhite City",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 45,
            },
          ],
        },
        "2634": {
          init: {
            name: "Ron Fitzpatrick",
            clientId: "2634",
            phoneNumber: "541-499-1865",
            address: "1022 Newland Rd\nCentral Point",
            notes:
              "1 Tank behind office\n1 Tank behind yellow air compressor\n1 Tank behind adjacent building",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "oval",
              length: 60,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
            {
              fuelTypeName: "HO2",
              creationTimePosix: 1,
              shape: "oval",
              length: 61,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
            {
              fuelTypeName: "HO2",
              creationTimePosix: 2,
              shape: "oval",
              length: 36,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "2646": {
          init: {
            name: "Russ Reynard",
            clientId: "2646",
            phoneNumber: "541-646-8807",
            address: "13034 E Antelope Rd\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 80,
              diameter: 45,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 30,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 2,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 28,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 3,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 4,
              shape: "rectangle",
              length: 46,
              depth: 24,
              height: 24,
            },
          ],
        },
        "2665": {
          init: {
            name: "Richard Stockebrand S&S Earthworks",
            clientId: "2665",
            phoneNumber: "541-261-1416",
            address: "44201 Hwy 62\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 120,
              diameter: 48,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 40,
            },
          ],
        },
        "2683": {
          init: {
            name: "Robert Gibson",
            clientId: "2683",
            phoneNumber: "541-973-1351",
            address: "1033 Rocky Rd\nTrail",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 61,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "2729": {
          init: {
            name: "Kenneth Krebs",
            clientId: "2729",
            phoneNumber: "541-941-1108",
            address: "2019 Rogue River Unit 14\nGold Hill",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "rectangle",
              length: 48,
              depth: 27,
              height: 22,
            },
          ],
        },
        "2730": {
          init: {
            name: "Shelly McMillin",
            clientId: "2730",
            phoneNumber: "541-899-1527",
            address: "540 Lomas\nJacksonville",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 36,
            },
          ],
        },
        "2737": {
          init: {
            name: "JRH Mobile LLC",
            clientId: "2737",
            phoneNumber: "541-826-4724",
            address: "15323 Antioch\nWhite City",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
          ],
        },
        "2738": {
          init: {
            name: "Hunt Ranch",
            clientId: "2738",
            phoneNumber: "541-941-5516",
            address: "105 Loch Lomond Dr\nWhite City",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DLS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 37,
            },
            {
              fuelTypeName: "DLS",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 61,
              diameter: 37,
            },
          ],
        },
        "2744": {
          init: {
            name: "Dick Millard",
            clientId: "2744",
            phoneNumber: "458-226-0717",
            address: "3535 Brophy Rd\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "2789": {
          init: {
            name: "Celia Wann & Robert Wann",
            clientId: "2789",
            phoneNumber: "541-890-6560",
            address: "3388 Dodge Rd\nWhite City",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 30,
            },
          ],
        },
        "2910": {
          init: {
            name: "Ern Russell",
            clientId: "2910",
            phoneNumber: "541-531-2035",
            address: "1323 Worthington Rd\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 37,
            },
          ],
        },
        "2914": {
          init: {
            name: "Interstate Batteries",
            clientId: "2914",
            phoneNumber: "541-664-3417",
            address: "894 S Front St\nCentral Point",
            notes: "2 Drums",
          },
          deliveries: [],
          tanks: [],
        },
        "2920": {
          init: {
            name: "Harry Grieve",
            clientId: "2920",
            phoneNumber: "541-621-4712",
            address: "165 Mill Creek Dr\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 37,
            },
          ],
        },
        "2926": {
          init: {
            name: "McLure & Sons",
            clientId: "2926",
            phoneNumber: "541-521-2577",
            address: "8301 Table Rock Rd\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 50,
              diameter: 45,
            },
          ],
        },
        "2935": {
          init: {
            name: "Two Creeks Farm",
            clientId: "2935",
            phoneNumber: "541-482-8672",
            address: "2447 Ross Lane\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 61,
              diameter: 45,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
          ],
        },
        "2967": {
          init: {
            name: "Jack Shields",
            clientId: "2967",
            phoneNumber: "541-846-6994",
            address: "4505 Humbug Creek Rd\nJacksonville",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "PRM",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 61,
              diameter: 45,
            },
            {
              fuelTypeName: "PRM",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 72,
              diameter: 45,
            },
          ],
        },
        "2968": {
          init: {
            name: "George Robinson",
            clientId: "2968",
            phoneNumber: "541-846-9341",
            address: "5550 Humbug Creek\nJacksonville",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 49,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
            {
              fuelTypeName: "PRM",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 42,
            },
          ],
        },
        "2983": {
          init: {
            name: "Medite Plant",
            clientId: "2983",
            phoneNumber: "541-679-3311",
            address: "2685 N Pacific Hwy\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 144,
              diameter: 45,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 84,
              diameter: 48,
            },
          ],
        },
        "3036": {
          init: {
            name: "Robert Pierce",
            clientId: "3036",
            phoneNumber: "541-538-8344",
            address: "647 Mountain View Dr\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 61,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "3102": {
          init: {
            name: "Scott McKee",
            clientId: "3102",
            phoneNumber: "541-613-7820",
            address: "41385 Hwy 62\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 45,
            },
          ],
        },
        "3127": {
          init: {
            name: "Jeff Setzer",
            clientId: "3127",
            phoneNumber: "541-282-3565",
            address: "316 Salter Rd\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 61,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "3133": {
          init: {
            name: "Terry Partsafas",
            clientId: "3133",
            phoneNumber: "541-860-3399",
            address: "3730 Madrona\nMeford",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DLS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 45,
            },
          ],
        },
        "3134": {
          init: {
            name: "Bart Cunningham",
            clientId: "3134",
            phoneNumber: "541-297-4193",
            address: "4764 Andrews\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 81,
              diameter: 45,
            },
          ],
        },
        "3150": {
          init: {
            name: "Advanced Tree Service",
            clientId: "3150",
            phoneNumber: "541-621-9460",
            address: "1100 Casino\nMedford",
            notes: "Gate: 2020",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 73,
              diameter: 45,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 97,
              diameter: 45,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 2,
              shape: "horizontalCylinder",
              length: 92,
              diameter: 41,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 3,
              shape: "horizontalCylinder",
              length: 61,
              diameter: 45,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 4,
              shape: "oval",
              length: 61,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "3158": {
          init: {
            name: "Marsha Capello",
            clientId: "3158",
            phoneNumber: "5641-531-9605",
            address: "1940 Mill Creek Dr\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 41,
            },
          ],
        },
        "3159": {
          init: {
            name: "Ruth Thompson",
            clientId: "3159",
            phoneNumber: "928-503-1596",
            address: "40 Mill Creek Dr\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 61,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "3225": {
          init: {
            name: "Vaughan Ranch",
            clientId: "3225",
            phoneNumber: "541-531-4007",
            address: "9500 Butte Falls Hwy\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "3229": {
          init: {
            name: "Pacific Fibre Products",
            clientId: "3229",
            phoneNumber: "360-355-0092",
            address: "8087 Blackwell Rd\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 143,
              diameter: 46,
            },
          ],
        },
        "3237": {
          init: {
            name: "All Creatures Animal Hospital",
            clientId: "3237",
            phoneNumber: "541-890-0444",
            address: "14790 Hwy 62\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 81,
              diameter: 45,
            },
          ],
        },
        "3253": {
          init: {
            name: "David Maxwell - Pacific Turbine",
            clientId: "3253",
            phoneNumber: "541-582-2020",
            address: "1007 Foots Creek\nRogue River",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 81,
              diameter: 45,
            },
          ],
        },
        "3278": {
          init: {
            name: "Jeff Whisnant",
            clientId: "3278",
            phoneNumber: "541-560-1142",
            address: "1891 Mill Creek Dr\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DLS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
          ],
        },
        "3279": {
          init: {
            name: "Art of Plumbing",
            clientId: "3279",
            phoneNumber: "541951-9405",
            address: "3521 Table Rock rd\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 72,
              diameter: 45,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
          ],
        },
        "3292": {
          init: {
            name: "Steven Gary",
            clientId: "3292",
            phoneNumber: "909-519-4488",
            address: "7074 Rogue River Dr\nShady Cove",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "oval",
              length: 60,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "3306": {
          init: {
            name: "Mountain Valley Construction",
            clientId: "3306",
            phoneNumber: "541-944-5657",
            address: "2787 Rogue River Hwy",
            notes: "Gate: 4297\n",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 80,
              diameter: 45,
            },
            {
              fuelTypeName: "PRM",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 29,
            },
          ],
        },
        "3315": {
          init: {
            name: "Jesse James",
            clientId: "3315",
            phoneNumber: "541-855-3111",
            address: "3200 Sardine Creek Right Fork\nGold Hill",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
          ],
        },
        "3324": {
          init: {
            name: "Laney Davidson",
            clientId: "3324",
            phoneNumber: "541-878-4496",
            address: "6220 Rogue River Dr\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 36,
            },
          ],
        },
        "3358": {
          init: {
            name: "Randy Tharp",
            clientId: "3358",
            phoneNumber: "541-830-8843",
            address: "312 Hwy 2234\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 61,
              diameter: 45,
            },
          ],
        },
        "3362": {
          init: {
            name: "Rick Jackson",
            clientId: "3362",
            phoneNumber: "541-951-0058",
            address: "10 Fir St\nShady Cove",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "oval",
              length: 48,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "3366": {
          init: {
            name: "Leann Quint",
            clientId: "3366",
            phoneNumber: "541-840-0397",
            address: "623 Mountain View Dr\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "oval",
              length: 61,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "3371": {
          init: {
            name: "Peggy Short",
            clientId: "3371",
            phoneNumber: "541-778-6390",
            address: "2384 Upper Applegate Rd\nJacksonville",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
          ],
        },
        "3375": {
          init: {
            name: "Becky Brackett",
            clientId: "3375",
            phoneNumber: "541-601-4267",
            address: "9300 Hwy 234\nGold Hill",
            notes: "Gate: 70963#",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 72,
              diameter: 45,
            },
            {
              fuelTypeName: "PRM",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
          ],
        },
        "3388": {
          init: {
            name: "Donna Milkowski",
            clientId: "3388",
            phoneNumber: "541-821-3301",
            address: "7668 Hyatt Prairie Rd",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 48,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "3393": {
          init: {
            name: "Kandu Ranch",
            clientId: "3393",
            phoneNumber: "541-215-2632",
            address: "2050 Butler Creek Rd\nAshland",
            notes: "Gate 1: #7791\nPadlock: 0910",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
          ],
        },
        "3414": {
          init: {
            name: "Mitchell Skadsen",
            clientId: "3414",
            phoneNumber: "541-261-5126",
            address: "469 Worthington Rd\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "oval",
              length: 49,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "3419": {
          init: {
            name: "James Webb",
            clientId: "3419",
            phoneNumber: "541-743-1787",
            address: "2264 Lampman\nGold Hill",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "3420": {
          init: {
            name: "Dennis Hammond",
            clientId: "3420",
            phoneNumber: "541-630-0077",
            address: "2900 Rogue River Dr\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 30,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 2,
              shape: "horizontalCylinder",
              length: 72,
              diameter: 45,
            },
            {
              fuelTypeName: "PRM",
              creationTimePosix: 3,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
          ],
        },
        "3422": {
          init: {
            name: "Kathleen McCauley",
            clientId: "3422",
            phoneNumber: "541-778-3541",
            address: "16800 Jones Rd\nWhite City",
            notes: "Gate: 1590",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
          ],
        },
        "3437": {
          init: {
            name: "Bobby Young",
            clientId: "3437",
            phoneNumber: "541-973-7991",
            address: "41971 Hwy 62\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "oval",
              length: 60,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "3439": {
          init: {
            name: "Roger Hays",
            clientId: "3439",
            phoneNumber: "541-878-3480",
            address: "230 Indian Creek Ln\nShady Cove",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
          ],
        },
        "3442": {
          init: {
            name: "Dick Mast",
            clientId: "3442",
            phoneNumber: "541-560-3728",
            address: "355 M Lane\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 60,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "3445": {
          init: {
            name: "David Jacobs",
            clientId: "3445",
            phoneNumber: "541-621-3286",
            address: "1731 Mill Creek Dr\nProspect",
            notes: "Gate: 00777",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 60,
              diameter: 45,
            },
          ],
        },
        "3454": {
          init: {
            name: "Brophy Ranch",
            clientId: "3454",
            phoneNumber: "817-231-9168",
            address: "742 Brophy Rd\nEagle Point",
            notes: "Gate: 2008#",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 30,
              diameter: 46,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 112,
              diameter: 46,
            },
          ],
        },
        "3455": {
          init: {
            name: "Larry Tauriainen",
            clientId: "3455",
            phoneNumber: "541-878-2490",
            address: "225 D’anconia Dr\nTrail",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 49,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "3472": {
          init: {
            name: "Gerald Katzenbach",
            clientId: "3472",
            phoneNumber: "541-830-1141",
            address: "14680 E Antelope\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "3473": {
          init: {
            name: "V 4 Lake Ranch",
            clientId: "3473",
            phoneNumber: "541-414-7564\n541-973-4321 NA",
            address: "1897 / 1979 Crowfoot Rd\nEagle Point",
            notes: "Gate: 427177#",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 146,
              diameter: 45,
            },
            {
              fuelTypeName: "PRM",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 73,
              diameter: 45,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 2,
              shape: "rectangle",
              length: 45,
              depth: 23,
              height: 23,
            },
          ],
        },
        "3480": {
          init: {
            name: "Burton Construction Inc",
            clientId: "3480",
            phoneNumber: "541-292-1435\n509-496-6774",
            address: "8495 Crater Lake Hwy\nWhite City",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "3486": {
          init: {
            name: "Shirley Baker / Kelly Gibson",
            clientId: "3486",
            phoneNumber: "541-851-1804",
            address: "2143 Fowler Ln\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 36,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
            {
              fuelTypeName: "HO1",
              creationTimePosix: 1,
              shape: "oval",
              length: 60,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "3488": {
          init: {
            name: "Rita Pitts",
            clientId: "3488",
            phoneNumber: "541-826-4356",
            address: "6775 Butte Falls Hwy\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 48,
              depth: 27,
              fullHeight: 44,
              squareHeight: 17,
            },
          ],
        },
        "3489": {
          init: {
            name: "Jesse Little",
            clientId: "3489",
            phoneNumber: "541-944-0904",
            address: "486 Red Blanket Rd\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 49,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
            {
              fuelTypeName: "HO1",
              creationTimePosix: 1,
              shape: "oval",
              length: 49,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
            {
              fuelTypeName: "HO1",
              creationTimePosix: 2,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 26,
            },
          ],
        },
        "3505": {
          init: {
            name: "Peter Salant",
            clientId: "3505",
            phoneNumber: "541-899-8295",
            address: "5288 Little Applegate Rd\nJacksonville",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
          ],
        },
        "3511": {
          init: {
            name: "Julie Gossman",
            clientId: "3511",
            phoneNumber: "541-770-2886",
            address: "1288 Worthington\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 61,
              diameter: 45,
            },
          ],
        },
        "3540": {
          init: {
            name: "Erik Robinson",
            clientId: "3540",
            phoneNumber: "541-261-1803",
            address: "18460 Hwy 62\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 96,
              diameter: 42,
            },
          ],
        },
        "3574": {
          init: {
            name: "Bumgardners Landscape MGMT",
            clientId: "3574",
            phoneNumber: "541-727-7503",
            address: "7878 Blackwell Rd\nCentral Point",
            notes: "UL Key: 2337\nSmall tank: UL",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "PRM",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 61,
              diameter: 45,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 144,
              diameter: 45,
            },
          ],
        },
        "3577": {
          init: {
            name: "Don Nelson",
            clientId: "3577",
            phoneNumber: "541-878-2312",
            address: "14461 Elk Creek Rd\nTrail",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DLS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 73,
              diameter: 45,
            },
          ],
        },
        "3615": {
          init: {
            name: "Brian Hill",
            clientId: "3615",
            phoneNumber: "541-890-1076",
            address: "4242 Ave A\nWhite City",
            notes: "Gate: 32039",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DLS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 80,
              diameter: 45,
            },
          ],
        },
        "3623": {
          init: {
            name: "Coast 2 Coast Logistics",
            clientId: "3623",
            phoneNumber: "541-646-7072",
            address: "127 Hanley Rd\nCentral Point",
            notes: "250 gallon tank is in basement\nNo way to stick",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 59,
              depth: 26,
              fullHeight: 44,
              squareHeight: 18,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 82,
              diameter: 45,
            },
          ],
        },
        "3634": {
          init: {
            name: "Dancin Vineyards",
            clientId: "3634",
            phoneNumber: "541-245-1133",
            address: "4435 South Stage Rd\nMedford",
            notes: "Tank combo: 0135\nGate: 0135#\nDon’t leave invoice",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 55,
              diameter: 28,
            },
          ],
        },
        "3674": {
          init: {
            name: "White Oak Ranch",
            clientId: "3674",
            phoneNumber: "541-227-4112",
            address: "10700 Agate Rd",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 61,
              diameter: 38,
            },
          ],
        },
        "3677": {
          init: {
            name: "Michael Ridgeline",
            clientId: "3677",
            phoneNumber: "541-944-7192",
            address: "500 S Obenchain\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "PRM",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 74,
              diameter: 46,
            },
          ],
        },
        "3695": {
          init: {
            name: "Nadine Blaine",
            clientId: "3695",
            phoneNumber: "541-890-6733",
            address: "472 Red Blanket Rd",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 38,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 60,
              diameter: 45,
            },
            {
              fuelTypeName: "HO1",
              creationTimePosix: 2,
              shape: "oval",
              length: 49,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "3698": {
          init: {
            name: "James Womack",
            clientId: "3698",
            phoneNumber: "541-560-4158",
            address: "432 Red Blanket Rd\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 61,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "3720": {
          init: {
            name: "John Collins",
            clientId: "3720",
            phoneNumber: "541-878-0928",
            address: "1015 Celtic Circle\nShady Cove",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 60,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "3747": {
          init: {
            name: "Laura & Greg Stewart",
            clientId: "3747",
            phoneNumber: "541-324-7373",
            address: "3155 Old Stage Rd\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
          ],
        },
        "3749": {
          init: {
            name: "Seafood Dr",
            clientId: "3749",
            phoneNumber: "541-774-9409",
            address: "4848 Airway Dr\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 72,
              diameter: 47,
            },
            {
              fuelTypeName: "PRM",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 59,
              diameter: 38,
            },
          ],
        },
        "3756": {
          init: {
            name: "Mindful Earth Farms",
            clientId: "3756",
            phoneNumber: "Micah: 970-581-4155\nTerasi: 530-264-6554",
            address: "513 Carter Ln\nAshland",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 26,
            },
          ],
        },
        "3762": {
          init: {
            name: "Michael Partisky",
            clientId: "3762",
            phoneNumber: "541-5316267",
            address: "20056 Hwy 62\nShady Cove",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 41,
            },
          ],
        },
        "3769": {
          init: {
            name: "David Casey",
            clientId: "3769",
            phoneNumber: "661-301-0740",
            address: "3710 Reese Creek Rd\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 72,
              diameter: 48,
            },
          ],
        },
        "3805": {
          init: {
            name: "Liz Steward",
            clientId: "3805",
            phoneNumber: "541-560-1147\n541-560-3793",
            address: "40985 Hwy 62\nProspect",
            notes: "Split tank, connected!",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 61,
              diameter: 45,
            },
          ],
        },
        "3811": {
          init: {
            name: "Crooked Barn Vineyard",
            clientId: "3811",
            phoneNumber: "458-225-0300",
            address: "14430 Hwy 238\nJacksonville",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 96,
              diameter: 42,
            },
          ],
        },
        "3817": {
          init: {
            name: "Don Keck",
            clientId: "3817",
            phoneNumber: "541-826-3571",
            address: "1883 Crowfoot Rd\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "oval",
              length: 61,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "3823": {
          init: {
            name: "Frank Dodge",
            clientId: "3823",
            phoneNumber: "541-951-5807",
            address: "214 Hammel Rd\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "3837": {
          init: {
            name: "Al Nason",
            clientId: "3837",
            phoneNumber: "541-560-3230",
            address: "439 Red Blanket Rd\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 61,
              diameter: 45,
            },
          ],
        },
        "3842": {
          init: {
            name: "Randy Wolf",
            clientId: "3842",
            phoneNumber: "541-890-3940",
            address: "1328 Bigham Brown Rd\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 73,
              diameter: 48,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 73,
              diameter: 46,
            },
            {
              fuelTypeName: "PRM",
              creationTimePosix: 2,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 41,
            },
          ],
        },
        "3854": {
          init: {
            name: "Melanie Bricker",
            clientId: "3854",
            phoneNumber: "614-338-9533",
            address: "348 Ridgewood Dr\nJacksonville",
            notes: "In ground tank next to garage. Under bucket.",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 60,
              diameter: 45,
            },
          ],
        },
        "3857": {
          init: {
            name: "Eva Shawnego",
            clientId: "3857",
            phoneNumber: "541-826-7287\nCell: 541-601-6668",
            address: "18391 Hwy 62\nEagle Point",
            notes: "Gate:1955\nHO#1 tank closer to house",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 41,
            },
          ],
        },
        "3861": {
          init: {
            name: "Brittany Solada",
            clientId: "3861",
            phoneNumber: "541-951-1413",
            address: "819 Ulrich Rd\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 48,
              depth: 27,
              fullHeight: 44,
              squareHeight: 17,
            },
          ],
        },
        "3878": {
          init: {
            name: "SD Hay and Trucking",
            clientId: "3878",
            phoneNumber: "541-890-4192",
            address: "3589 Scenic Rd\nCentral Point",
            notes: "Gate: 369#",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 80,
              diameter: 45,
            },
          ],
        },
        "3880": {
          init: {
            name: "Ryan & Teresa Karjala",
            clientId: "3880",
            phoneNumber: "541-788-8725",
            address: "482 Red Blanket Rd\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 80,
              diameter: 45,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 72,
              diameter: 45,
            },
          ],
        },
        "3914": {
          init: {
            name: "Don Burkholder",
            clientId: "3914",
            phoneNumber: "541-878-2099",
            address: "8993 Elk Creek Rd\nTrail",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 61,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "3943": {
          init: {
            name: "Bo White",
            clientId: "3943",
            phoneNumber: "541-865-3240",
            address: "8990 Butte Falls Hwy\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 96,
              diameter: 42,
            },
          ],
        },
        "4007": {
          init: {
            name: "BBMD-Medford, Boise Phoenix",
            clientId: "4007",
            phoneNumber: "541-535-3456",
            address: "100 Houston Rd\nPhoenix",
            notes: "Keep under 3/4 tank",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 67,
              diameter: 45,
            },
          ],
        },
        "4028": {
          init: {
            name: "Robert James",
            clientId: "4028",
            phoneNumber: "541-560-1152",
            address: "403A Red Blanket Rd\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 48,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "4031": {
          init: {
            name: "Elijah Rinaldi",
            clientId: "4031",
            phoneNumber: "717-829-1053",
            address: "3063 Upper Applegate Rd\nJacksonville",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 30,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
          ],
        },
        "4057": {
          init: {
            name: "Stephanie Chancler",
            clientId: "4057",
            phoneNumber: "541-601-1500",
            address: "3095 Rogue River Dr\nShady Cove",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 48,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "4079": {
          init: {
            name: "Ocean Clark",
            clientId: "4079",
            phoneNumber: "541-951-7069",
            address: "1580 Meridian\nEagle Point",
            notes: "Gate: 3693",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 81,
              diameter: 45,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 1,
              shape: "rectangle",
              length: 45,
              depth: 23,
              height: 23,
            },
          ],
        },
        "4080": {
          init: {
            name: "Rogue Metals & Supply",
            clientId: "4080",
            phoneNumber: "541-826-3242",
            address: "7130 Crater Lake Hwy\nWhite City",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 42,
              diameter: 37,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 61,
              diameter: 45,
            },
          ],
        },
        "4081": {
          init: {
            name: "Crater Lake Hospitality",
            clientId: "4081",
            phoneNumber: "541-560-3565\n913-956-9406",
            address: "56484 Hwy 62\nProspect",
            notes:
              "Crater Lake: 7624\n\nUnion Creek: 4 small tanks, 1 large tank.\nCL Park:\nLower Tank: HS: ///left.liquid.mounds\nUpper Tank: HS: ",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "oval",
              length: 48,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 1,
              shape: "oval",
              length: 60,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
            {
              fuelTypeName: "PRM",
              creationTimePosix: 4,
              shape: "horizontalCylinder",
              length: 184,
              diameter: 95,
            },
          ],
        },
        "4098": {
          init: {
            name: "Rick Lowe",
            clientId: "4098",
            phoneNumber: "541-878-4342",
            address: "3007 Longbranch Rd\nShady Cove",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "oval",
              length: 49,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "4101": {
          init: {
            name: "Leonard Howe",
            clientId: "4101",
            phoneNumber: "541-778-2911",
            address: "697 Laurel Ave\nButte Falls",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "oval",
              length: 48,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "4105": {
          init: {
            name: "Carol & Larry Holman",
            clientId: "4105",
            phoneNumber: "541-821-0780",
            address: "408 Shady Lane\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 61,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "4114": {
          init: {
            name: "Ted Walker",
            clientId: "4114",
            phoneNumber: "541-973-5744",
            address: "1100 Mill Creek Dr\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "4116": {
          init: {
            name: "Lindsay Hudson",
            clientId: "4116",
            phoneNumber: "818-515-2394",
            address: "194 Rene Dr\nShady Cove",
            notes: "Gate: pin230104ok\nBring truck 29, driveway is very tight.",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "oval",
              length: 48,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
            {
              fuelTypeName: "HO1",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 95,
              diameter: 41,
            },
          ],
        },
        "4123": {
          init: {
            name: "Rodgers Contract Cutting Inc",
            clientId: "4123",
            phoneNumber: "541-951-1248",
            address: "4000 Butte Falls - Prospect Hwy\nButte Falls",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 144,
              diameter: 58,
            },
            {
              fuelTypeName: "PRM",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 96,
              diameter: 41,
            },
          ],
        },
        "4130": {
          init: {
            name: "Deeann Sharpe",
            clientId: "4130",
            phoneNumber: "541-821-2458",
            address: "623 Laurel\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 45,
            },
          ],
        },
        "4152": {
          init: {
            name: "John & Cheryl McGonagle",
            clientId: "4152",
            phoneNumber: "541-535-4946",
            address: "6217 Coleman Creek Rd\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "4159": {
          init: {
            name: "Katrina Damon",
            clientId: "4159",
            phoneNumber: "541-538-0318",
            address: "2038 N Fork Little Butte Creek Rd\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 73,
              diameter: 46,
            },
          ],
        },
        "4175": {
          init: {
            name: "Cliff Geddis",
            clientId: "4175",
            phoneNumber: "949-683-5540",
            address: "1111 Netherlands Rd\nTrail",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 61,
              diameter: 37,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 1,
              shape: "oval",
              length: 61,
              depth: 28,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "4176": {
          init: {
            name: "Travis Weiss",
            clientId: "4176",
            phoneNumber: "707-972-3734",
            address: "2340 Cady Rd\nJacksonville",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 61,
              diameter: 46,
            },
          ],
        },
        "4188": {
          init: {
            name: "Carlos Martin",
            clientId: "4188",
            phoneNumber: "786-449-1375",
            address: "470 Red Blanket Rd\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 61,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
            {
              fuelTypeName: "DLS",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 37,
            },
          ],
        },
        "4224": {
          init: {
            name: "Tanya Sims",
            clientId: "4224",
            phoneNumber: "541-973-7848",
            address: "2090 Butte Falls Hwy\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 49,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "4234": {
          init: {
            name: "Darrel Smith",
            clientId: "4234",
            phoneNumber: "541-840-4815",
            address: "1124 E. Justice Rd\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 38,
            },
            {
              fuelTypeName: "HO1",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 37,
              diameter: 28,
            },
          ],
        },
        "4267": {
          init: {
            name: "Chris Eells",
            clientId: "4267",
            phoneNumber: "541-601-6073",
            address: "12155 Meadows Rd\nWhite City",
            notes: "Gate: 0502#",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 41,
            },
          ],
        },
        "4273": {
          init: {
            name: "The Rv Doctor",
            clientId: "4273",
            phoneNumber: "541-646-2435",
            address: "2295 Coker Butte Rd",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 36,
            },
          ],
        },
        "4301": {
          init: {
            name: "Magnolia Fine Homes",
            clientId: "4301",
            phoneNumber: "510-913-5110",
            address: "410 S Pacific Hwy\nTalent",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 80,
              diameter: 45,
            },
          ],
        },
        "4320": {
          init: {
            name: "Jana Hogan",
            clientId: "4320",
            phoneNumber: "541-261-8611",
            address: "776 Holcomb Springs Rd\nGold Hill",
            notes: "Gate: 4947",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 61,
              diameter: 37,
            },
          ],
        },
        "4326": {
          init: {
            name: "James Hunt",
            clientId: "4326",
            phoneNumber: "541-821-1424",
            address: "4534 Crowfoot Rd\nTrail",
            notes: "Driveway just north of Netherlands",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "oval",
              length: 60,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "4340": {
          init: {
            name: "Rusted Gate Farm",
            clientId: "4340",
            phoneNumber: "541-727-2806",
            address: "5700 Upton Rd\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 96,
              diameter: 41,
            },
            {
              fuelTypeName: "PRM",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 45,
            },
          ],
        },
        "4351": {
          init: {
            name: "IM Organic Corp",
            clientId: "4351",
            phoneNumber: "541-244-0730",
            address: "1 Ulrich Rd\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "4377": {
          init: {
            name: "Rogue Valley Precast",
            clientId: "4377",
            phoneNumber: "541-538-2500",
            address: "973 Ave G\nWhite City",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 80,
              diameter: 45,
            },
          ],
        },
        "4423": {
          init: {
            name: "Vern Lucas",
            clientId: "4423",
            phoneNumber: "541-821-6734",
            address: "407 Shady Lane\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 48,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "4426": {
          init: {
            name: "James Munter",
            clientId: "4426",
            phoneNumber: "541-879-9280",
            address: "363 Red Blanket Rd\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 49,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "4430": {
          init: {
            name: "Cesar Partida",
            clientId: "4430",
            phoneNumber: "530-941-8899",
            address: "6928 Wagner Creek Rd\nTalent",
            notes: "Tank is on right side of house.",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 38,
            },
          ],
        },
        "4434": {
          init: {
            name: "Nathan Reed",
            clientId: "4434",
            phoneNumber: "541-601-4606",
            address: "101 Daisy Creek Rd\nJacksonville",
            notes: "Gate: 1812",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "oval",
              length: 48,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "4446": {
          init: {
            name: "John Blanchard",
            clientId: "4446",
            phoneNumber: "541-826-7320",
            address: "1939 Dry Creek\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DLS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 80,
              diameter: 45,
            },
          ],
        },
        "4456": {
          init: {
            name: "Catherine Duerks",
            clientId: "4456",
            phoneNumber: "541-560-3238",
            address: "484 Red Blanket Rd\nProspect",
            notes: "Satanist . . . To pray for!",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 49,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "4463": {
          init: {
            name: "William Early",
            clientId: "4463",
            phoneNumber: "541-973-7007",
            address: "2601 Longbranch\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "oval",
              length: 61,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "4472": {
          init: {
            name: "Bart Masciarelli",
            clientId: "4472",
            phoneNumber: "541-897-6020",
            address: "9800 Sterling Creek Rd\nJacksonville",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "4478": {
          init: {
            name: "Neil Stewart",
            clientId: "4478",
            phoneNumber: "541-646-8630",
            address: "11747 Corp Ranch Rd\nAshland",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "4484": {
          init: {
            name: "Michael Inglis",
            clientId: "4484",
            phoneNumber: "408-499-6178",
            address: "14319 Hwy 238\nJacksonville",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DLS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 81,
              diameter: 45,
            },
          ],
        },
        "4493": {
          init: {
            name: "John Redline",
            clientId: "4493",
            phoneNumber: "541-841-1234",
            address: "4825 Butte Falls Hwy\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "oval",
              length: 48,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "4507": {
          init: {
            name: "Chad Pomeroy",
            clientId: "4507",
            phoneNumber: "541-821-0519",
            address: "2751 Alta Vista Rd\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "4511": {
          init: {
            name: "Rogue Family Farms",
            clientId: "4511",
            phoneNumber: "660-591-5891",
            address: "13003 Hwy 62\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 360,
              diameter: 95,
            },
            {
              fuelTypeName: "PRM",
              creationTimePosix: 1,
              shape: "oval",
              length: 60,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "4536": {
          init: {
            name: "Linda Bentley",
            clientId: "4536",
            phoneNumber: "541-538-9132",
            address: "35 Maple St\nShady Cove",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 28,
            },
          ],
        },
        "4558": {
          init: {
            name: "Chance & Aiden",
            clientId: "4558",
            phoneNumber: "808-227-3234",
            address: "222 Twin Bridges\nGold Hill",
            notes: "Gate: pin,888888,ok",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "PRM",
              creationTimePosix: 0,
              shape: "oval",
              length: 48,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 61,
              diameter: 45,
            },
          ],
        },
        "4566": {
          init: {
            name: "Ben Breiholz",
            clientId: "4566",
            phoneNumber: "541-944-2326",
            address: "2460 MillCreek Dr",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 49,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "4572": {
          init: {
            name: "Doug Handel",
            clientId: "4572",
            phoneNumber: "541-226-0166",
            address: "695 Laurel Ave\nButte Falls",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "oval",
              length: 48,
              depth: 27,
              fullHeight: 44,
              squareHeight: 17,
            },
          ],
        },
        "4591": {
          init: {
            name: "Kathleen Collins",
            clientId: "4591",
            phoneNumber: "541-890-5484",
            address: "25550 Hwy 62",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 60,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "4600": {
          init: {
            name: "Jeremiah Bartlett",
            clientId: "4600",
            phoneNumber: "503-756-6140",
            address: "1162 Hwy 227\nTrail",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 48,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "4609": {
          init: {
            name: "Carlos Barragan",
            clientId: "4609",
            phoneNumber: "541-973-3403",
            address: "2376 Holcomb Rd\nGold Hill",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "4615": {
          init: {
            name: "Michael Corson",
            clientId: "4615",
            phoneNumber: "541-660-9700",
            address: "7921 Sterling Creek Rd\nJacksonville",
            notes:
              "Split tank and full tank on stands are HS\nPlastic tank on ground is PRM",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 30,
              diameter: 45,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 42,
              diameter: 45,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 2,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 41,
            },
          ],
        },
        "4621": {
          init: {
            name: "Weatherly Court",
            clientId: "4621",
            phoneNumber: "541-951-7333",
            address: "2184 Poplar Dr\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "4624": {
          init: {
            name: "Summer Waters",
            clientId: "4624",
            phoneNumber: "541-865-3260, 541-326-8952",
            address: "3386 Fish Lake Rd\nButte Falls",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
          ],
        },
        "4645": {
          init: {
            name: "Trevor Williamson",
            clientId: "4645",
            phoneNumber: "541-499-5853",
            address: "2200 Hull Rd\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 61,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "4646": {
          init: {
            name: "David Lara",
            clientId: "4646",
            phoneNumber: "541-973-6886",
            address: "329 Upper Applegate Rd\nJacksonville",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 48,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "4675": {
          init: {
            name: "Chad Powell",
            clientId: "4675",
            phoneNumber: "541-499-8880",
            address: "2505 E Antelope \nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 37,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 37,
            },
          ],
        },
        "4679": {
          init: {
            name: "David Cain",
            clientId: "4679",
            phoneNumber: "541-531-4284",
            address: "2525 E Antelope \nEagle Point",
            notes: "Rocket stove and air rifles . . .",
          },
          deliveries: [],
          tanks: [],
        },
        "4682": {
          init: {
            name: "Niedermeyer Farms",
            clientId: "4682",
            phoneNumber: "541-659-2819",
            address: "77 Hanley Rd",
            notes: "400 HS",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 72,
              diameter: 45,
            },
          ],
        },
        "4697": {
          init: {
            name: "Urban Pharms",
            clientId: "4697",
            phoneNumber: "707-599-2926 Connie\n541-778-4823",
            address: "4491 Campbell Rd\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 46,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 74,
              diameter: 37,
            },
          ],
        },
        "4715": {
          init: {
            name: "Dick Hendricks",
            clientId: "4715",
            phoneNumber: "541-646-6915",
            address: "4477 N Obenchain\nEagle Point",
            notes: "From Butte Falls side",
          },
          deliveries: [],
          tanks: [],
        },
        "4732": {
          init: {
            name: "Lost Creek",
            clientId: "4732",
            phoneNumber: "707-888-0793",
            address: "1445 Laurelhurst\nTrail",
            notes: "Gate: 3030",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 145,
              diameter: 45,
            },
            {
              fuelTypeName: "DLS",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
          ],
        },
        "4733": {
          init: {
            name: "Bill Wilkins",
            clientId: "4733",
            phoneNumber: "541-821-1661",
            address: "8789 Old Stage Rd\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 61,
              diameter: 38,
            },
          ],
        },
        "4738": {
          init: {
            name: "Robert Brick",
            clientId: "4738",
            phoneNumber: "541-227-1444",
            address: "6500 Monte Vista Ct\nEagle Point",
            notes: "Small rectangle tank, Vertical Round tank",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "rectangle",
              length: 54,
              depth: 15,
              height: 27,
            },
            {
              fuelTypeName: "HO1",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 37,
            },
          ],
        },
        "4741": {
          init: {
            name: "Thomson Farms LLC",
            clientId: "4741",
            phoneNumber: "541-690-7275",
            address: "12939 Modoc Rd\nWhite City",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 134,
              diameter: 59,
            },
          ],
        },
        "4743": {
          init: {
            name: "Joy Young",
            clientId: "4743",
            phoneNumber: "541-698-7951",
            address: "381 Red Blanket Rd\nProspect",
            notes: "Gate: 1776",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
          ],
        },
        "4751": {
          init: {
            name: "Joel Brown",
            clientId: "4751",
            phoneNumber: "707-834-7774",
            address: "16850 Jones Rd\nWhite City",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DLS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 72,
              diameter: 47,
            },
          ],
        },
        "4766": {
          init: {
            name: "Stacey Chaplin",
            clientId: "4766",
            phoneNumber: "541-840-8402",
            address: "3617 Ross Lane\nCentral Point",
            notes:
              "Inground tank to the right of attached 2 car garage.\nReverse Calculated tank size: 9.5” + 25 = 12.5” + 25 = 15.25” + 25 = 18.25” + 25 = 20.75”",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 45,
            },
          ],
        },
        "4799": {
          init: {
            name: "Zach Wooldridge",
            clientId: "4799",
            phoneNumber: "Brian: 541-210-1913\n213-219-6774",
            address: "11396 Dennis Rd\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 76,
              diameter: 45,
            },
          ],
        },
        "4814": {
          init: {
            name: "Dan Schleigh",
            clientId: "4814",
            phoneNumber: "541-538-9547",
            address: "2486 Salt Creek\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 38,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 80,
              diameter: 45,
            },
          ],
        },
        "4824": {
          init: {
            name: "Rick Ehlers",
            clientId: "4824",
            phoneNumber: "541-890-4056",
            address: "400 NO NAME LN????\nTrail",
            notes: "///deduct.sulked.barged",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DLS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 42,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 37,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 2,
              shape: "horizontalCylinder",
              length: 80,
              diameter: 22,
            },
          ],
        },
        "4825": {
          init: {
            name: "Valerie Holbo",
            clientId: "4825",
            phoneNumber: "541-944-0680",
            address: "11475 Hwy 66\nAshland",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
          ],
        },
        "4838": {
          init: {
            name: "Mark Vollmer",
            clientId: "4838",
            phoneNumber: "310-567-8218",
            address: "7159 Crowfoot Rd\nTrail",
            notes: "Gate: 0852#",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DLS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 38,
            },
          ],
        },
        "4839": {
          init: {
            name: "Target 0613",
            clientId: "4839",
            phoneNumber: "763-390-8553",
            address: "2000 Crater Lake Hwy\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "4857": {
          init: {
            name: "R Damon Services",
            clientId: "4857",
            phoneNumber: "541-821-4540",
            address: "2083 N Fork Little Butte Creek Rd\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 76,
              diameter: 46,
            },
          ],
        },
        "4861": {
          init: {
            name: "Doug Vetch",
            clientId: "4861",
            phoneNumber: "541-601-2458",
            address: "7200 Hwy 234\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "4866": {
          init: {
            name: "Clay Thomas",
            clientId: "4866",
            phoneNumber: "406-250-9262",
            address: "428 Red Blanket Rd\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 48,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "4867": {
          init: {
            name: "Gary Haas",
            clientId: "4867",
            phoneNumber: "541-826-4852",
            address: "13531 Hal Ln\nWhite City",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 60,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "4888": {
          init: {
            name: "Robert Kasper",
            clientId: "4888",
            phoneNumber: "541-538-0849",
            address: "895 Rocky Rd\nTrail",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 61,
              diameter: 45,
            },
          ],
        },
        "4896": {
          init: {
            name: "Jennifer / Bill Fisher",
            clientId: "4896",
            phoneNumber: "541-326-9199",
            address: "200A Butte Falls Hwy\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 61,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "4902": {
          init: {
            name: "Brice Taylor",
            clientId: "4902",
            phoneNumber: "312-925-9311",
            address: "1657 Old Stage Rd\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 96,
              diameter: 41,
            },
          ],
        },
        "4906": {
          init: {
            name: "Byron Lee",
            clientId: "4906",
            phoneNumber: "541-630-0260",
            address: "883 Old Stage Rd\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "oval",
              length: 60,
              depth: 27,
              fullHeight: 44,
              squareHeight: 17,
            },
          ],
        },
        "4924": {
          init: {
            name: "Josh O’Neill / Blake Butterman",
            clientId: "4924",
            phoneNumber: "808-639-3735\n541-450-7189",
            address: "11048 Hwy 238\nJacksonville",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "oval",
              length: 48,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "4939": {
          init: {
            name: "John Garfield",
            clientId: "4939",
            phoneNumber: "541-690-5493",
            address: "377 Ball Rd\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "4955": {
          init: {
            name: "Daniel Clay",
            clientId: "4955",
            phoneNumber: "541-363-1687",
            address: "155 Black Oak Dr\nShady Cove",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 48,
              depth: 27,
              fullHeight: 44,
              squareHeight: 17,
            },
          ],
        },
        "4957": {
          init: {
            name: "Jeff Amidon",
            clientId: "4957",
            phoneNumber: "541-821-8848",
            address: "2551 Red Blanket Rd\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 45,
            },
          ],
        },
        "4962": {
          init: {
            name: "Richard Matthews",
            clientId: "4962",
            phoneNumber: "925-768-8002",
            address: "1074 Cherry St\nMedford",
            notes: "Tank behind shop",
          },
          deliveries: [],
          tanks: [],
        },
        "4979": {
          init: {
            name: "Earl Tye",
            clientId: "4979",
            phoneNumber: "541-601-2645",
            address: "2315 Lark Lane\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "oval",
              length: 48,
              depth: 27,
              fullHeight: 44,
              squareHeight: 17,
            },
          ],
        },
        "4982": {
          init: {
            name: "Josh Bossard",
            clientId: "4982",
            phoneNumber: "808-280-8255",
            address: "4400 Upper River Rd\nGold Hill",
            notes: "Gate: 1776*",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
          ],
        },
        "4984": {
          init: {
            name: "Mikala Hoffman",
            clientId: "4984",
            phoneNumber: "541-806-4203",
            address: "492 Red Blanket Rd\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 48,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "4991": {
          init: {
            name: "Harris Dust Control",
            clientId: "4991",
            phoneNumber: "541-727-7284",
            address: "5405 East Antelope\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "PRM",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 61,
              diameter: 45,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 144,
              diameter: 45,
            },
          ],
        },
        "5006": {
          init: {
            name: "Kuldip Dhar",
            clientId: "5006",
            phoneNumber: "925-640-9658",
            address: "25546 Hwy 62\nTrail",
            notes: "Combo: 5575",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
          ],
        },
        "5011": {
          init: {
            name: "VA Fuel Truck K&E Excavating",
            clientId: "5011",
            phoneNumber: "541-223-2389",
            address: "8495 Crater Lake Hwy\nWhite City",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DLS",
              creationTimePosix: 0,
              shape: "rectangle",
              length: 128,
              depth: 90,
              height: 44,
            },
          ],
        },
        "5033": {
          init: {
            name: "Andy Pollack",
            clientId: "5033",
            phoneNumber: "954-588-9522",
            address: "8830 S Fork Little Butte Creek\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 72,
              diameter: 45,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 41,
            },
          ],
        },
        "5036": {
          init: {
            name: "Brandon Bach",
            clientId: "5036",
            phoneNumber: "617-721-8022",
            address: "4360 N Foothills Rd\nMedford",
            notes: "Steep driveway turnaround . . .",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "rectangle",
              length: 44,
              depth: 32,
              height: 25,
            },
          ],
        },
        "5043": {
          init: {
            name: "Randy Schock",
            clientId: "5043",
            phoneNumber: "541-291-0717",
            address: "8300 Gold Ray Rd\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
            {
              fuelTypeName: "PRM",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 42,
            },
          ],
        },
        "5054": {
          init: {
            name: "Daniels Cattle Co",
            clientId: "5054",
            phoneNumber: "541-890-7696",
            address: "2887 Meridian Rd\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "oval",
              length: 61,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 72,
              diameter: 45,
            },
            {
              fuelTypeName: "PRM",
              creationTimePosix: 2,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 30,
            },
          ],
        },
        "5055": {
          init: {
            name: "Jansen Construction",
            clientId: "5055",
            phoneNumber: "503-984-2655",
            address: "2399 S Pacific Hwy\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "5065": {
          init: {
            name: "Mountain Tree Care",
            clientId: "5065",
            phoneNumber: "541-261-8163",
            address: "1654 Thomas Rd\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "5068": {
          init: {
            name: "Lance Hill",
            clientId: "5068",
            phoneNumber: "541-944-3075",
            address: "2341 Stevens Rd\nEagle Point",
            notes: "Gate: 3075",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 96,
              diameter: 41,
            },
          ],
        },
        "5079": {
          init: {
            name: "Matador",
            clientId: "5079",
            phoneNumber: "541-852-6159",
            address: "5263 Sams Valley Rd\nGold Hill",
            notes:
              "Main Gate: 8282, 6969, 1359\nSite 8: 0101\nSite 3: 6666\nHS: L96, D42",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 96,
              diameter: 42,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 37,
            },
            {
              fuelTypeName: "PD8",
              creationTimePosix: 2,
              shape: "horizontalCylinder",
              length: 66,
              diameter: 48,
            },
            {
              fuelTypeName: "PD3",
              creationTimePosix: 3,
              shape: "rectangle",
              length: 120,
              depth: 47,
              height: 29,
            },
            {
              fuelTypeName: "PD7",
              creationTimePosix: 4,
              shape: "horizontalCylinder",
              length: 73,
              diameter: 46,
            },
            {
              fuelTypeName: "PD3",
              creationTimePosix: 5,
              shape: "horizontalCylinder",
              length: 73,
              diameter: 46,
            },
          ],
        },
        "5084": {
          init: {
            name: "John Hernandez",
            clientId: "5084",
            phoneNumber: "413-207-1173",
            address: "3788 Hwy 238\nJacksonville",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 61,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "5085": {
          init: {
            name: "TJ Rice",
            clientId: "5085",
            phoneNumber: "707-407-8851",
            address: "5277 Colver Rd\nTalent",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 145,
              diameter: 45,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 38,
            },
          ],
        },
        "5115": {
          init: {
            name: "John Barceloux",
            clientId: "5115",
            phoneNumber: "541-826-0589",
            address: "10440 S Fork Little Butte Creek\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DLS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 38,
            },
          ],
        },
        "5121": {
          init: {
            name: "Ed Hargrove",
            clientId: "5121",
            phoneNumber: "541-865-3409",
            address: "5591 N Obenchain\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 41,
            },
          ],
        },
        "5129": {
          init: {
            name: "Dan Raybould",
            clientId: "5129",
            phoneNumber: "541991-1030",
            address: "4495 Merita Terrace\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 54,
              diameter: 27,
            },
          ],
        },
        "5133": {
          init: {
            name: "Figueroa’ s Landscaping",
            clientId: "5133",
            phoneNumber: "541-621-8970",
            address: "1092 Gibbon Rd\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DLS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 143,
              diameter: 45,
            },
          ],
        },
        "5141": {
          init: {
            name: "CDSM LLC",
            clientId: "5141",
            phoneNumber: "541-324-6591",
            address: "4175 Hwy 234",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 145,
              diameter: 45,
            },
          ],
        },
        "5145": {
          init: {
            name: "Eagle Point Cell Tower",
            clientId: "5145",
            phoneNumber:
              "1-877-746-9360 Option 2 . . . Check in/out\n1-913-643-2292",
            address: "1842 Gardner\nEagle Point",
            notes: "Lock: 1220",
          },
          deliveries: [],
          tanks: [],
        },
        "5156": {
          init: {
            name: "Francis Fowler",
            clientId: "5156",
            phoneNumber: "541-830-0675",
            address: "8100 Lost Creek Rd\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "PRM",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 206,
              diameter: 95,
            },
          ],
        },
        "5160": {
          init: {
            name: "Roeloffs Family Farm",
            clientId: "5160",
            phoneNumber: "541-771-2818",
            address: "11830 Hwy 238",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "5164": {
          init: {
            name: "Jerry Geerdes",
            clientId: "5164",
            phoneNumber: "541-973-4289",
            address: "12594 McNeil Creek Rd\nTrail",
            notes: "Access from Hwy 62",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "PRM",
              creationTimePosix: 0,
              shape: "oval",
              length: 49,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "5168": {
          init: {
            name: "Sue Ruddick",
            clientId: "5168",
            phoneNumber: "541-621-4401",
            address: "130 Tumbleweed Trail",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 61,
              diameter: 38,
            },
          ],
        },
        "5179": {
          init: {
            name: "Coleman Oil Company / Veterans Admistration",
            clientId: "5179",
            phoneNumber: "",
            address: "8495 Crater Lake Hwy\nWhite City",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "rectangle",
              length: 126,
              depth: 80,
              height: 69,
            },
          ],
        },
        "5181": {
          init: {
            name: "Kari & Joseph Hatten",
            clientId: "5181",
            phoneNumber: "541-840-5451",
            address: "5900 Peace Ln\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DLS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 71,
              diameter: 45,
            },
          ],
        },
        "5185": {
          init: {
            name: "Ron Brion",
            clientId: "5185",
            phoneNumber: "541-890-3509",
            address: "5864 Peace Lane\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DLS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 42,
            },
          ],
        },
        "5186": {
          init: {
            name: "Accurate Electric",
            clientId: "5186",
            phoneNumber: "541-245-6788",
            address: "2160 Crestbrook Unit 15\nMedford",
            notes: "Gate: 3474",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DLS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 80,
              diameter: 45,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 38,
            },
          ],
        },
        "5192": {
          init: {
            name: "Slayden Construction",
            clientId: "5192",
            phoneNumber: "541-290-1873",
            address: "8301 Table Rock Rd\nCentral Point",
            notes: "Gate: 7396#",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 72,
              diameter: 45,
            },
          ],
        },
        "5205": {
          init: {
            name: "KOA Remley",
            clientId: "5205",
            phoneNumber: "541-855-7710",
            address: "12297 Blackwell Rd\nCentral Point?",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 38,
            },
          ],
        },
        "5219": {
          init: {
            name: "Applegate Store",
            clientId: "5219",
            phoneNumber: "541-846-6659",
            address: "15095 Hwy 238",
            notes: "800UL\n150PRM\n200LS",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 104,
              diameter: 76,
            },
            {
              fuelTypeName: "DLS",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 53,
              diameter: 76,
            },
            {
              fuelTypeName: "PRM",
              creationTimePosix: 2,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 76,
            },
          ],
        },
        "5226": {
          init: {
            name: "Southern Oregon Motorsports",
            clientId: "5226",
            phoneNumber: "541-326-5883",
            address: "6900 Kershaw Rd\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 81,
              diameter: 46,
            },
          ],
        },
        "5227": {
          init: {
            name: "Thomas Brook Trucking",
            clientId: "5227",
            phoneNumber: "541-621-0164",
            address: "30000 Hwy 62\nTrail",
            notes: "Gate: 0852#",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 97,
              diameter: 41,
            },
          ],
        },
        "5234": {
          init: {
            name: "Joseph & Kaydell Smith",
            clientId: "5234",
            phoneNumber: "541-331-5909",
            address: "5584 Old Hwy 99 South\nAshland",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
          ],
        },
        "5251": {
          init: {
            name: "Diamond D Welding",
            clientId: "5251",
            phoneNumber: "541-301-7696",
            address: "214 Hammel Rd\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 72,
              diameter: 45,
            },
          ],
        },
        "5252": {
          init: {
            name: "Cowhorn Vineyard & Garden",
            clientId: "5252",
            phoneNumber: "805-729-3114",
            address: "1665 Eastside Rd\nJacksonville",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 41,
            },
          ],
        },
        "5269": {
          init: {
            name: "Parker Excavation & Landscape",
            clientId: "5269",
            phoneNumber: "541-899-7355\nJennifer: 541-227-8040",
            address: "1755 Upper Applegate Rd\nJacksonville",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 145,
              diameter: 45,
            },
            {
              fuelTypeName: "PRM",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 61,
              diameter: 38,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 2,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
            {
              fuelTypeName: "DLS",
              creationTimePosix: 3,
              shape: "horizontalCylinder",
              length: 73,
              diameter: 47,
            },
          ],
        },
        "5280": {
          init: {
            name: "John Swift",
            clientId: "5280",
            phoneNumber: "541-261-0611",
            address: "3302 Hwy 227\nTrail",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "5284": {
          init: {
            name: "Harmon O’Donal",
            clientId: "5284",
            phoneNumber: "541-826-5573",
            address: "14214 East Antelope Rd\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "5304": {
          init: {
            name: "Richard McKee",
            clientId: "5304",
            phoneNumber: "513-630-7794",
            address: "6477 Crater Lake Hwy\nCentral Point",
            notes: "3 tanks . . .",
          },
          deliveries: [],
          tanks: [],
        },
        "5307": {
          init: {
            name: "Donovan Mahoney",
            clientId: "5307",
            phoneNumber: "541-350-4800",
            address: "13213 Ramsey Rd\nGold Hill",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "5309": {
          init: {
            name: "Topline Construction",
            clientId: "5309",
            phoneNumber: "541-621-1332",
            address: "1252 W McAndrews Suite 4\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DLS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
          ],
        },
        "5337": {
          init: {
            name: "RV Concepts LLC",
            clientId: "5337",
            phoneNumber: "541-941-9581",
            address: "6044 Foothills Rd\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 61,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "5344": {
          init: {
            name: "Cody Mattheison",
            clientId: "5344",
            phoneNumber: "541-821-1555",
            address: "2779 Meridian Rd\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 37,
            },
          ],
        },
        "5360": {
          init: {
            name: "Dave’s Tractor Service",
            clientId: "5360",
            phoneNumber: "541-941-1159",
            address: "1173 Casino Rd\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 45,
            },
          ],
        },
        "5363": {
          init: {
            name: "Dinsdale Farm & Equipment LLC",
            clientId: "5363",
            phoneNumber: "541-728-1620 Bend\n541-576-2440 Silver Lake",
            address: "///organ.stole.member\n4370 Fern Valley Rd\nPhoenix",
            notes: "No Topfill. Tank has 3” female camlock.",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 266,
              diameter: 95,
            },
          ],
        },
        "5367": {
          init: {
            name: "Alyshia Peck",
            clientId: "5367",
            phoneNumber: "541-560-3209",
            address: "520 Broad St\nButte Falls",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 49,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "5370": {
          init: {
            name: "Jeff Stillman",
            clientId: "5370",
            phoneNumber: "541-499-2207",
            address: "12345 N Obenchain\nEagle Point",
            notes:
              "Access from Butte Falls side. There is a valve between tanks. Check to make sure it is closed.",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 26,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 1,
              shape: "rectangle",
              length: 45,
              depth: 23,
              height: 24,
            },
          ],
        },
        "5371": {
          init: {
            name: "Alice Conner",
            clientId: "5371",
            phoneNumber: "541-878-4312",
            address: "20231 Hwy 62\nShady Cove",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 41,
            },
          ],
        },
        "5394": {
          init: {
            name: "Ernie & Betty Strickland",
            clientId: "5394",
            phoneNumber: "541-560-3711",
            address: "2700 Lewis Rd",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "5395": {
          init: {
            name: "Spencer Williams",
            clientId: "5395",
            phoneNumber: "541-324-4903",
            address: "3 Ulrich Rd\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 48,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "5407": {
          init: {
            name: "Jack Jermain",
            clientId: "5407",
            phoneNumber: "541-821-5082",
            address: "18648 Hwy 62\nEagle Point",
            notes: "Gate: 1957",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 41,
            },
          ],
        },
        "5416": {
          init: {
            name: "Ancheta Holdings",
            clientId: "5416",
            phoneNumber: "213-804-4684",
            address: "4533 Old Stage Rd\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "oval",
              length: 49,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "5426": {
          init: {
            name: "Matthew Lister",
            clientId: "5426",
            phoneNumber: "502-424-5997",
            address: "1703 Arnold Lane\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 46,
              diameter: 37,
            },
          ],
        },
        "5437": {
          init: {
            name: "Stephan Long",
            clientId: "5437",
            phoneNumber: "408-966-0941",
            address: "19025 Hwy 140\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 41,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 73,
              diameter: 45,
            },
          ],
        },
        "5443": {
          init: {
            name: "Alanna Keneshiro",
            clientId: "5443",
            phoneNumber: "408-630–5131",
            address: "15 Black Oak Drive\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "5446": {
          init: {
            name: "Lisa Dalbec",
            clientId: "5446",
            phoneNumber: "541-973-9071",
            address: "2477 Coker Butte Rd\nMeford",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "5448": {
          init: {
            name: "Scott Larue",
            clientId: "5448",
            phoneNumber: "541-890-0342",
            address: "1260 Yankee Creek\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 72,
              diameter: 45,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 119,
              diameter: 37,
            },
          ],
        },
        "5451": {
          init: {
            name: "Brian Simmons",
            clientId: "5451",
            phoneNumber: "541-954-7758",
            address: "401 Red Blanket Rd\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
          ],
        },
        "5453": {
          init: {
            name: "Thomas Heck",
            clientId: "5453",
            phoneNumber: "541-855-8635",
            address: "7800 Old Stage rd\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 45,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 45,
            },
          ],
        },
        "5456": {
          init: {
            name: "Bill Griffith",
            clientId: "5456",
            phoneNumber: "541-821-4818",
            address: "19074 Antioch\nWhite City",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 50,
              diameter: 37,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 73,
              diameter: 45,
            },
            {
              fuelTypeName: "PRM",
              creationTimePosix: 2,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
            {
              fuelTypeName: "DLS",
              creationTimePosix: 3,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
          ],
        },
        "5464": {
          init: {
            name: "Brody Nelson",
            clientId: "5464",
            phoneNumber: "541-973-4321",
            address: "16404 Shiloh  Rd\nWhite City",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "5466": {
          init: {
            name: "Long Heating",
            clientId: "5466",
            phoneNumber: "541-301-3305",
            address: "4642 Table Rock Rd\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
          ],
        },
        "5476": {
          init: {
            name: "Jackie Cook",
            clientId: "5476",
            phoneNumber: "541-601-4301",
            address: "11775 Michael Rd\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 48,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "5480": {
          init: {
            name: "Gary West",
            clientId: "5480",
            phoneNumber: "541-840-1938",
            address: "102 Birch St\nShady Cove",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 36,
            },
          ],
        },
        "5490": {
          init: {
            name: "Paul Kospenko",
            clientId: "5490",
            phoneNumber: "541-389-4334",
            address: "5088 Sam’s Valley Rd\nGold Hill",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 61,
              diameter: 45,
            },
          ],
        },
        "5498": {
          init: {
            name: "Dauenhauer Cattle",
            clientId: "5498",
            phoneNumber: "541-531-6538",
            address: "4760 Payne Rd\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "5500": {
          init: {
            name: "Van Row Mechanical",
            clientId: "5500",
            phoneNumber: "541-890-3500",
            address: "8495 Crater Lake Hwy\nWhite City",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "5508": {
          init: {
            name: "L & Z Farm LLC",
            clientId: "5508",
            phoneNumber: "909-377-7687",
            address: "3941 Sam’s Valley Rd",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "5520": {
          init: {
            name: "Rogue Valley Equestrian Center",
            clientId: "5520",
            phoneNumber: "541-256-0069",
            address: "1663 South Stage Rd\nMedford",
            notes:
              "Tank is in garage all the way up the driveway and to the right of the houses.",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "oval",
              length: 48,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "5522": {
          init: {
            name: "Shane Hines",
            clientId: "5522",
            phoneNumber: "541-951-3802",
            address: "2540 MillCreek Dr\nProspect",
            notes: "Close Valve on Garage",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 36,
              diameter: 30,
            },
            {
              fuelTypeName: "HO1",
              creationTimePosix: 1,
              shape: "oval",
              length: 49,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "5528": {
          init: {
            name: "Kristina Alvarez",
            clientId: "5528",
            phoneNumber: "541-973-9483",
            address: "1675 Old Stage Rd\nCentral Point",
            notes:
              "Head up driveway. Silver tank on left across road from 1678.",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 61,
              diameter: 45,
            },
          ],
        },
        "5545": {
          init: {
            name: "Linda Morton",
            clientId: "5545",
            phoneNumber: "541-973-3186",
            address: "243 S Street\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 61,
              diameter: 45,
            },
          ],
        },
        "5580": {
          init: {
            name: "Harley Davidson",
            clientId: "5580",
            phoneNumber: "541-601-7741",
            address: "1173 Vawter Rd\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "5587": {
          init: {
            name: "Christian Kitchin",
            clientId: "5587",
            phoneNumber: "415-531-3171",
            address: "2520 Colestine Rd\nAshland",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 95,
              diameter: 41,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 45,
            },
          ],
        },
        "5596": {
          init: {
            name: "KW Consulting LLC",
            clientId: "5596",
            phoneNumber: "541-601-7536",
            address: "6515 Truax Rd\nCentral Point",
            notes: "Gate: 76251",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 112,
              diameter: 79,
            },
          ],
        },
        "5603": {
          init: {
            name: "St Morand Vineyard",
            clientId: "5603",
            phoneNumber: "541-613-9323",
            address: "925 Anderson Creek Rd\nTalent",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
          ],
        },
        "5605": {
          init: {
            name: "Wendell Heidinger",
            clientId: "5605",
            phoneNumber: "541-591-0963",
            address: "1018 McDonough\nGold Hill",
            notes: "2 Drums in shed on right side of property.",
          },
          deliveries: [],
          tanks: [],
        },
        "5610": {
          init: {
            name: "Chad Marshall",
            clientId: "5610",
            phoneNumber: "541-899-9966",
            address: "12700 Upper Applegate Rd\nJacksonville",
            notes: "Don’t get oil on driveway pavers.",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 73,
              diameter: 45,
            },
          ],
        },
        "5611": {
          init: {
            name: "Ed Barnal",
            clientId: "5611",
            phoneNumber: "925-548-9167",
            address: "1875 McDonough Rd\nGold Hill",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 83,
              diameter: 30,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 39,
            },
            {
              fuelTypeName: "HO1",
              creationTimePosix: 2,
              shape: "oval",
              length: 61,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "5620": {
          init: {
            name: "Crater Lake Surgery Center",
            clientId: "5620",
            phoneNumber: "541-200-3617\n541-200-3600",
            address: "833 Bennett\nMedford",
            notes:
              "Generator . . . USE CAMLOCK FITTING!!!\nOnly fill to 3/4 mark or overfill alarm will come on!",
          },
          deliveries: [],
          tanks: [],
        },
        "5635": {
          init: {
            name: "Norn Kreisler",
            clientId: "5635",
            phoneNumber: "510-717-2613",
            address: "7326 Dark Hollow Rd\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 72,
              diameter: 45,
            },
          ],
        },
        "5640": {
          init: {
            name: "Curtis Murphy",
            clientId: "5640",
            phoneNumber: "916-397-5010",
            address: "1097 Brentwood Dr\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DLS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 72,
              diameter: 45,
            },
          ],
        },
        "5657": {
          init: {
            name: "MSM Property LLC",
            clientId: "5657",
            phoneNumber: "773-999-5153",
            address: "1011 or 1020 Oak Rock Run\nWhite City",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "5661": {
          init: {
            name: "Susan Boston",
            clientId: "5661",
            phoneNumber: "541-899-6964",
            address: "4513 Forest Creek Rd\nJacksonville",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
          ],
        },
        "5665": {
          init: {
            name: "Andrew Watson",
            clientId: "5665",
            phoneNumber: "541-846-0404",
            address: "909 Cantrall Rd\nJacksonville",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 41,
            },
          ],
        },
        "5666": {
          init: {
            name: "CLT Logging / Fuel Truck",
            clientId: "5666",
            phoneNumber: "Danny: 530-276-7195\nTerry: 541-821-1931",
            address: "",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "5673": {
          init: {
            name: "Erin Krupp",
            clientId: "5673",
            phoneNumber: "541-295-9939",
            address: "7810 Upper Applegate Rd\nJacksonville",
            notes:
              "Fill 50 gallon drum behind shed. Then rest goes in other tank.",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 61,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "5684": {
          init: {
            name: "Scott Rosendahl",
            clientId: "5684",
            phoneNumber: "541-210-6024",
            address: "1127 Derby Rd\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "oval",
              length: 60,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "5688": {
          init: {
            name: "Linda Hoffman",
            clientId: "5688",
            phoneNumber: "541-826-8181",
            address: "635 Bigham Brown\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 48,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "5696": {
          init: {
            name: "Ken Brown Construction",
            clientId: "5696",
            phoneNumber: "541-292-7696",
            address: "8147 Blackwell Rd\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "5700": {
          init: {
            name: "Pauline O’Donnell",
            clientId: "5700",
            phoneNumber: "541-890-2350",
            address: "428 Fir Ave",
            notes: "Butte Falls",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "oval",
              length: 49,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "5702": {
          init: {
            name: "ZSM LLC",
            clientId: "5702",
            phoneNumber: "828-699-6857",
            address: "240 Hogan Rd\nJacksonville",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 61,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "5712": {
          init: {
            name: "Olin Dunphy",
            clientId: "5712",
            phoneNumber: "541-879-1993",
            address: "1683 Old Hwy 99 S\nAshland",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 48,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "5717": {
          init: {
            name: "Sara Wallace",
            clientId: "5717",
            phoneNumber: "541-973-6947",
            address: "23611 Hwy 62 Unit 31\nTrail",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 48,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "5719": {
          init: {
            name: "Craig Glos",
            clientId: "5719",
            phoneNumber: "541-499-9023",
            address: "2951 Phillips Way\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 80,
              diameter: 45,
            },
          ],
        },
        "5722": {
          init: {
            name: "Dave Wood",
            clientId: "5722",
            phoneNumber: "541-840-3460",
            address: "1944 Upper Applegate Rd\nJacksonville",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DLS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 42,
            },
            {
              fuelTypeName: "PRM",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 38,
            },
          ],
        },
        "5726": {
          init: {
            name: "Rolland & Judy Burton",
            clientId: "5726",
            phoneNumber: "541-630-6902",
            address: "808 Cedar St\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "5729": {
          init: {
            name: "Russel Smith",
            clientId: "5729",
            phoneNumber: "206-228-1491",
            address: "426 Benson St\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
          ],
        },
        "5731": {
          init: {
            name: "Mark Kesler",
            clientId: "5731",
            phoneNumber: "541-227-8185",
            address: "1966 Ross Ln\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 26,
            },
            {
              fuelTypeName: "HO1",
              creationTimePosix: 1,
              shape: "oval",
              length: 49,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "5733": {
          init: {
            name: "Ron Willis",
            clientId: "5733",
            phoneNumber: "541-821-5034",
            address: "809 Elder Mill Rd\nTrail",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 45,
            },
            {
              fuelTypeName: "HO1",
              creationTimePosix: 1,
              shape: "oval",
              length: 72,
              depth: 36,
              fullHeight: 47,
              squareHeight: 13,
            },
          ],
        },
        "5734": {
          init: {
            name: "Bunny Nisbet",
            clientId: "5734",
            phoneNumber: "541-890-4700",
            address: "6629 McLaughlin Dr\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 49,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "5736": {
          init: {
            name: "Jennifer Holsomback",
            clientId: "5736",
            phoneNumber: "541-890-6865",
            address: "1999 Little Applegate Rd",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 51,
              diameter: 38,
            },
          ],
        },
        "5738": {
          init: {
            name: "Tom McNeil",
            clientId: "5738",
            phoneNumber: "541-941-4781",
            address: "9920 Blackwell Rd\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 26,
            },
          ],
        },
        "5739": {
          init: {
            name: "Reed Rydberg",
            clientId: "5739",
            phoneNumber: "541-840-0213",
            address: "3375 Fish Lake Rd\nButte Falls",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "oval",
              length: 61,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "5752": {
          init: {
            name: "Curt McDonald",
            clientId: "5752",
            phoneNumber: "541-941-9204",
            address: "4040 Corey Rd\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "5753": {
          init: {
            name: "Todd Pershing",
            clientId: "5753",
            phoneNumber: "916-316-0331",
            address: "21403 E Evans Creek\nWhite City",
            notes: "Gate: 1950",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DLS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 81,
              diameter: 45,
            },
          ],
        },
        "5756": {
          init: {
            name: "Joel Storts",
            clientId: "5756",
            phoneNumber: "541-778-6011",
            address: "22071 Hwy 62 Unit #1",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 42,
            },
          ],
        },
        "5769": {
          init: {
            name: "Aaron Hohman",
            clientId: "5769",
            phoneNumber: "541-280-4072",
            address: "3775 Brownsboro Rd\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
          ],
        },
        "5772": {
          init: {
            name: "Holly Dale",
            clientId: "5772",
            phoneNumber: "541-941-8122\n541-944-5030",
            address: "4796 Sams Valley Rd\nGold Hill",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 45,
            },
          ],
        },
        "5774": {
          init: {
            name: "Ron Tilley",
            clientId: "5774",
            phoneNumber: "541-621-6103",
            address: "655 Cedar Ave\nButte Falls",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 61,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
            {
              fuelTypeName: "HO1",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 61,
              diameter: 45,
            },
          ],
        },
        "5778": {
          init: {
            name: "Garrett Collins",
            clientId: "5778",
            phoneNumber: "707-363-0751",
            address: "1720 Thompson Creek Rd\nJacksonville",
            notes: "No turnaround.",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "oval",
              length: 72,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "5784": {
          init: {
            name: "Ivan Royer",
            clientId: "5784",
            phoneNumber: "541-218-9552",
            address: "13473 Hwy 234\nGold Hill",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 72,
              diameter: 45,
            },
          ],
        },
        "5792": {
          init: {
            name: "Rayline Barker",
            clientId: "5792",
            phoneNumber: "541-621-3798",
            address: "2342 Galls Creek Rd\nGold Hill",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "5795": {
          init: {
            name: "Susie Harryman",
            clientId: "5795",
            phoneNumber: "541-944-7943",
            address: "5808 Abbie Ln\nGold Hill",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 60,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "5797": {
          init: {
            name: "Brad Kennedy",
            clientId: "5797",
            phoneNumber: "541-414-8753\n541-301-1865 Kathy",
            address: "10355 Hwy 238",
            notes: "On left just before mile marker 23",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
          ],
        },
        "5805": {
          init: {
            name: "Rita Martinez",
            clientId: "5805",
            phoneNumber: "541-613-3506",
            address: "102 Birch St\nShady Cove",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 36,
            },
          ],
        },
        "5808": {
          init: {
            name: "Timothy Olson",
            clientId: "5808",
            phoneNumber: "541-646-0086",
            address: "240 Hogan Rd\nJacksonville",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 61,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "5810": {
          init: {
            name: "Eliza Wiedman",
            clientId: "5810",
            phoneNumber: "Home: 541-773-1200\nCell: 541-821-4499",
            address: "5508 Pioneer Rd\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 60,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "5825": {
          init: {
            name: "David Pistel",
            clientId: "5825",
            phoneNumber: "541-842-0229",
            address: "2285 Cady rd\nJacksonville",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "5830": {
          init: {
            name: "Christina Williams",
            clientId: "5830",
            phoneNumber: "541-324-6591",
            address: "4175 Hwy 234",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "5857": {
          init: {
            name: "Corey Rauch",
            clientId: "5857",
            phoneNumber: "541-890-9985",
            address: "40871 Hwy 62\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "5859": {
          init: {
            name: "Merle Fenn",
            clientId: "5859",
            phoneNumber: "541-951-3013",
            address: "451 Elder Mill Rd\nTrail",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 59,
              diameter: 27,
            },
          ],
        },
        "5876": {
          init: {
            name: "Randy Carothers",
            clientId: "5876",
            phoneNumber: "541-821-3510",
            address: "1090 Derby Rd\nEagle Point",
            notes: "Gate: 0813",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 61,
              diameter: 45,
            },
          ],
        },
        "5878": {
          init: {
            name: "Essential Underground LLC",
            clientId: "5878",
            phoneNumber: "541-690-0708",
            address: "9514 Butte Falls Hwy",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "5881": {
          init: {
            name: "Jake Gwin",
            clientId: "5881",
            phoneNumber: "541-261-4946",
            address: "4545 Hwy 238\nJacksonville",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "5882": {
          init: {
            name: "ClearMynd",
            clientId: "5882",
            phoneNumber: "541-690-8198",
            address: "1879 Crowfoot Rd\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "rectangle",
              length: 45,
              depth: 23,
              height: 23,
            },
          ],
        },
        "5886": {
          init: {
            name: "William Glock",
            clientId: "5886",
            phoneNumber: "541-261-1463",
            address: "356 Upper Applegate Rd\nJacksonville",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 61,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "5891": {
          init: {
            name: "John Ruckus",
            clientId: "5891",
            phoneNumber: "616-610-1233",
            address: "2500 Upper Applegate Rd\nJacksonville",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 45,
            },
          ],
        },
        "5893": {
          init: {
            name: "Raymond Self",
            clientId: "5893",
            phoneNumber: "541-601-2506",
            address: "537 Thompson Creek Rd #7\nJacksonville",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "5903": {
          init: {
            name: "William Garris",
            clientId: "5903",
            phoneNumber: "541-890-8906",
            address: "1170 Craiglea Drive\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DLS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 61,
              diameter: 38,
            },
          ],
        },
        "5917": {
          init: {
            name: "Northwoods Property Management",
            clientId: "5917",
            phoneNumber: "541-690-1300\n541-772-2053",
            address: "35 Maple St\nShady Cove",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 29,
            },
          ],
        },
        "5926": {
          init: {
            name: "Jesse Marino",
            clientId: "5926",
            phoneNumber: "404-274-9234\n530-350-0664",
            address: "540 West Dutton Rd\nEagle Point",
            notes: "Red Combine out front. 125 gallon tank?",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "oval",
              length: 61,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 42,
            },
          ],
        },
        "5935": {
          init: {
            name: "Cascade Gorge Store",
            clientId: "5935",
            phoneNumber: "541-560-3428",
            address: "2651 Mill Creek Drive\nProspect",
            notes: "C# was 5107, new owners on 6-2-23",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 94,
              diameter: 338,
            },
            {
              fuelTypeName: "DLS",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 76,
              diameter: 104,
            },
          ],
        },
        "5938": {
          init: {
            name: "Gro It",
            clientId: "5938",
            phoneNumber: "706-473-0396",
            address: "12939 Modoc Rd\nWhite City",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 133,
              diameter: 59,
            },
          ],
        },
        "5942": {
          init: {
            name: "Forest Lolandi",
            clientId: "5942",
            phoneNumber: "541-531-6362",
            address: "749 Skookum Lane",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 72,
              diameter: 45,
            },
          ],
        },
        "5976": {
          init: {
            name: "Don Enloe",
            clientId: "5976",
            phoneNumber: "541-821-8700",
            address: "3073 Scenic Ave\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "10102": {
          init: {
            name: "Rick Brink",
            clientId: "10102",
            phoneNumber: "541-951-4771",
            address: "21 Ball Rd\nEagle Point",
            notes: "Gate: 2529",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 80,
              diameter: 45,
            },
          ],
        },
        "10210": {
          init: {
            name: "Mary Pehl",
            clientId: "10210",
            phoneNumber: "503-347-2737",
            address: "5701 Andrews Rd\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 61,
              diameter: 45,
            },
          ],
        },
        "10241": {
          init: {
            name: "Jack Bacon",
            clientId: "10241",
            phoneNumber: "541-621-4737",
            address: "723 Elder Mill Rd\nTrail",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 61,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "10557": {
          init: {
            name: "George Holberton Construction",
            clientId: "10557",
            phoneNumber: "541-826-5389",
            address: "15391 Jones Rd\nWhite City",
            notes: "LS on left",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DLS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 144,
              diameter: 45,
            },
          ],
        },
        "10625": {
          init: {
            name: "Don Hamann Inc",
            clientId: "10625",
            phoneNumber: "541-865-3310",
            address: "8631, 6568, 6200 N Obenchain\nButte Falls",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 48,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
            {
              fuelTypeName: "HO1",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
          ],
        },
        "10771": {
          init: {
            name: "Brian Boothby",
            clientId: "10771",
            phoneNumber: "541-560-3743",
            address: "759 Mather Rd\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 61,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "10774": {
          init: {
            name: "Sara Beck",
            clientId: "10774",
            phoneNumber: "541-865-3684",
            address: "",
            notes: "Can’t stick tank, low overhead.",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 60,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "10779": {
          init: {
            name: "Rogue Valley Sewer Services",
            clientId: "10779",
            phoneNumber: "541-779-4144",
            address: "2177 2nd Ave\nGold Hill",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DLS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 80,
              diameter: 45,
            },
          ],
        },
        "10876": {
          init: {
            name: "Kennedy Fuel Co",
            clientId: "10876",
            phoneNumber: "541-779-1515",
            address: "6868 Crater Lake Hwy\nWhite City",
            notes: "2 Square tanks\nUL: 48,48,48\nLS: 96,48,48",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "rectangle",
              length: 48,
              depth: 48,
              height: 48,
            },
            {
              fuelTypeName: "DLS",
              creationTimePosix: 1,
              shape: "rectangle",
              length: 96,
              depth: 48,
              height: 48,
            },
          ],
        },
        "11790": {
          init: {
            name: "Dicks Towing",
            clientId: "11790",
            phoneNumber: "541-772-4040",
            address: "4048 Crater Lake Hwy\nMedford",
            notes: "2 Drums and Oval tank",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "oval",
              length: 59,
              depth: 26,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "11877": {
          init: {
            name: "City of Eagle Point",
            clientId: "11877",
            phoneNumber: "541-826-4212",
            address: "207 S Shasta Ave",
            notes: "Gate: 1123",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "rectangle",
              length: 116,
              depth: 40,
              height: 37,
            },
            {
              fuelTypeName: "DLS",
              creationTimePosix: 1,
              shape: "rectangle",
              length: 116,
              depth: 13,
              height: 37,
            },
          ],
        },
        "11900": {
          init: {
            name: "Eagle Pt School District",
            clientId: "11900",
            phoneNumber: "541-830-6384",
            address: "",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 81,
              diameter: 45,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 120,
              diameter: 73,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 2,
              shape: "oval",
              length: 60,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "11910": {
          init: {
            name: "Ed’s Point S",
            clientId: "11910",
            phoneNumber: "541-779-3421",
            address: "2390 N Pacific Hwy",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "20005": {
          init: {
            name: "F V Martin Trucking Co",
            clientId: "20005",
            phoneNumber: "541-826-6014",
            address: "2325 Merry Lane\nWhite City",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "Mix",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 122,
              diameter: 45,
            },
          ],
        },
        "20012": {
          init: {
            name: "McFall Enterprises",
            clientId: "20012",
            phoneNumber: "541-826-4679",
            address: "51 Barton Rd\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 73,
              diameter: 45,
            },
            {
              fuelTypeName: "DLS",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 144,
              diameter: 45,
            },
          ],
        },
        "20352": {
          init: {
            name: "Western Emulsions",
            clientId: "20352",
            phoneNumber: "541-227-9787",
            address: "7701 11th St\nWhite City",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "20454": {
          init: {
            name: "Mansfield Oil",
            clientId: "20454",
            phoneNumber: "541-826-5758",
            address: "2625 Ave G\nWhite City",
            notes: "Schnitzer requires Hardhat, vest",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 80,
              diameter: 45,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 36,
              diameter: 64,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 2,
              shape: "horizontalCylinder",
              length: 54,
              diameter: 64,
            },
            {
              fuelTypeName: "HO1",
              creationTimePosix: 3,
              shape: "horizontalCylinder",
              length: 73,
              diameter: 45,
            },
          ],
        },
        "20569": {
          init: {
            name: "Lyle Pope",
            clientId: "20569",
            phoneNumber: "541-890-6331",
            address: "40871 Hwy 62\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 37,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 60,
              diameter: 34,
            },
            {
              fuelTypeName: "DLS",
              creationTimePosix: 2,
              shape: "horizontalCylinder",
              length: 95,
              diameter: 41,
            },
          ],
        },
        "20627": {
          init: {
            name: "Purdy Construction",
            clientId: "20627",
            phoneNumber: "541-664-4124",
            address: "2885 Randall Ave\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 95,
              diameter: 42,
            },
          ],
        },
        "20647": {
          init: {
            name: "Rogue Credit Union",
            clientId: "20647",
            phoneNumber: "541-690-7145",
            address: "",
            notes: "Combo: 7328",
          },
          deliveries: [],
          tanks: [],
        },
        "20785": {
          init: {
            name: "Lila O’Brien",
            clientId: "20785",
            phoneNumber: "541-878-2757",
            address: "15 Taylor Rd\nTrail",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 30,
            },
          ],
        },
        "20875": {
          init: {
            name: "Mt Ashland Association",
            clientId: "20875",
            phoneNumber: "541-494-4531, 541-482-2897",
            address: "",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "PRM",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 26,
              diameter: 75,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 130,
              diameter: 75,
            },
          ],
        },
        "21175": {
          init: {
            name: "Timberland Logging",
            clientId: "21175",
            phoneNumber: "541-772-2053",
            address: "",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "rectangle",
              length: 83,
              depth: 54,
              height: 48,
            },
          ],
        },
        "21300": {
          init: {
            name: "A&P Logging",
            clientId: "21300",
            phoneNumber: "541-826-9577",
            address: "6840 Crater Lake Hwy\nWhite City",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DLS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 338,
              diameter: 94,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 156,
              diameter: 73,
            },
          ],
        },
        "21375": {
          init: {
            name: "Boise Cascade Corp",
            clientId: "21375",
            phoneNumber: "541-831-2615",
            address: "1155 Antelope Rd\nWhite City",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 145,
              diameter: 45,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 104,
              diameter: 65,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 2,
              shape: "horizontalCylinder",
              length: 35,
              diameter: 65,
            },
          ],
        },
        "21850": {
          init: {
            name: "Flying R Ranch",
            clientId: "21850",
            phoneNumber: "541-826-7608",
            address: "204 Brownsboro Meridian Rd\nEagle Point",
            notes: "Don’t use driveway to house. Tank is in shed next to shop.",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 144,
              diameter: 46,
            },
          ],
        },
        "21862": {
          init: {
            name: "Folin Vineyards",
            clientId: "21862",
            phoneNumber: "541-944-1701\n541-855-1838",
            address: "9468 Ramsey Rd\nGold Hill",
            notes:
              "Go through both gates. No code, pushbutton. Small blue shed in between shop and barn.",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 81,
              diameter: 44,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 80,
              diameter: 45,
            },
          ],
        },
        "21905": {
          init: {
            name: "Steve Glass",
            clientId: "21905",
            phoneNumber: "541-538-9125",
            address: "10389 Table Rock Rd\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 38,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 50,
              diameter: 38,
            },
          ],
        },
        "22005": {
          init: {
            name: "Robert Fisher Trucking Inc",
            clientId: "22005",
            phoneNumber: "541-826-4580\n541-413-1854",
            address: "13555 Agate Rd\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 120,
              diameter: 61,
            },
          ],
        },
        "22012": {
          init: {
            name: "Troy Charley Trucking",
            clientId: "22012",
            phoneNumber: "541-890-3776",
            address: "322 Nick Young Rd\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
          ],
        },
        "22171": {
          init: {
            name: "Southern Oregon Builders",
            clientId: "22171",
            phoneNumber: "541-944-4197",
            address: "670 Mason Way",
            notes:
              "Deliver to the end of Ehrman Way. Second to last gate on the left. Green Army Tank",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "rectangle",
              length: 80,
              depth: 70,
              height: 37,
            },
          ],
        },
        "22177": {
          init: {
            name: "Mitzi Colton",
            clientId: "22177",
            phoneNumber: "541-890-1065",
            address: "1065 McDonough Rd\nGold Hill",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 84,
              diameter: 30,
            },
          ],
        },
        "22230": {
          init: {
            name: "Ron Lallo",
            clientId: "22230",
            phoneNumber: "541-821-5129",
            address: "6750 Coleman Creek Rd\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "22354": {
          init: {
            name: "Katherine Haertle",
            clientId: "22354",
            phoneNumber: "541-646-1998",
            address: "132 Elm St\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 61,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "22576": {
          init: {
            name: "John Mee",
            clientId: "22576",
            phoneNumber: "541-779-8735",
            address: "1610 E Main\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "oval",
              length: 60,
              depth: 27,
              fullHeight: 44,
              squareHeight: 17,
            },
          ],
        },
        "22623": {
          init: {
            name: "Cliff Chapman",
            clientId: "22623",
            phoneNumber: "541-951-2288",
            address: "468 Red Blanket Rd\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 61,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "22627": {
          init: {
            name: "Jackson Co Facility Maint",
            clientId: "22627",
            phoneNumber: "541-774-6971",
            address:
              "Juvenile: 609 W 10 st. Access via Laurell\nComm. Justice: 1101 w Main st.\nECSO: 76” Overfill Alarm",
            notes: "Community Justice Gate: #2580",
          },
          deliveries: [],
          tanks: [],
        },
        "22652": {
          init: {
            name: "Norm Jackson",
            clientId: "22652",
            phoneNumber: "541-899-7750",
            address: "9000 Sterling Creek Rd\nJacksonville",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "22702": {
          init: {
            name: "Airport Fire Station",
            clientId: "22702",
            phoneNumber: "405-605-9972 Main Guy\n541-776-7228",
            address: "3570 Fire Station Spur Rd\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "22930": {
          init: {
            name: "Kendle Trucking",
            clientId: "22930",
            phoneNumber: "541-773-2243\n541-973-5137\n541-773-5097",
            address: "2274 South Stage Rd",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "23403": {
          init: {
            name: "Pressure Point Roofing",
            clientId: "23403",
            phoneNumber: "541-772-1945",
            address: "",
            notes: "Matt’s House Gate: 0307#",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DLS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 73,
              diameter: 45,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 73,
              diameter: 45,
            },
          ],
        },
        "24824": {
          init: {
            name: "Warren Harger",
            clientId: "24824",
            phoneNumber: "541-855-7340",
            address: "455 Robleda Dr\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 81,
              diameter: 45,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 81,
              diameter: 45,
            },
          ],
        },
        "25858": {
          init: {
            name: "Piccollo Concrete Construction",
            clientId: "25858",
            phoneNumber: "541-664-3851",
            address: "628 Beebe Rd\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DLS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 61,
              diameter: 45,
            },
          ],
        },
        "25859": {
          init: {
            name: "Piccolo / Buck Mtn Ranch",
            clientId: "25859",
            phoneNumber: "541-821-3851",
            address: "637 Butte Falls Hwy\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 72,
              diameter: 45,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 144,
              diameter: 45,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 2,
              shape: "horizontalCylinder",
              length: 73,
              diameter: 46,
            },
          ],
        },
        "26000": {
          init: {
            name: "JRW Transport LLC",
            clientId: "26000",
            phoneNumber: "541-821-4395",
            address: "1680 Avenue F",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DLS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 200,
              diameter: 94,
            },
          ],
        },
        "30300": {
          init: {
            name: "Pape Machinery",
            clientId: "30300",
            phoneNumber: "541-772-4706",
            address: "4300 Hadley Rd\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "rectangle",
              length: 116,
              depth: 55,
              height: 36,
            },
          ],
        },
        "30352": {
          init: {
            name: "Western Rock Reduction",
            clientId: "30352",
            phoneNumber: "541-601-0105",
            address: "12643 Hwy 62\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 145,
              diameter: 45,
            },
          ],
        },
        "30404": {
          init: {
            name: "Weathers Crushing Inc",
            clientId: "30404",
            phoneNumber: "541-601-5123",
            address: "3301 Hwy 238\nJacksonville",
            notes: "0515#",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 144,
              diameter: 45,
            },
          ],
        },
        "32494": {
          init: {
            name: "Hillcrest Timber",
            clientId: "32494",
            phoneNumber: "541-821-4856 Steve Rider\n541-779-4855",
            address: "",
            notes: "1200 Gallon Truck\n400,200,200,400",
          },
          deliveries: [],
          tanks: [],
        },
        "32600": {
          init: {
            name: "Plumley Contracting",
            clientId: "32600",
            phoneNumber: "541-772-2053",
            address: "7189 Agate Rd\nWhite City",
            notes: "Ellipse: 195,84,54",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DLS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 72,
              diameter: 45,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 143,
              diameter: 55,
            },
          ],
        },
        "32909": {
          init: {
            name: "Stoneridge Golf Club",
            clientId: "32909",
            phoneNumber: "541-830-4653",
            address: "500 E Antelope Rd\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 144,
              diameter: 64,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 147,
              diameter: 45,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 2,
              shape: "horizontalCylinder",
              length: 81,
              diameter: 45,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 3,
              shape: "horizontalCylinder",
              length: 72,
              diameter: 48,
            },
          ],
        },
        "32925": {
          init: {
            name: "St Laurent Land & Cattle Co",
            clientId: "32925",
            phoneNumber: "360-260-9145",
            address: "3620 Brophy Rd\nEagle Point",
            notes: "LS: Max Fill 7’10”",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 73,
              diameter: 64,
            },
            {
              fuelTypeName: "DLS",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 324,
              diameter: 120,
            },
          ],
        },
        "33075": {
          init: {
            name: "Straus Ranches",
            clientId: "33075",
            phoneNumber: "541-664-1914",
            address: "7133 Ramsey Rd\nGold Hill",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 72,
              diameter: 45,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 1,
              shape: "truckBedTank",
              length: 24,
              fullDepth: 48,
              wideHeight: 16,
              fullHeight: 26,
              topDepth: 17,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 2,
              shape: "horizontalCylinder",
              length: 61,
              diameter: 45,
            },
          ],
        },
        "33151": {
          init: {
            name: "Timber Products",
            clientId: "33151",
            phoneNumber: "541-618-3648",
            address: "25 East McAndrews Rd\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "33226": {
          init: {
            name: "Ralph Vanderstar",
            clientId: "33226",
            phoneNumber: "541-664-3616",
            address: "4595 Old Stage Rd\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 73,
              diameter: 47,
            },
          ],
        },
        "33300": {
          init: {
            name: "Wilson Equipment",
            clientId: "33300",
            phoneNumber: "541-830-3966",
            address: "1185 Meridian\nEagle Point",
            notes:
              "Gate: 2870 didn’t work.\nGo past shop. Turn left at houses. Go down past barn. Green tank on stand.",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "PRM",
              creationTimePosix: 0,
              shape: "oval",
              length: 95,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "33345": {
          init: {
            name: "Medford Oaks RV Park",
            clientId: "33345",
            phoneNumber: "541-826-5103",
            address: "7049 Hwy 140\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "PRM",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 72,
              diameter: 45,
            },
          ],
        },
        "33400": {
          init: {
            name: "Waste Water Treatment Plant",
            clientId: "33400",
            phoneNumber: "541-774-2750",
            address: "1100 Kirkland Rd\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 123,
              diameter: 61,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 228,
              diameter: 103,
            },
          ],
        },
        "33485": {
          init: {
            name: "Medford Moulding",
            clientId: "33485",
            phoneNumber: "541-826-9020",
            address: "637 Oak Wood\nEagle Point",
            notes:
              "Start flow slowly . . . Don’t leave invoice. \nSilver American Lock, Key",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "PRM",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 80,
              diameter: 62,
            },
          ],
        },
        "33525": {
          init: {
            name: "Ruch Elementary",
            clientId: "33525",
            phoneNumber: "541-227-8436",
            address: "156 Upper Applegate Rd\nJacksonville",
            notes: "1067 gallon tank, 3.1” / 100 gallons\nHeight 34”",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "rectangle",
              length: 129,
              depth: 57,
              height: 34,
            },
          ],
        },
        "33631": {
          init: {
            name: "Tom / Judy Smurzinski",
            clientId: "33631",
            phoneNumber: "541-941-6000",
            address: "8200 Blackwell Rd\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 26,
            },
          ],
        },
        "33632": {
          init: {
            name: "John Trum",
            clientId: "33632",
            phoneNumber: "541-899-7004",
            address: "82 Autumn Ln\nJacksonville",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "PRM",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 61,
              diameter: 45,
            },
          ],
        },
        "33679": {
          init: {
            name: "Steve Pankonin, Aircraft",
            clientId: "33679",
            phoneNumber: "541-826-9729",
            address: "15373 Jones Rd\nWhite City",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "PRM",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 74,
              diameter: 47,
            },
          ],
        },
        "33720": {
          init: {
            name: "Naumes Inc",
            clientId: "33720",
            phoneNumber: "541-772-6268\n707-849-2052",
            address: "766 Meridian Rd\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
          ],
        },
        "33910": {
          init: {
            name: "Pacific Electrical Contractors",
            clientId: "33910",
            phoneNumber: "541-773-7751",
            address: "920 S Grape St\nMedford",
            notes: "LS 2’ 7” is Full\nGAUL 2’ 4” is Full",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "rectangle",
              length: 72,
              depth: 87,
              height: 36,
            },
            {
              fuelTypeName: "DLS",
              creationTimePosix: 1,
              shape: "rectangle",
              length: 36,
              depth: 87,
              height: 36,
            },
          ],
        },
        "34339": {
          init: {
            name: "RRMC",
            clientId: "34339",
            phoneNumber: "541-531-5509",
            address: "2825 E Barnett Rd\nMedford",
            notes:
              "2 10,000 gallon, inground tanks. Enter from Barnett. In Parking lot right before ER Ramp.",
          },
          deliveries: [],
          tanks: [],
        },
        "34340": {
          init: {
            name: "Rogue Valley Manor",
            clientId: "34340",
            phoneNumber: "541-857-7672",
            address: "965 Ellendale Dr\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "rectangle",
              length: 122,
              depth: 15,
              height: 33,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 1,
              shape: "rectangle",
              length: 122,
              depth: 42,
              height: 33,
            },
          ],
        },
        "34459": {
          init: {
            name: "Yankee Creek Ranch",
            clientId: "34459",
            phoneNumber: "541-778-4104",
            address: "1260 Yankee Creek Rd\nEagle Point",
            notes: "UL tank closest to road . . . Mobil/Mobilfuel",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 144,
              diameter: 46,
            },
          ],
        },
        "34500": {
          init: {
            name: "All In One Rental",
            clientId: "34500",
            phoneNumber: "541-535-6111",
            address: "1120 S Pacific Hwy\nTalent",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 71,
              diameter: 45,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 143,
              diameter: 45,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 2,
              shape: "horizontalCylinder",
              length: 37,
              diameter: 45,
            },
          ],
        },
        "34501": {
          init: {
            name: "Ashland Parks & Recreation",
            clientId: "34501",
            phoneNumber: "541-552-2487",
            address: "",
            notes: "Oak Knoll Golf Course, a ‘division’ of Ashland Parks . . .",
          },
          deliveries: [],
          tanks: [],
        },
        "34525": {
          init: {
            name: "Ashland Bus Shop",
            clientId: "34525",
            phoneNumber: "541-482-0072",
            address: "135 Mistletoe Rd\nAshland",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DLS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 72,
              diameter: 63,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 72,
              diameter: 63,
            },
          ],
        },
        "34624": {
          init: {
            name: "Bear Creek Orchard",
            clientId: "34624",
            phoneNumber: "541-944-7061",
            address: "3448 Kirtland Rd\nCentral Point",
            notes: "Big Diesel tank: DHS,204,095",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 45,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 80,
              diameter: 45,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 2,
              shape: "rectangle",
              length: 48,
              depth: 36,
              height: 34,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 3,
              shape: "rectangle",
              length: 60,
              depth: 45,
              height: 0,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 4,
              shape: "horizontalCylinder",
              length: 96,
              diameter: 45,
            },
            {
              fuelTypeName: "PRM",
              creationTimePosix: 5,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
          ],
        },
        "34975": {
          init: {
            name: "Crater Sand & Gravel",
            clientId: "34975",
            phoneNumber: "541-664-5148",
            address: "7260 Blackwell Rd\nCentral Point",
            notes: "House Gate: 1960",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 73,
              diameter: 45,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 96,
              diameter: 42,
            },
          ],
        },
        "35052": {
          init: {
            name: "USFS",
            clientId: "35052",
            phoneNumber: "541-301-1505",
            address: "",
            notes: "Key: Aladdin Mk181",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DLS",
              creationTimePosix: 0,
              shape: "oval",
              length: 122,
              depth: 57,
              fullHeight: 33,
              squareHeight: 0,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 76,
              diameter: 48,
            },
          ],
        },
        "35377": {
          init: {
            name: "Jackson County Fire District #3",
            clientId: "35377",
            phoneNumber: "541-826-7100",
            address: "8333 Agate Rd\nWhite City",
            notes: "Gate: Scenic: 5150\nLoto: 531",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DLS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 183,
              diameter: 73,
            },
            {
              fuelTypeName: "DLS",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 72,
              diameter: 46,
            },
            {
              fuelTypeName: "DLS",
              creationTimePosix: 2,
              shape: "horizontalCylinder",
              length: 73,
              diameter: 45,
            },
            {
              fuelTypeName: "DLS",
              creationTimePosix: 3,
              shape: "horizontalCylinder",
              length: 86,
              diameter: 46,
            },
          ],
        },
        "35526": {
          init: {
            name: "Wilburt Lull",
            clientId: "35526",
            phoneNumber: "541-664-1489",
            address: "3497 Old Military Rd\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 60,
              depth: 27,
              fullHeight: 44,
              squareHeight: 17,
            },
            {
              fuelTypeName: "HO1",
              creationTimePosix: 1,
              shape: "oval",
              length: 48,
              depth: 27,
              fullHeight: 44,
              squareHeight: 17,
            },
            {
              fuelTypeName: "HO1",
              creationTimePosix: 2,
              shape: "rectangle",
              length: 0,
              depth: 43,
              height: 47,
            },
            {
              fuelTypeName: "PRM",
              creationTimePosix: 3,
              shape: "oval",
              length: 60,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "38025": {
          init: {
            name: "Rogue Pacific Lumber",
            clientId: "38025",
            phoneNumber: "541-773-3617",
            address: "1187 W McAndrews Rd\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 95,
              diameter: 41,
            },
            {
              fuelTypeName: "DLS",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 142,
              diameter: 45,
            },
          ],
        },
        "38107": {
          init: {
            name: "Seven Oaks Farm",
            clientId: "38107",
            phoneNumber: "541-890-6637",
            address: "5526 Rogue Valley Hwy\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 76,
              diameter: 46,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 41,
              diameter: 46,
            },
          ],
        },
        "40304": {
          init: {
            name: "Rogue Snowmobilers",
            clientId: "40304",
            phoneNumber: "541-621-1842",
            address: "870 N Ross Lane\nMedford",
            notes: "Key: 2179\nDelivery is (42.9127590, -122.3238621)",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "rectangle",
              length: 116,
              depth: 56,
              height: 37,
            },
          ],
        },
        "44906": {
          init: {
            name: "Talent Irrigation District",
            clientId: "44906",
            phoneNumber: "541-601-2890",
            address: "",
            notes:
              "Howard Prairie Dam. Head up Dead Indian. Turn right on Howard/Hyatt Rd. Turn Left to Howard Prairie Dam. When pavement ends Turn right at white gate. Code #1520",
          },
          deliveries: [],
          tanks: [],
        },
        "55459": {
          init: {
            name: "Rick & Linda Anderson",
            clientId: "55459",
            phoneNumber: "541-826-3722",
            address: "374 Hammel Rd\nEagle Point\n13042 Hwy 62\nEagle Point",
            notes: "Gate: 3006#",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 41,
            },
            {
              fuelTypeName: "HO1",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 41,
            },
          ],
        },
        "61411": {
          init: {
            name: "Jim Lowman",
            clientId: "61411",
            phoneNumber: "541-226-7110\nWife: 541-601-2177",
            address: "4462 Coal Mine Rd\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 35,
            },
          ],
        },
        "61846": {
          init: {
            name: "Dave Reed",
            clientId: "61846",
            phoneNumber: "541-821-0630",
            address: "39 Sams Creek Rd\nGold Hill",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
          ],
        },
        "62480": {
          init: {
            name: "Bill Pugh",
            clientId: "62480",
            phoneNumber: "541-535-3806",
            address: "6062 Adams Rd\nTalent",
            notes: "Back up driveway",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DLS",
              creationTimePosix: 0,
              shape: "oval",
              length: 60,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "62709": {
          init: {
            name: "Elizabeth & Geraldine Smith",
            clientId: "62709",
            phoneNumber: "541-826-2397",
            address: "4400 Ave E\nWhite City",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 49,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "62724": {
          init: {
            name: "Dale Chapman",
            clientId: "62724",
            phoneNumber: "541-560-3341",
            address: "412 Weitman Ln\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 60,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "62765": {
          init: {
            name: "Randy Hedgpeth",
            clientId: "62765",
            phoneNumber: "541-621-3073",
            address: "813 & 818 Ulrich Rd\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 61,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
            {
              fuelTypeName: "HO1",
              creationTimePosix: 1,
              shape: "oval",
              length: 48,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "62783": {
          init: {
            name: "John Van Oel",
            clientId: "62783",
            phoneNumber: "541-826-3069",
            address: "4122 Dodge Rd",
            notes: "Call before so dogs can get locked up",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "oval",
              length: 60,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "62786": {
          init: {
            name: "Jantzer Automotive Service",
            clientId: "62786",
            phoneNumber: "541-535-3510",
            address: "4762 Dark Hollow Rd\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "62788": {
          init: {
            name: "Haul All Inc",
            clientId: "62788",
            phoneNumber: "541-944-4557",
            address: "4609 Old Stage Rd\nCentral Point",
            notes: "Gate: 1234",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 72,
              diameter: 64,
            },
            {
              fuelTypeName: "PRM",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 72,
              diameter: 64,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 2,
              shape: "rectangle",
              length: 52,
              depth: 60,
              height: 28,
            },
          ],
        },
        "63065": {
          init: {
            name: "Peterson Machinery Co",
            clientId: "63065",
            phoneNumber: "510-618-22004???",
            address: "2600 Biddle Rd\nMedford",
            notes: "Square tank out back",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "rectangle",
              length: 120,
              depth: 55,
              height: 36,
            },
          ],
        },
        "63139": {
          init: {
            name: "Pilot Rock Excavation",
            clientId: "63139",
            phoneNumber: "541-779-4916",
            address: "357 Federal Way\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "63213": {
          init: {
            name: "Lou Jean Booker",
            clientId: "63213",
            phoneNumber: "541-890-7942",
            address: "769 Mather Rd\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 61,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "63266": {
          init: {
            name: "Paul Fox / Fox Farms",
            clientId: "63266",
            phoneNumber: "541-601-9416",
            address: "3351 W Griffin Creek Rd\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "PRM",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 61,
              diameter: 45,
            },
          ],
        },
        "63269": {
          init: {
            name: "Dennis Brierly",
            clientId: "63269",
            phoneNumber: "541-560-3361",
            address: "434 Red Blanket Rd\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 60,
              diameter: 45,
            },
            {
              fuelTypeName: "PRM",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 61,
              diameter: 37,
            },
            {
              fuelTypeName: "HO1",
              creationTimePosix: 2,
              shape: "horizontalCylinder",
              length: 81,
              diameter: 45,
            },
          ],
        },
        "63437": {
          init: {
            name: "Prospect Community Club",
            clientId: "63437",
            phoneNumber: "541-690-9033",
            address: "305 Red Blanket\nProspect",
            notes: "Not sure on dimensions!!!\n66”Long",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 61,
              diameter: 38,
            },
          ],
        },
        "63515": {
          init: {
            name: "Peter Scaglione",
            clientId: "63515",
            phoneNumber: "541-291-1492",
            address: "11110 Hwy 140",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "80233": {
          init: {
            name: "Whipple Transport",
            clientId: "80233",
            phoneNumber: "541-210-6206",
            address: "15166 Hwy 62\nEagle Point",
            notes:
              "Tank is on uphill side of house. Under coffee can. Vent is under tire.",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 60,
              diameter: 45,
            },
          ],
        },
        "80423": {
          init: {
            name: "Ed Staub & Sons",
            clientId: "80423",
            phoneNumber: "541-884-5167",
            address: "3602 N Pacific Hwy",
            notes: "C&J, Gold Hill Station",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "PRM",
              creationTimePosix: 0,
              shape: "rectangle",
              length: 122,
              depth: 82,
              height: 46,
            },
            {
              fuelTypeName: "PRM",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 104,
              diameter: 76,
            },
          ],
        },
        "80459": {
          init: {
            name: "Bullet Rental & Sales",
            clientId: "80459",
            phoneNumber: "541-779-2855",
            address: "3366 Crater Lake Ave\nMedford",
            notes: "UL Key: X2428",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "oval",
              length: 60,
              depth: 27,
              fullHeight: 43,
              squareHeight: 17,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 1,
              shape: "oval",
              length: 60,
              depth: 27,
              fullHeight: 44,
              squareHeight: 17,
            },
          ],
        },
        "91600": {
          init: {
            name: "Tom Coble / Taz Fabrication",
            clientId: "91600",
            phoneNumber: "541-821-6890",
            address: "824 Ulrich Rd\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 62,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
            {
              fuelTypeName: "HO1",
              creationTimePosix: 1,
              shape: "oval",
              length: 48,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "93200": {
          init: {
            name: "Rich & Sue Heidt",
            clientId: "93200",
            phoneNumber: "541-560-3352",
            address: "620 Butte Falls Rd\nProspect",
            notes: "Park in 624 Butte Falls Hwy, run hose through gate.",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 72,
              depth: 25,
              fullHeight: 30,
              squareHeight: 5,
            },
            {
              fuelTypeName: "HO1",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 36,
              diameter: 36,
            },
          ],
        },
        "93800": {
          init: {
            name: "Leathers Oil",
            clientId: "93800",
            phoneNumber: "541-664-4842",
            address: "5020 Table Rock Rd\nCentral Point",
            notes: "Ask attendant for key",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "oval",
              length: 61,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "95850": {
          init: {
            name: "ODOT Lake of the Woods",
            clientId: "95850",
            phoneNumber: "541-851-8580",
            address: "37851 Hwy 140\nKlamath Falls",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "95900": {
          init: {
            name: "ODOT Lincoln Shed",
            clientId: "95900",
            phoneNumber: "541-621-4244",
            address: "14800 Hwy 66",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DLS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 46,
            },
          ],
        },
        "95950": {
          init: {
            name: "Souther Oregon University",
            clientId: "95950",
            phoneNumber: "541-552-6231",
            address: "382 Wightman St\nAshland",
            notes: "Inground tank, 2500 gallons?, 144x72?",
          },
          deliveries: [],
          tanks: [],
        },
        "97651": {
          init: {
            name: "Steve Millard",
            clientId: "97651",
            phoneNumber: "541-944-2822",
            address: "3975 Dodge Rd",
            notes: "Gate: 1723",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 61,
              diameter: 46,
            },
            {
              fuelTypeName: "HO1",
              creationTimePosix: 1,
              shape: "oval",
              length: 61,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "97664": {
          init: {
            name: "Bishop Construction",
            clientId: "97664",
            phoneNumber: "541-773-4490\n541-944-2401",
            address: "2080 Knowles Rd\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "oval",
              length: 47,
              depth: 27,
              fullHeight: 44,
              squareHeight: 17,
            },
          ],
        },
        "97709": {
          init: {
            name: "On Site Screeners, Ranch",
            clientId: "97709",
            phoneNumber: "541-423-5075",
            address: "6430 Fish Lake Rd\nButte Falls",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "97714": {
          init: {
            name: "Sandy Saltonstall",
            clientId: "97714",
            phoneNumber: "541-855-7056",
            address: "372 McDonough Rd\nGold Hill",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "oval",
              length: 47,
              depth: 27,
              fullHeight: 44,
              squareHeight: 17,
            },
            {
              fuelTypeName: "HO1",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 37,
            },
          ],
        },
        "97805": {
          init: {
            name: "Janet Stockebrand",
            clientId: "97805",
            phoneNumber: "541-560-3265",
            address: "406 Shady Lane\nProspect",
            notes: "Key on nearby 4x4 post",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO2",
              creationTimePosix: 0,
              shape: "oval",
              length: 48,
              depth: 27,
              fullHeight: 44,
              squareHeight: 17,
            },
          ],
        },
        "97828": {
          init: {
            name: "Dwain Pope",
            clientId: "97828",
            phoneNumber: "541-855-8726\n801-971-9476",
            address: "10513 Hwy 234\nGold Hill",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DLS",
              creationTimePosix: 0,
              shape: "oval",
              length: 48,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
          ],
        },
        "97835": {
          init: {
            name: "Richard Holland",
            clientId: "97835",
            phoneNumber: "541-878-4280",
            address: "21401 Hwy 62\nTrail",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 38,
            },
          ],
        },
        "97854": {
          init: {
            name: "Million Aire",
            clientId: "97854",
            phoneNumber: "541-772-5660",
            address: "2070 Milligan Way\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "98383": {
          init: {
            name: "Century Link",
            clientId: "98383",
            phoneNumber: "541-324-8698",
            address: "502 N Central",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "98415": {
          init: {
            name: "Amy’s Kitchen",
            clientId: "98415",
            phoneNumber: "541-727-1343",
            address: "441 W Antelope Rd\nWhite City",
            notes: "2 Generators",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "rectangle",
              length: 87,
              depth: 35,
              height: 29,
            },
          ],
        },
        "98845": {
          init: {
            name: "Lynette & Mike Sinclair",
            clientId: "98845",
            phoneNumber: "541-831-1059",
            address: "2172 Crowfoot Rd\n Eagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 38,
            },
          ],
        },
        "98888": {
          init: {
            name: "LA Farms LLC",
            clientId: "98888",
            phoneNumber: "541-944-0865",
            address: "5489 Seven Oaks Rd\nCentral Point",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "GUL",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 25,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 96,
              diameter: 41,
            },
          ],
        },
        "98934": {
          init: {
            name: "Charlie Coghill",
            clientId: "98934",
            phoneNumber: "541-560-3598",
            address: "32041 Red Blanket Rd\nProspect",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "HO1",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 50,
              diameter: 45,
            },
          ],
        },
        "99155": {
          init: {
            name: "Lewis Keller",
            clientId: "99155",
            phoneNumber: "541-899-1542",
            address: "6559 Whispering Pines Ln\nJacksonville",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "oval",
              length: 61,
              depth: 27,
              fullHeight: 44,
              squareHeight: 18,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 61,
              diameter: 45,
            },
          ],
        },
        "99216": {
          init: {
            name: "Nic Industries",
            clientId: "99216",
            phoneNumber: "541-826-1922, 541-745-9715",
            address: "7050 6th St\nWhite City",
            notes: "Lock: 1922",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 73,
              diameter: 45,
            },
          ],
        },
        "123456": {
          init: {
            name: "Ralph Vanderstar",
            clientId: "123456",
            phoneNumber: "541-990-5237",
            address: "4595 Old Stage",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 73,
              diameter: 47,
            },
          ],
        },
        "350377": {
          init: {
            name: "Cole Rivers Fish Hatchery",
            clientId: "350377",
            phoneNumber: "541-826-8776",
            address: "200 Cole M Rivers Rd\nTrail",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 73,
              diameter: 64,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 81,
              diameter: 60,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 2,
              shape: "horizontalCylinder",
              length: 35,
              diameter: 60,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 3,
              shape: "horizontalCylinder",
              length: 72,
              diameter: 46,
            },
            {
              fuelTypeName: "DHS",
              creationTimePosix: 4,
              shape: "horizontalCylinder",
              length: 96,
              diameter: 41,
            },
          ],
        },
        "9999001": {
          init: {
            name: "Talent Truck Stop-Fuel Drop",
            clientId: "9999001",
            phoneNumber: "",
            address: "251  W Valley View Rd\nTalent",
            notes:
              "Hook up to pot, open ball valve, open gate valve, turn on pump. Turn on truck pump.",
          },
          deliveries: [],
          tanks: [],
        },
        "9999002": {
          init: {
            name: "C & J Gas Station",
            clientId: "9999002",
            phoneNumber: "",
            address: "3602 Hwy 99",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "PRM",
              creationTimePosix: 0,
              shape: "rectangle",
              length: 120,
              depth: 86,
              height: 43,
            },
          ],
        },
        "9999003": {
          init: {
            name: "Ed Staub, Ashland 76",
            clientId: "9999003",
            phoneNumber: "541-944-2757",
            address: "",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "569-0002": {
          init: {
            name: "Plant Oregon - Fern Valley",
            clientId: "569-0002",
            phoneNumber: "541-944-2882",
            address: "4727 Fern Valley Rd\nPhoenix",
            notes: "Gate 0922\nCould fill compost turner",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 49,
              diameter: 41,
            },
          ],
        },
        "569-0001": {
          init: {
            name: "Plant Oregon - Wagner Creek",
            clientId: "569-0001",
            phoneNumber: "541-944-2882",
            address: "8677 Wagner Creek Rd\nTalent",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 41,
            },
            {
              fuelTypeName: "GUL",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 48,
              diameter: 25,
            },
          ],
        },
        "55459-0001": {
          init: {
            name: "Rick & Linda Anderson",
            clientId: "55459-0001",
            phoneNumber: "541-772-2053",
            address: "13042 Hwy 62\nEagle Point",
            notes: "",
          },
          deliveries: [],
          tanks: [],
        },
        "20454-2": {
          init: {
            name: "United Rentals",
            clientId: "20454-2",
            phoneNumber: "541-773-7323",
            address: "2216 West Main St\nMedford",
            notes: "",
          },
          deliveries: [],
          tanks: [
            {
              fuelTypeName: "DHS",
              creationTimePosix: 0,
              shape: "horizontalCylinder",
              length: 54,
              diameter: 64,
            },
            {
              fuelTypeName: "HO1",
              creationTimePosix: 1,
              shape: "horizontalCylinder",
              length: 73,
              diameter: 45,
            },
          ],
        },
      },
    };
  }
}
</script>
