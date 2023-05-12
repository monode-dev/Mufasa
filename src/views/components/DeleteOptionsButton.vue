<script setup lang="ts">
import { PropType, VNodeRef, defineProps, ref } from "vue";
import { Overflow, mdColors } from "@/miwi-md/Box.vue";

// Create a prop called size
const props = defineProps({
  sty: {
    type: Object as PropType<Partial<Sty>>,
    default: {},
  },
});

const emit = defineEmits(["delete"]);
function deletePressed() {
  dropDownIsOpen.value = false;
  emit(`delete`);
}

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
      width: sty.scale ?? 1,
      height: sty.scale ?? 1,
      align: $Align.topRight,
      overflowY: Overflow.visible,
    }"
  >
    <!-- Button -->
    <Box
      :sty="{
        width: `100%`,
        height: `100%`,
      }"
    >
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
          padding: 0.75,
          spacing: 0.75,
          shadowSize: 1,
          zIndex: 10000,
          background: mdColors.white,
        }"
      >
        <Row
          @click.stop="deletePressed"
          :sty="{ textColor: mdColors.red, spacing: 0.25 }"
        >
          <Text>Delete</Text>
          <Icon icon="delete" />
        </Row>
        <Row @click.stop="dropDownIsOpen = false" :sty="{ spacing: 0.25 }">
          <Text>Cancel</Text>
          <Icon icon="close" />
        </Row>
      </Box>
    </Box>
  </Box>
</template>
