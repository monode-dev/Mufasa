<script setup lang="ts">
// import { PropType } from "vue";
import { pageTransitions, popPage, pushPage } from "@/Nav";
import { Client, getAppData } from "@/AppData";
import { PropType, VNodeRef, computed, ref } from "vue";
import ClientPage from "./Client.page.vue";

const props = defineProps({
  client: {
    type: Object as PropType<Client>,
    required: true,
  },
  // message: {
  //   type: String,
  //   required: true,
  // },
});

const appData = getAppData();

const cardRef = ref<VNodeRef | null>(null);
const name = ref("");

const textHasBeenEntered = computed(() => {
  return name.value.length > 0;
});

function closePopUp() {
  popPage();
}
function handleYes() {
  closePopUp();
  if (textHasBeenEntered.value) {
    const newClient = appData.clients.add({ name: name.value });
    name.value = "";
    pushPage(ClientPage, { client: newClient });
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
      <Field
        underlined
        v-model:value="name"
        :has-focus="true"
        hint="Enter client name."
        :sty="{ width: `1f` }"
      />
      <Row :sty="{ width: `1f`, spacing: $Spacing.spaceEvenly }">
        <Button outlined @click.stop="closePopUp">Cancel</Button>
        <Button @click.stop="handleYes">Create</Button>
      </Row>
    </Card>
  </Box>
</template>
