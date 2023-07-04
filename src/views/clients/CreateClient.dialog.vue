<script setup lang="ts">
// import { PropType } from "vue";
import { pageTransitions, popPage, pushPage } from "@/Nav";
import { Client, getAppData } from "@/AppData";
import { PropType, VNodeRef, computed, ref } from "vue";
import ClientPage from "./Client.page.vue";
import { exists } from "@/utils";
import { mdColors } from "@/miwi-md/Box/BoxDecoration";

const props = defineProps({
  // client: {
  //   type: Object as PropType<Client>,
  //   required: true,
  // },
  // message: {
  //   type: String,
  //   required: true,
  // },
});

const appData = getAppData();

const cardRef = ref<VNodeRef | null>(null);
const name = ref(``);
const clientId = ref<string>(``);
const phoneNumber = ref(``);
const address = ref(``);
const notes = ref(``);

function closePopUp() {
  popPage();
}

const clientIsValid = computed(() => {
  return name.value.length > 0 || clientId.value !== null;
});
function handleYes() {
  if (!clientIsValid.value) return;
  closePopUp();
  const newClient = appData.clients.add({
    name: name.value,
    clientId: clientId.value,
    phoneNumber: phoneNumber.value,
    address: address.value,
    notes: notes.value,
  });
  pushPage(ClientPage, { client: newClient });
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
      <Text title>Create Client</Text>
      <ClientFields
        v-model:name="name"
        v-model:clientId="clientId"
        v-model:phoneNumber="phoneNumber"
        v-model:address="address"
        v-model:notes="notes"
      />
      <Row :sty="{ width: `1f`, align: $Align.spaceEvenly }">
        <Button outlined @click.stop="closePopUp">Cancel</Button>
        <Button
          @click.stop="handleYes"
          :sty="{
            background: clientIsValid ? $mdColors.green : $mdColors.grey,
          }"
          >Create</Button
        >
      </Row>
    </Card>
  </Box>
</template>
