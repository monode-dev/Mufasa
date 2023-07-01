<script setup lang="ts">
// import { PropType } from "vue";
import { pageTransitions, popPage, pushPage } from "@/Nav";
import {
  Delivery,
  UpcomingExistingDelivery,
  completeDelivery,
  getAppData,
} from "@/AppData";
import { PropType, VNodeRef, computed, ref } from "vue";
import { exists } from "@/utils";
import { mdColors } from "@/miwi-md/Box/BoxDecoration";
import { canCompleteDelivery } from "@/AppData";

const props = defineProps({
  delivery: {
    type: Object as PropType<UpcomingExistingDelivery>,
    required: true,
  },
  // message: {
  //   type: String,
  //   required: true,
  // },
});

const appData = getAppData();
const cardRef = ref<VNodeRef | null>(null);
const clientName = ref(props.delivery.upcomingExistingClient!.name!);
const quantity = ref(props.delivery.quantity ?? 0);
const completedFuelTypeName = ref(
  props.delivery.upcomingExistingTank!.fuelType!.name!,
);
const completedRate = ref(props.delivery.upcomingExistingTank!.fuelType!.rate!);

function closePopUp() {
  popPage();
}

const deliveryIsValid = computed(() => {
  return canCompleteDelivery(props.delivery as Delivery);
});
function handleComplete() {
  if (!deliveryIsValid.value) return;
  closePopUp();
  completeDelivery(props.delivery as Delivery);
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
      <Row :sty="{ width: `1f`, spacing: $Spacing.spaceEvenly }">
        <Button outlined @click.stop="closePopUp">Cancel</Button>
        <Button
          @click.stop="handleComplete"
          :sty="{
            background: deliveryIsValid ? $mdColors.green : $mdColors.grey,
          }"
          >Complete</Button
        >
      </Row>
    </Card>
  </Box>
</template>
