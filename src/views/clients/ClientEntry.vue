<script setup lang="ts">
import { PropType, VNodeRef, defineProps, ref } from "vue";
import { pushPage } from "@/Nav";
import ClientPage from "./Client.page.vue";
import { Client, LOADING } from "@/firebase";
import { Overflow, mdColors } from "@/miwi-md/Box.vue";
import vClickOutside from "v-click-outside";

// Create a prop called size
const props = defineProps({
  client: {
    type: Object as PropType<Client>,
    required: true,
  },
});

const dropDownModalRef = ref<VNodeRef | null>(null);
const dropDownIsOpen = ref(false);

// Close the dropdown when the user clicks outside of it
document.addEventListener("click", (e) => {
  if (dropDownIsOpen.value && !dropDownModalRef.value?.$el.contains(e.target)) {
    dropDownIsOpen.value = false;
  }
});
</script>

<template>
  <Box
    :sty="{
      width: `1f`,
      height: 1,
      align: $Align.topRight,
    }"
  >
    <!-- Entry -->
    <Box
      @click="pushPage(ClientPage, { client })"
      :sty="{
        width: `1f`,
        height: `100%`,
        spacing: $Spacing.spaceBetween,
        axis: $Axis.row,
        textColor: client.name === LOADING ? mdColors.grey : mdColors.black,
        overflowY: Overflow.visible,
      }"
    >
      {{ client.name ?? `Loading...` }}
      <Icon
        @click.stop="(e) => (dropDownIsOpen = !dropDownIsOpen)"
        icon="dotsVertical"
      />
    </Box>
    <!-- Drop Down -->
    <Box v-if="dropDownIsOpen">
      <Box :sty="{ height: 0.25 }" />
      <Box
        ref="dropDownModalRef"
        :sty="{
          padding: 1,
          spacing: 1,
          shadowSize: 1,
          zIndex: 10000,
          background: mdColors.white,
        }"
      >
        <Row :sty="{ textColor: mdColors.red, spacing: 0.25 }">
          <Text>Delete</Text>
          <Icon icon="delete" />
        </Row>
        <Row :sty="{ spacing: 0.25 }">
          <Text>Cancel</Text>
          <Icon icon="close" />
        </Row>
      </Box>
    </Box>
  </Box>
</template>
