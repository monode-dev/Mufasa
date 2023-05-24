<script setup lang="ts">
import {
  defineProps,
  onMounted,
  onUnmounted,
  PropType,
  ref,
  VNodeRef,
} from "vue";
import Box, { Sty, mdColors, Axis, Align, Overflow } from "./Box.vue";
// Allow overriding of the default sty
const props = defineProps({
  sty: {
    type: Object as PropType<Partial<Sty>>,
    default: {},
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  label: {
    type: String,
    default: "",
  },
  selected: {
    type: String,
    default: "",
  },
  underlined: {
    type: Boolean,
    default: false,
  },
});

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
  <Row
    :sty="{
      width: `1f`,
      spacing: 0.5,
      ...sty,
    }"
  >
    <Text>{{ label }}:</Text>

    <Box
      :sty="{
        width: `1f`,
        height: sty.scale ?? 1,
        overflowY: Overflow.visible,
      }"
    >
      <!-- Button -->
      <Box
        :sty="{ width: `1f`, height: sty.scale ?? 1, align: $Align.topCenter }"
      >
        <!-- Text -->
        <Row
          @click.stop="(e) => (dropDownIsOpen = !dropDownIsOpen)"
          ref="openDropDownRef"
          :sty="{
            width: `1f`,
            height: sty.scale ?? 1,
            spacing: $Spacing.spaceBetween,
          }"
        >
          <Text>{{ selected }}</Text>
          <Icon icon="menuDown" />
        </Row>
        <!-- Drop Down -->
        <Box v-if="dropDownIsOpen" :sty="{ align: $Align.topCenter }">
          <Box :sty="{ height: 0.25 }" />
          <Box
            ref="dropDownModalRef"
            :sty="{
              width: `1f`,
              padding: 0.75,
              spacing: 0.75,
              shadowSize: 1,
              zIndex: 10000,
              background: mdColors.white,
              align: $Align.centerLeft,
            }"
          >
            <Text>Cancel</Text>
            <Text>Cancel</Text>
          </Box>
        </Box>
      </Box>
      <!-- Underline -->
      <Box
        v-if="underlined"
        :sty="{
          width: `1f`,
          height: 0.25,
        }"
      >
        <Box
          :sty="{
            width: `1f`,
            height: 0.0625,
            background: mdColors.grey,
          }"
        />
      </Box>
    </Box>
  </Row>
</template>
