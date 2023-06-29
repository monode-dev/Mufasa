<script setup lang="ts">
// import { PropType } from "vue";
import { pageTransitions, popPage, pushPage } from "@/Nav";
import { Client, Tank, FuelType, getAppData } from "@/AppData";
import { PropType, VNodeRef, computed, ref } from "vue";
import { exists, orderDocs } from "@/utils";
import { mdColors } from "@/miwi-md/Box/BoxDecoration";

const appData = getAppData();

const cardRef = ref<VNodeRef | null>(null);
const amount = ref(0);

// Client
const client = ref<Client | ClientState | undefined>(undefined);
type ClientState = (typeof clientStates)[keyof typeof clientStates];
const clientStates = {
  none: `None`,
  oneTime: `One Time Client`,
  new: `New Client`,
  existing: `Existing`,
} as const;
const clientState = computed((): ClientState => {
  if (client.value === undefined) {
    return clientStates.none;
  } else if (typeof client.value === `string`) {
    return client.value;
  } else {
    return clientStates.existing;
  }
});

// Fuel Type
const tank = ref<Tank | TankState | undefined>(undefined);
type TankState = (typeof tankStates)[keyof typeof tankStates];
const tankStates = {
  none: `None`,
  justFuel: `Just Fuel`,
  new: `New Tank`,
  existing: `Existing`,
} as const;
const tankState = computed((): TankState => {
  if (tank.value === undefined) {
    return tankStates.none;
  } else if (typeof tank.value === `string`) {
    return tank.value;
  } else {
    return tankStates.existing;
  }
});

// Tank
const fuelType = ref(undefined as FuelType | FuelTypeState | undefined);
type FuelTypeState = (typeof fuelTypeStates)[keyof typeof fuelTypeStates];
const fuelTypeStates = {
  none: `None`,
  oneTime: `One Time Fuel`,
  new: `New Fuel Type`,
  existing: `Existing`,
} as const;
const fuelTypeState = computed(() => {
  if (fuelType.value === undefined) {
    return fuelTypeStates.none;
  } else if (typeof fuelType.value === `string`) {
    return fuelType.value;
  } else {
    return fuelTypeStates.existing;
  }
});
const fuelTypeName = ref(``);
const fuelTypeRate = ref(0);

// Manual
const clientName = ref(``);

const deliveryIsValid = computed(() => {
  if (clientState.value === `One Time Client`) {
    return false;
  } else if (clientState.value === `New Client`) {
    return clientName.value !== `` && fuelType.value !== `None`;
  } else if (clientState.value === `Existing`) {
    return exists(client.value) && exists(tank.value);
  } else {
    return false;
  }
});
function closePopUp() {
  popPage();
}
function handleYes() {
  if (!deliveryIsValid.value) return;
  closePopUp();
  // TODO: Create Delivery
}

// Close the pop up when the user clicks outside of it
function popOnClickOutside(e: MouseEvent) {
  if (!cardRef.value?.$el.contains(e.target)) {
    closePopUp();
    e.stopPropagation();
  }
}
</script>

<script lang="ts">
export default {
  transitions: pageTransitions.fadeIn(),
};
</script>

<template>
  <Box
    @click="popOnClickOutside"
    :sty="{
      width: `1f`,
      height: `1f`,
      background: `#f9fafdaa`,
    }"
  >
    <Card
      ref="cardRef"
      :sty="{
        width: `75%`,
      }"
    >
      <Text title>Create Delivery</Text>

      <!-- Client -->
      <Label label="Client">
        <DropDown
          v-model:selected="client"
          :getKeyFromData="(data: Client | ClientState | undefined) => {
            if (typeof data === `string`) {
              return data;
            } else {
              return data?._firestoreRef?.path;
            }
          }"
          :speciaolOptions="[
            {
              label: `None`,
              data: undefined,
            },
            {
              label: clientStates.oneTime,
              data: clientStates.oneTime,
            },
            {
              label: clientStates.new,
              data: clientStates.new,
            },
          ]"
          :options="[
            ...orderDocs(appData.clients, (x) => x.name)
              .filter((x) => x.name !== `` && x.name !== null && x.name !== undefined)
              .map((x) => ({ label: x.name!, data: x })),
          ]"
        />
      </Label>

      <!-- Tank -->
      <Label label="Tank" v-if="clientState === clientStates.existing">
        <DropDown
          v-model:selected="tank"
          :getKeyFromData="(data: Tank | TankState | undefined) => {
            if (typeof data === `string`) {
              return data;
            } else {
              return data?._firestoreRef?.path;
            }
          }"
          :speciaolOptions="[
            {
              label: `None`,
              data: undefined,
            },
            {
              label: tankStates.justFuel,
              data: tankStates.justFuel,
            },
            {
              label: tankStates.new,
              data: tankStates.new,
            },
          ]"
          :options="[
            ...orderDocs((client as Client | undefined)?.tanks ?? [], (x) => x.creationTimePosix).map(
              (x, index) => ({ label: `#${index}`, data: x }),
            ),
          ]"
        />
      </Label>

      <!-- Fuel -->
      <Label
        label="Fuel"
        v-if="
          clientState === clientStates.existing &&
          tankState === tankStates.justFuel
        "
      >
        <DropDown
          v-model:selected="fuelType"
          :getKeyFromData="(data: FuelType | FuelTypeState | undefined) => {
            if (typeof data === `string`) {
              return data;
            } else {
              return data?._firestoreRef?.path;
            }
          }"
          :speciaolOptions="[
            {
              label: `None`,
              data: undefined,
            },
            {
              label: fuelTypeStates.oneTime,
              data: fuelTypeStates.oneTime,
            },
            {
              label: fuelTypeStates.new,
              data: fuelTypeStates.new,
            },
          ]"
          :options="[
          ...orderDocs(appData.fuelTypes ?? [], (x) => x.createdPosix).filter((x) => exists(x.name) && x.name !== ``).map(
            (x, index) => ({ label: x.name!, data: x }),
          ),
        ]"
        />
      </Label>
      <Row
        v-if="
          clientState === `Existing` &&
          tankState === `Just Fuel` &&
          [`One Time Fuel`, `New Fuel Type`].includes(fuelTypeState)
        "
        :sty="{ width: `1f`, spacing: 0.25 }"
      >
        <Label label="Name"
          ><Field v-model:value="fuelTypeName" hint="Name"
        /></Label>
        <Label label="Rate"
          ><Field v-model:value="fuelTypeRate" hint="Rate"
        /></Label>
      </Row>

      <!-- Amount -->
      <Label label="Amount"><Field v-model:value="amount" /></Label>

      <!-- Buttons -->
      <Row :sty="{ width: `1f`, spacing: $Spacing.spaceEvenly }">
        <Button outlined @click.stop="closePopUp">Cancel</Button>
        <Button
          @click.stop="handleYes"
          :sty="{
            background: deliveryIsValid ? mdColors.green : mdColors.grey,
          }"
          >Create</Button
        >
      </Row>
    </Card>
  </Box>
</template>
