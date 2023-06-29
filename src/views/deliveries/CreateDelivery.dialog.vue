<script setup lang="ts">
// import { PropType } from "vue";
import { pageTransitions, popPage, pushPage } from "@/Nav";
import { Client, Tank, FuelType, getAppData, TankShape } from "@/AppData";
import { PropType, VNodeRef, computed, ref, watchEffect } from "vue";
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
const manualClientName = ref(``);
const manualClientId = ref(``);
const manualClientPhone = ref(``);
const manualClientAddress = ref(``);
const manualClientNotes = ref(``);

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
const manualTankShape = ref<TankShape | undefined>(undefined);
const manualTankLength = ref(0);
const manualTankDepth = ref(0);
const manualTankHeight = ref(0);
const manualTankShortHeight = ref(0);

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
const manualFuelTypeName = ref(``);
const manualFuelTypeRate = ref(0);

// Manual
const clientName = ref(``);

// Automation
watchEffect(() => {
  if (clientState.value !== clientStates.existing) {
    if (tank.value === tankStates.existing) {
      tank.value = undefined;
    }
  }
});
watchEffect(() => {
  if (
    tankState.value !== tankStates.justFuel &&
    clientState.value !== clientStates.oneTime
  ) {
    if (fuelType.value === fuelTypeStates.oneTime) {
      fuelType.value = undefined;
    }
  }
});

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
      background: `#f9fafdce`,
      align: $Align.topCenter,
    }"
  >
    <Body
      :sty="{
        width: `1f`,
        height: `1f`,
        spacing: 1,
        align: $Align.topCenter,
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
        <ClientFields
          v-if="
            clientState === clientStates.new ||
            clientState === clientStates.oneTime
          "
          v-model:name="manualClientName"
          v-model:clientId="manualClientId"
          v-model:phoneNumber="manualClientPhone"
          v-model:address="manualClientAddress"
          v-model:notes="manualClientNotes"
        />

        <!-- Tank -->
        <Label
          label="Tank"
          v-if="
            clientState !== clientStates.oneTime &&
            clientState !== clientStates.none
          "
        >
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
            :options="clientState === clientStates.existing ? [
              ...orderDocs((client as Client | undefined)?.tanks ?? [], (x) => x.creationTimePosix).map(
                (x, index) => ({ label: `#${index}`, data: x }),
              ),
            ] : []"
          />
        </Label>

        <!-- Fuel -->
        <Label
          label="Fuel"
          v-if="
            clientState === clientStates.oneTime ||
            (clientState === clientStates.new &&
              tankState !== tankStates.none) ||
            (clientState === clientStates.existing &&
              tankState !== tankStates.existing &&
              tankState !== tankStates.none)
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
              ...(tankState === tankStates.justFuel ||
              clientState === clientStates.oneTime
                ? [
                    {
                      label: fuelTypeStates.oneTime,
                      data: fuelTypeStates.oneTime,
                    },
                  ]
                : []),
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
            (clientState === clientStates.oneTime ||
              tankState === tankStates.justFuel ||
              tankState === tankStates.new) &&
            (fuelTypeState === fuelTypeStates.oneTime ||
              fuelTypeState === fuelTypeStates.new)
          "
          :sty="{ width: `1f`, spacing: 0.25 }"
        >
          <Label label="Fuel"
            ><Field v-model:value="manualFuelTypeName" hint="Name"
          /></Label>
          <Label label="Rate"
            ><Field v-model:value="manualFuelTypeRate" hint="Rate"
          /></Label>
        </Row>

        <!-- Tank Fields -->
        <TankFields
          v-if="
            clientState !== clientStates.none &&
            (tankState === tankStates.new || tankState === tankStates.existing)
          "
          v-model:shape="manualTankShape"
          v-model:length="manualTankLength"
          v-model:depth="manualTankDepth"
          v-model:height="manualTankHeight"
          v-model:shortHeight="manualTankShortHeight"
        />

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
      <Box />
      <Text title>Related Deliveries</Text>
      <CompletedDeliveryEntry :sty="{ width: `75%` }" />
      <CompletedDeliveryEntry :sty="{ width: `75%` }" />
    </Body>
  </Box>
</template>
