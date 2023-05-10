<script setup lang="ts">
import {
  defineProps,
  PropType,
  ref,
  defineEmits,
  watchEffect,
  computed,
} from "vue";
import { mdColors } from "@/miwi-md/Box.vue";
import { Doc, Client, useFirestore } from "@/firebase";
import { pushPage } from "@/Nav";
import ClientPage from "./Client.page.vue";

const props = defineProps({
  filteredClients: {
    type: Array as PropType<Client[]>,
    required: true,
  },
  sty: {
    type: Object as StyProp,
    default: {},
  },
});

const model = useFirestore();

const filterString = ref("");

const textHasBeenEntered = computed(() => {
  return filterString.value.length > 0;
});

watchEffect(() => {
  emit(
    "update:filteredClients",
    props.filteredClients.filter((client) => {
      if (!client.name) return false;
      return client.name
        .toLowerCase()
        .includes(filterString.value.toLowerCase());
    }),
  );
});

const emit = defineEmits(["update:filteredClients"]);

function addPressed() {
  if (textHasBeenEntered.value) {
    const newClient = model.createClient(filterString.value);
    filterString.value = "";
    // pushPage(ClientPage, { client: newClient });
  }
}
</script>

<template>
  <Box
    :sty="{
      width: `1f`,
      background: mdColors.green,
      axis: $Axis.row,
      padding: 0.5,
      shadowSize: 1.25,
      shadowDirection: $Align.bottomCenter,
      spacing: 0.5,
      ...sty,
    }"
  >
    <Box
      :sty="{
        width: `1f`,
        padding: 0.25,
        cornerRadius: 0.75,
        align: $Align.centerLeft,
        background: mdColors.white,
        textColor: mdColors.grey,
        axis: $Axis.row,
      }"
    >
      <Box :sty="{ width: 0.25 }" />
      <Field hint="Add New or Search" v-model:value="filterString" />
      <Box :sty="{ width: 0.25 }" />
    </Box>
    <Icon
      @click="addPressed"
      :scale="1.5"
      icon="plus"
      :color="mdColors.white"
    />
  </Box>
</template>
