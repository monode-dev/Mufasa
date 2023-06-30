<script setup lang="ts">
// import { PropType } from "vue";
import { pageTransitions, popPage, pushPage } from "@/Nav";
import { Client, Tank, FuelType, getAppData } from "@/AppData";
import { PropType, VNodeRef, computed, ref, watchEffect } from "vue";
import { exists, orderDocs } from "@/utils";
import { mdColors } from "@/miwi-md/Box/BoxDecoration";

const appData = getAppData();

const cardRef = ref<VNodeRef | null>(null);

const client = ref<Client | undefined>(undefined);
const tank = ref<Tank | undefined>(undefined);
const amount = ref(0);

const deliveryIsValid = computed(() => {
  return exists(client.value) && exists(tank.value); // && amount.value > 0;
});

function closePopUp() {
  popPage();
}
function handleYes() {
  if (!deliveryIsValid.value) return;
  closePopUp();
  appData.deliveries.add({
    upcomingExistingClient: client.value!,
    upcomingExistingTank: tank.value!,
    quantity: amount.value,
  });
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
            :getKeyFromData="(data: Client | undefined) => {
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
            ]"
            :options="[
            ...orderDocs(appData.clients, (x) => x.name)
              .filter((x) => x.name !== `` && x.name !== null && x.name !== undefined)
              .map((x) => ({ label: x.name!, data: x })),
          ]"
          />
        </Label>

        <!-- Tank -->
        <Label label="Tank" v-if="exists(client)">
          <DropDown
            v-model:selected="tank"
            :getKeyFromData="(data: Tank | undefined) => {
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
            ]"
            :options="[
              ...orderDocs((client as Client | undefined)?.tanks ?? [], (x) => x.creationTimePosix).map(
                (x, index) => ({ label: `#${index}`, data: x }),
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
              background: deliveryIsValid ? mdColors.green : mdColors.grey,
            }"
            >Create</Button
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
