<script setup lang="ts">
import { pageTransitions, popPage } from "@/Nav";
import { Delivery, getClientLabel } from "@/AppData";
import { PropType, VNodeRef, computed, ref } from "vue";
import { canCompleteDelivery } from "@/AppData";

const props = defineProps({
  delivery: {
    type: Object as PropType<Delivery>,
    required: true,
  },
  dialogType: {
    type: String as PropType<`complete` | `edit`>,
    default: `complete`,
  },
});

const cardRef = ref<VNodeRef | null>(null);
const clientNameLabel = ref(
  props.dialogType === `complete`
    ? getClientLabel(props.delivery.upcomingExistingClient)
    : props.delivery.completedClientLabel,
);
const quantity = ref(props.delivery.quantity ?? 0);
const fuelTypeName = ref(
  props.dialogType === `complete`
    ? props.delivery.upcomingExistingTank?.fuelType?.name ?? `Unnamed`
    : props.delivery.completedFuelTypeName,
);
const rate = ref(
  props.dialogType === `complete`
    ? props.delivery.upcomingExistingTank?.fuelType?.rate ?? 0
    : props.delivery.completedRate,
);

const deliveryIsValid = computed(() => {
  return canCompleteDelivery(props.delivery as Delivery);
});
function handleComplete() {
  if (!deliveryIsValid.value && props.dialogType === `complete`) return;
  popPage();
  props.delivery.completedClientLabel = clientNameLabel.value;
  props.delivery.quantity = quantity.value;
  props.delivery.completedFuelTypeName = fuelTypeName.value;
  props.delivery.completedRate = rate.value;
  if (props.dialogType === `complete`) {
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
    @click="popOnClickOutside"
    :sty="{
      width: `1f`,
      height: `1f`,
      background: `#00000099`,
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
        ><Field v-model:value="clientNameLabel" hint="Client"
      /></Label>
      <Label label="Fuel"
        ><Field v-model:value="fuelTypeName" hint="Fuel"
      /></Label>
      <Label label="Amount"
        ><NumField v-model:value="quantity" hint="Amount"
      /></Label>
      <Label label="Rate"><NumField v-model:value="rate" hint="Rate" /></Label>
      <Row :sty="{ width: `1f`, spacing: $Spacing.spaceEvenly }">
        <Button outlined @click.stop="popPage">Cancel</Button>
        <Button
          @click.stop="handleComplete"
          :sty="{
            background:
              deliveryIsValid || dialogType === `edit`
                ? $mdColors.green
                : $mdColors.grey,
          }"
          >{{ dialogType === `complete` ? `Complete` : `Save` }}</Button
        >
      </Row>
    </Card>
  </Box>
</template>
