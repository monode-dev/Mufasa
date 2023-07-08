<script setup lang="ts">
import {
  computed,
  defineProps,
  onMounted,
  onUnmounted,
  PropType,
  ref,
  VNodeRef,
  watchEffect,
} from "vue";
import { mdColors } from "@/miwi-md/Box/BoxDecoration";
import { exists } from "@/utils";
// Allow overriding of the default sty
type Option = {
  label: string;
  data: any;
};
const props = defineProps({
  sty: {
    type: Object as PropType<Partial<Sty>>,
    default: {},
  },
  isWide: {
    type: Boolean,
    default: false,
  },
  specialOptions: {
    type: Array as PropType<Option[]>,
    default: [],
  },
  options: {
    type: Array as PropType<Option[]>,
    default: [],
  },
  filterOptions: {
    type: Function as PropType<
      (filterString: string, option: Option) => boolean
    >,
    default: () => true,
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
    required: true,
  },
  getKeyFromData: {
    type: [Function] as PropType<
      (data: any) => string | number | boolean | undefined
    >,
    required: true,
  },
  emptyListText: {
    type: String,
    default: "No Options",
  },
});

const emit = defineEmits(["update:selected"]);

const allOptions = computed(() => [...props.options, ...props.specialOptions]);

const dropDownModalRef = ref<VNodeRef | null>(null);
const openDropDownRef = ref<VNodeRef | null>(null);
const dropDownIsOpen = ref(false);
const selectedOption = computed(() => {
  const selectedKey = props.getKeyFromData(props.selected) ?? undefined;
  return allOptions.value.find(
    (x) => (props.getKeyFromData(x.data) ?? undefined) === selectedKey,
  );
});
const filterString = ref(``);
const filteredSpecialOptions = computed(() => {
  // We need to access this once incase the list is empty.
  filterString.value;
  return props.specialOptions.filter((x) =>
    props.filterOptions(filterString.value, x),
  );
});
const filteredOptions = computed(() => {
  // We need to access this once incase the list is empty.
  filterString.value;
  return props.options.filter((x) =>
    props.filterOptions(filterString.value, x),
  );
});

// Close the dropdown when the user clicks outside of it
function closeOnClickOutside(e: MouseEvent | TouchEvent) {
  if (openDropDownRef.value?.$el.contains(e.target) && !dropDownIsOpen.value) {
    dropDownIsOpen.value = true;
    e.stopPropagation();
  }
  if (
    !dropDownModalRef.value?.$el.contains(e.target) &&
    !openDropDownRef.value?.$el.contains(e.target)
  ) {
    dropDownIsOpen.value = false;
    //e.stopPropagation();
  }
}
watchEffect(() => {
  if (!dropDownIsOpen.value) {
    filterString.value = ``;
  }
});
onMounted(() => {
  document.addEventListener("click", closeOnClickOutside);
  document.addEventListener("touchend", closeOnClickOutside);
});
onUnmounted(() => {
  document.removeEventListener("click", closeOnClickOutside);
  document.removeEventListener("touchend", closeOnClickOutside);
});

function selectOption(option: Option) {
  emit(`update:selected`, option.data);
  dropDownIsOpen.value = false;
}
</script>

<template>
  <Row
    :sty="{
      width: `1f`,
      padBetween: 0.5,
      // overflowX: $Overflow.crop,
      ...sty,
    }"
  >
    <Text v-if="label !== ``">{{ label }}:</Text>

    <Box
      :sty="{
        width: `1f`,
        height: sty.scale ?? 1,
        overflowY: $Overflow.forceStretchParent,
        // overflowX: $Overflow.crop,
      }"
    >
      <!-- Button -->
      <Box
        :sty="{
          width: `1f`,
          height: sty.scale ?? 1,
          align: $Align.topLeft,
          axis: $Axis.stack,
        }"
      >
        <!-- Text -->
        <Row
          ref="openDropDownRef"
          :onClick="
            () => {
              dropDownIsOpen = !dropDownIsOpen;
            }
          "
          :sty="{
            width: `1f`,
            height: sty.scale ?? 1,
            align: $Align.spaceBetween,
          }"
        >
          <Text
            v-if="!dropDownIsOpen"
            :sty="{
              width: `1f`,
              overflowX: $Overflow.crop,
              textColor: exists(selectedOption?.data)
                ? mdColors.black
                : mdColors.grey,
            }"
          >
            {{ selectedOption?.label ?? `None` }}
          </Text>
          <Field v-else v-model:value="filterString" hint="Search" />

          <Icon icon="menuDown" />
        </Row>
        <!-- Drop Down -->
        <Box
          v-if="dropDownIsOpen"
          :sty="{
            width: isWide ? `125%` : `100%`,
            align: $Align.topLeft,
            overflowY: $Overflow.forceStretchParent,
            isInteractable: false,
          }"
        >
          <Box :sty="{ height: sty.scale ?? 1, isInteractable: false }" />
          <Box :sty="{ height: 0.5, isInteractable: false }" />
          <Box
            ref="dropDownModalRef"
            :sty="{
              width: `1f`,
              height: `40vh`,
              overflowY: $Overflow.scroll,
              pad: 0.75,
              shadowSize: 1,
              zIndex: 10000,
              background: mdColors.white,
              align: $Align.topLeft,
              isInteractable: true,
            }"
          >
            <Text
              v-if="allOptions.length === 0"
              hint
              :onClick="
                () => {
                  dropDownIsOpen = false;
                }
              "
              :sty="{
                width: `1f`,
                align: $Align.centerLeft,
              }"
              >{{ emptyListText }}</Text
            >
            <Text
              hint
              :onClick="
                () => {
                  dropDownIsOpen = false;
                }
              "
              :sty="{
                width: `1f`,
                align: $Align.centerLeft,
              }"
              >Cancel</Text
            >
            <Text
              v-for="(option, index) in filteredSpecialOptions"
              :key="index"
              :sty="{
                width: `1f`,
                align: $Align.centerLeft,
                textColor: exists(option.data) ? mdColors.black : mdColors.grey,
              }"
              :onClick="() => selectOption(option)"
              >{{ option.label }}</Text
            >
            <Box
              v-if="specialOptions.length > 0 && options.length > 0"
              :sty="{ width: `1f`, height: 0.125, background: mdColors.grey }"
            />
            <Text
              v-for="(option, index) in filteredOptions"
              :onClick="() => selectOption(option)"
              :sty="{
                width: `1f`,
                overflowX: $Overflow.crop,
                textColor: exists(option.data) ? mdColors.black : mdColors.grey,
              }"
            >
              {{ option.label }}
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  </Row>
</template>
