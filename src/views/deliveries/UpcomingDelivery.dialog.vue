<script setup lang="ts">
// import { PropType } from "vue";
import { pageTransitions, popPage } from "@/Nav";
import {
  Client,
  Tank,
  getAppData,
  getTankLabel,
  getClientLabel,
  Delivery,
  isUpcomingDeliveryValid,
  listUpcomingDeliveries,
  listCompletedDeliveries,
} from "@/AppData";
import { PropType, VNodeRef, computed, ref, watchEffect } from "vue";
import { exists, orderDocs } from "@/utils";

const props = defineProps({
  dialogType: {
    type: String as PropType<`create` | `edit`>,
    default: `create`,
  },
  delivery: {
    type: Object as PropType<Delivery | undefined>,
    default: undefined,
    required: false,
  },
});
const deliveryToEdit = computed(() =>
  props.dialogType === `edit` && exists(props.delivery)
    ? props.delivery
    : undefined,
);

const appData = getAppData();

const cardRef = ref<VNodeRef | null>(null);

const isExistingDelivery = ref(
  (deliveryToEdit.value?.deliveryFormat ?? `upcomingFromExisting`) ===
    `upcomingFromExisting`,
);
const client = ref<Client | null>(
  deliveryToEdit.value?.upcomingExistingClient ?? null,
);
const tank = ref<Tank | null>(
  deliveryToEdit.value?.upcomingExistingTank ?? null,
);
const deliveryLabel = ref(deliveryToEdit.value?.deliveryLabel ?? ``);
const fuelType = ref(tank.value?.fuelType ?? null);
const amount = ref<number | null>(deliveryToEdit.value?.quantity ?? null);

const deliveryIsValid = computed(() =>
  isUpcomingDeliveryValid({
    deliveryFormat: isExistingDelivery.value
      ? `upcomingFromExisting`
      : `upcomingFromOneTime`,
    upcomingExistingClient: client.value,
    upcomingExistingTank: tank.value,
    deliveryLabel: deliveryLabel.value,
    fuelType: fuelType.value,
    quantity: amount.value ?? undefined,
  }),
);

// Related Deliveries
const relatedDeliveries = computed(() => {
  const result = listCompletedDeliveries(appData.deliveries).filter((d) => {
    const deliveryClientPath = d.upcomingExistingClient?._firestoreRef?.path;
    const selectedClientPath = client.value?._firestoreRef?.path;
    // const deliveryTankPath = d.upcomingExistingTank?._firestoreRef?.path;
    // const selectedTankPath = tank.value?._firestoreRef?.path;
    const deliveryFuelTypePath = d.fuelType?._firestoreRef?.path;
    const selectedFuelTypePath = fuelType.value?._firestoreRef?.path;
    return (
      exists(deliveryClientPath) &&
      exists(selectedClientPath) &&
      deliveryClientPath === selectedClientPath &&
      // exists(deliveryTankPath) &&
      // exists(selectedTankPath) &&
      // deliveryTankPath === selectedTankPath &&
      exists(deliveryFuelTypePath) &&
      exists(selectedFuelTypePath) &&
      deliveryFuelTypePath === selectedFuelTypePath
    );
  });
  return result.slice(0, 10);
});
const relatedDeliveriesCount = computed(() => relatedDeliveries.value.length);

function closePopUp() {
  popPage();
}
function handleYes() {
  if (!deliveryIsValid.value) return;
  closePopUp();
  if (props.dialogType === `create`) {
    appData.deliveries.add({
      deliveryFormat: isExistingDelivery.value
        ? `upcomingFromExisting`
        : `upcomingFromOneTime`,
      upcomingExistingClient: client.value,
      upcomingExistingTank: tank.value,
      deliveryLabel: deliveryLabel.value,
      fuelType: fuelType.value,
      quantity: amount.value!,
    });
  } else if (props.dialogType === `edit`) {
    deliveryToEdit.value!.upcomingExistingClient = client.value;
    deliveryToEdit.value!.upcomingExistingTank = tank.value;
    deliveryToEdit.value!.deliveryLabel = deliveryLabel.value;
    deliveryToEdit.value!.fuelType = fuelType.value;
    deliveryToEdit.value!.quantity = amount.value!;
  }
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
  <Body
    :onClick="popOnClickOutside"
    :sty="{
      width: `1f`,
      height: `1f`,
      padBetween: 1,
      background: `#f9fafde8`,
      align: $Align.topCenter,
      padTop: 12,
      overflowY: $Overflow.scroll,
      bonusTouch: false,
    }"
  >
    <Card
      ref="cardRef"
      :sty="{
        width: `85%`,
      }"
    >
      <Text title
        >{{ dialogType === `create` ? `Create` : `Edit` }} Delivery</Text
      >

      <Row
        :sty="{
          width: `1f`,
          align: $Align.spaceAround,
          //align: $Align.spaceBetween,
        }"
      >
        <Button
          pill
          :outlined="!isExistingDelivery"
          :onClick="
            () => {
              isExistingDelivery = true;
            }
          "
          >From Client</Button
        >
        <Button
          pill
          :outlined="isExistingDelivery"
          :onClick="
            () => {
              isExistingDelivery = false;
            }
          "
          >Manual</Button
        >
      </Row>

      <!-- Client & Tank -->
      <ClientAndTankSelector
        v-if="isExistingDelivery"
        v-model:client="client"
        v-model:tank="tank"
      />

      <!-- Label & Fuel -->
      <Label label="Label" v-if="!isExistingDelivery"
        ><Field v-model:value="deliveryLabel" underlined hint="Optional Label"
      /></Label>
      <FuelTypeDropDown
        v-if="!isExistingDelivery"
        v-model:fuelType="fuelType"
      />

      <!-- Amount -->
      <Label label="Amount"
        ><NumField
          :negativesAreAllowed="false"
          v-model:value="amount"
          underlined
          hint="gal."
      /></Label>

      <!-- Buttons -->
      <Row :sty="{ width: `1f`, align: $Align.spaceEvenly }">
        <Button outlined :onClick="closePopUp">Cancel</Button>
        <Button
          :onClick="handleYes"
          :sty="{
            background: deliveryIsValid ? $mdColors.green : $mdColors.grey,
          }"
          >{{ dialogType === `create` ? `Create` : `Save` }}</Button
        >
      </Row>
    </Card>
    <Box v-if="isExistingDelivery" />
    <Text v-if="isExistingDelivery && relatedDeliveriesCount > 0" title
      >Related Deliveries</Text
    >
    <CompletedDeliveryEntry
      v-if="isExistingDelivery"
      v-for="delivery in relatedDeliveries"
      :key="delivery._firestoreRef?.path"
      :delivery="delivery"
      hideOptions
      :sty="{ width: `85%` }"
    />
  </Body>
</template>
