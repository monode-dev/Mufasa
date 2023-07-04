<script setup lang="ts">
import {
  PropType,
  VNodeRef,
  defineProps,
  onMounted,
  onUnmounted,
  ref,
} from "vue";
import { mdColors } from "@/miwi-md/Box/BoxDecoration";

// Create a prop called size
const props = defineProps({
  sty: {
    type: Object as PropType<Partial<Sty>>,
    default: {},
  },
  shouldShowEdit: {
    type: Boolean,
    default: false,
  },
  shouldShowComplete: {
    type: Boolean,
    default: false,
  },
  // options: {
  //   type: Array as PropType<{ label: string; id: string }[]>,
  //   default: [],
  // },
});

const emit = defineEmits([`delete`, `edit`, `complete`]);
function deletePressed() {
  dropDownIsOpen.value = false;
  emit(`delete`);
}
function editPressed() {
  dropDownIsOpen.value = false;
  emit(`edit`);
}
function completePressed() {
  dropDownIsOpen.value = false;
  emit(`complete`);
}

const dropDownModalRef = ref<VNodeRef | null>(null);
const openDropDownRef = ref<VNodeRef | null>(null);
const dropDownIsOpen = ref(false);

// Close the dropdown when the user clicks outside of it
function closeOnClickOutside(e: MouseEvent | TouchEvent) {
  if (
    !dropDownModalRef.value?.$el.contains(e.target) &&
    !openDropDownRef.value?.$el.contains(e.target)
  ) {
    dropDownIsOpen.value = false;
    //e.stopPropagation();
  }
}
onMounted(() => {
  document.addEventListener("click", closeOnClickOutside);
  document.addEventListener("touchend", closeOnClickOutside);
});
onUnmounted(() => {
  document.removeEventListener("click", closeOnClickOutside);
  document.removeEventListener("touchend", closeOnClickOutside);
});
</script>

<template>
  <Box
    :sty="{
      width: sty.scale ?? 1,
      height: sty.scale ?? 1,
      align: $Align.topRight,
      overflowY: $Overflow.forceStretchParent,
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
        ref="openDropDownRef"
        icon="dotsVertical"
      />
    </Box>
    <!-- Drop Down -->
    <Box v-if="dropDownIsOpen">
      <Box :sty="{ height: 0.25 }" />
      <Box
        ref="dropDownModalRef"
        :sty="{
          pad: 0.75,
          shadowSize: 1,
          zIndex: 10000,
          background: mdColors.white,
          align: $Align.centerRight,
        }"
      >
        <Row @click.stop="dropDownIsOpen = false" :sty="{ padBetween: 0.25 }">
          <Text>Cancel</Text>
          <Icon icon="close" />
        </Row>
        <Row
          v-if="shouldShowEdit"
          @click.stop="editPressed"
          :sty="{ padBetween: 0.25 }"
        >
          <Text>Edit</Text>
          <Icon icon="pencil" />
        </Row>
        <Row
          v-if="shouldShowComplete"
          @click.stop="completePressed"
          :sty="{ padBetween: 0.25 }"
        >
          <Text>Complete</Text>
          <Icon icon="check" />
        </Row>
        <Row
          @click.stop="deletePressed"
          :sty="{
            textColor: mdColors.red,
            padBetween: 0.25,
          }"
        >
          <Text>Delete</Text>
          <Icon icon="delete" />
        </Row>
      </Box>
    </Box>
  </Box>
</template>
