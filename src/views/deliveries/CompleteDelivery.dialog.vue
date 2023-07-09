<script setup lang="ts">
import { pageTransitions, popPage } from "@/Nav";
import { Delivery, deliveryFormats, getClientLabel } from "@/AppData";
import { PropType, VNodeRef, computed, ref } from "vue";
import { canCompleteDelivery } from "@/AppData";

const props = defineProps({
  delivery: {
    type: Object as PropType<Delivery>,
    required: true,
  },
});

const cardRef = ref<VNodeRef | null>(null);
const deliveryLabel = ref(
  props.delivery.deliveryFormat === deliveryFormats.upcomingFromExisting
    ? getClientLabel(props.delivery.upcomingExistingClient)
    : props.delivery.deliveryLabel,
);
const quantity = ref(props.delivery.quantity ?? 0);
const fuelTypeName = ref(
  props.delivery.deliveryFormat === deliveryFormats.upcomingFromExisting
    ? props.delivery.upcomingExistingTank?.fuelType?.name ?? `Unnamed`
    : props.delivery.deliveryFormat === deliveryFormats.completed
    ? props.delivery.completedFuelTypeName
    : props.delivery.upcomingOneTimeFuelType?.name ?? `Unnamed`,
);
const rate = ref(
  props.delivery.deliveryFormat === deliveryFormats.upcomingFromExisting
    ? props.delivery.upcomingExistingTank?.fuelType?.rate ?? 0
    : props.delivery.deliveryFormat === deliveryFormats.completed
    ? props.delivery.completedRate
    : props.delivery.upcomingOneTimeFuelType?.rate ?? 0,
);

function handleComplete() {
  popPage();
  props.delivery.deliveryLabel = deliveryLabel.value;
  props.delivery.quantity = quantity.value;
  props.delivery.completedFuelTypeName = fuelTypeName.value;
  props.delivery.completedRate = rate.value;
  if (props.delivery.deliveryFormat !== deliveryFormats.completed) {
    props.delivery.completedTimePosix = Date.now();
    props.delivery.deliveryFormat = `completed`;
  }
}

// Close the pop up when the user clicks outside of it
function popOnClickOutside(e: MouseEvent) {
  if (!cardRef.value?.$el.contains(e.target)) {
    popPage();
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
    :onClick="popOnClickOutside"
    :sty="{
      width: `1f`,
      height: `1f`,
      background: `#00000099`,
      bonusTouch: false,
    }"
  >
    <Card
      ref="cardRef"
      :sty="{
        width: `75%`,
        shadowSize: 0,
      }"
    >
      <Text title>Complete Delivery</Text>
      <Label label="Client"
        ><Field v-model:value="deliveryLabel" hint="--"
      /></Label>
      <Label label="Fuel"
        ><Field v-model:value="fuelTypeName" hint="--"
      /></Label>
      <Label label="Amount"
        ><NumField
          :negativesAreAllowed="false"
          v-model:value="quantity"
          hint="gal."
      /></Label>
      <Label label="Rate"
        ><NumField
          :negativesAreAllowed="false"
          v-model:value="rate"
          hint="$/gal."
      /></Label>
      <Row :sty="{ width: `1f`, align: $Align.spaceEvenly }">
        <Button outlined :onClick="popPage">Cancel</Button>
        <Button
          :onClick="handleComplete"
          :sty="{
            background: $mdColors.green,
          }"
          >{{
            props.delivery.deliveryFormat === deliveryFormats.completed
              ? `Save`
              : `Complete`
          }}</Button
        >
      </Row>
    </Card>
  </Box>
</template>
