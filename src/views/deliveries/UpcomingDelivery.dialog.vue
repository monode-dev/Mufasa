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

const client = ref<Client | null>(
  deliveryToEdit.value?.upcomingExistingClient ?? null,
);
const tank = ref<Tank | null>(
  deliveryToEdit.value?.upcomingExistingTank ?? null,
);
const amount = ref<number | null>(deliveryToEdit.value?.quantity ?? null);

const deliveryIsValid = computed(() => {
  return (
    exists(client.value) &&
    exists(tank.value) &&
    exists(amount.value) &&
    amount.value > 0
  ); // && amount.value > 0;
});

function closePopUp() {
  popPage();
}
function handleYes() {
  if (!deliveryIsValid.value) return;
  closePopUp();
  if (props.dialogType === `create`) {
    appData.deliveries.add({
      upcomingExistingClient: client.value!,
      upcomingExistingTank: tank.value!,
      quantity: amount.value!,
    });
  } else if (props.dialogType === `edit`) {
    deliveryToEdit.value!.upcomingExistingClient = client.value!;
    deliveryToEdit.value!.upcomingExistingTank = tank.value!;
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
  <Box
    @click="popOnClickOutside"
    :sty="{
      width: `1f`,
      height: `1f`,
      background: `#f9fafdce`,
      align: $Align.center,
    }"
  >
    <Body
      :sty="{
        width: `1f`,
        height: `1f`,
        padBetween: 1,
        align: $Align.center,
      }"
    >
      <Card
        ref="cardRef"
        :sty="{
          width: `75%`,
        }"
      >
        <Text title
          >{{ dialogType === `create` ? `Create` : `Edit` }} Delivery</Text
        >

        <!-- Client & Tank -->
        <ClientAndTankSelector v-model:client="client" v-model:tank="tank" />

        <!-- Amount -->
        <Label label="Amount"
          ><NumField
            :negativesAreAllowed="false"
            v-model:value="amount"
            underlined
            hint="--"
        /></Label>

        <!-- Buttons -->
        <Row :sty="{ width: `1f`, align: $Align.spaceEvenly }">
          <Button outlined @click.stop="closePopUp">Cancel</Button>
          <Button
            @click.stop="handleYes"
            :sty="{
              background: deliveryIsValid ? $mdColors.green : $mdColors.grey,
            }"
            >{{ dialogType === `create` ? `Create` : `Save` }}</Button
          >
        </Row>
      </Card>
      <!-- <Box />
      <Text title>Related Deliveries</Text>
      <CompletedDeliveryEntry :sty="{ width: `75%` }" />
      <CompletedDeliveryEntry :sty="{ width: `75%` }" /> -->
    </Body>
  </Box>
</template>
