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
import { PropType, VNodeRef, computed, ref } from "vue";
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
const amount = ref(deliveryToEdit.value?.quantity ?? 0);

const deliveryIsValid = computed(() => {
  return exists(client.value) && exists(tank.value); // && amount.value > 0;
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
      quantity: amount.value,
    });
  } else if (props.dialogType === `edit`) {
    deliveryToEdit.value!.upcomingExistingClient = client.value!;
    deliveryToEdit.value!.upcomingExistingTank = tank.value!;
    deliveryToEdit.value!.quantity = amount.value;
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
        spacing: 1,
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

        <!-- Client -->
        <Label label="Client">
          <DropDown
            v-model:selected="client"
            :isWide="true"
            :maxChars="17"
            :getKeyFromData="(data: Client | null) => {
                return data?._firestoreRef?.path;
            }"
            :options="[
              ...orderDocs(appData.clients, (x) => getClientLabel(x))
                .filter(
                  (x) =>
                    (exists(x.name) && x.name.length > 0) || exists(x.clientId),
                )
                .map((x) => ({ label: getClientLabel(x), data: x })),
            ]"
          />
        </Label>

        <!-- Tank -->
        <Label label="Tank" v-if="exists(client)">
          <DropDown
            v-model:selected="tank"
            :isWide="true"
            :maxChars="25"
            :getKeyFromData="(data: Tank | null) => {
                return data?._firestoreRef?.path;
            }"
            :options="[
              ...orderDocs((client as Client | undefined)?.tanks ?? [], (x) => x.creationTimePosix).map(
                (x, index) => ({ label: getTankLabel(x), data: x }),
              ),
            ]"
          />
        </Label>

        <!-- Amount -->
        <Label label="Amount"><NumField v-model:value="amount" /></Label>

        <!-- Buttons -->
        <Row :sty="{ width: `1f`, spacing: $Spacing.spaceEvenly }">
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
