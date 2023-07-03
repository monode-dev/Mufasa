<script setup lang="ts">
import {
  computed,
  defineProps,
  onMounted,
  onUnmounted,
  PropType,
  ref,
  VNodeRef,
} from "vue";
import { mdColors } from "./Box/BoxDecoration";
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
  speciaolOptions: {
    type: Array as PropType<Option[]>,
    default: [],
  },
  options: {
    type: Array as PropType<Option[]>,
    default: [],
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
  underlined: {
    type: Boolean,
    default: false,
  },
  maxChars: {
    type: Number,
    default: Infinity,
  },
});

const emit = defineEmits(["update:selected"]);

function getAllOptions() {
  return [...props.options, ...props.speciaolOptions];
}

const dropDownModalRef = ref<VNodeRef | null>(null);
const openDropDownRef = ref<VNodeRef | null>(null);
const dropDownIsOpen = ref(false);
const selectedOption = computed(() => {
  const selectedKey = props.getKeyFromData(props.selected) ?? undefined;
  return getAllOptions().find(
    (x) => (props.getKeyFromData(x.data) ?? undefined) === selectedKey,
  );
});

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

function selectOption(option: Option) {
  emit(`update:selected`, option.data);
  dropDownIsOpen.value = false;
}
</script>

<template>
  <Row
    :sty="{
      width: `1f`,
      spacing: 0.5,
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
          @click.stop="() => (dropDownIsOpen = !dropDownIsOpen)"
          ref="openDropDownRef"
          :sty="{
            width: `1f`,
            height: sty.scale ?? 1,
            spacing: $Spacing.spaceBetween,
          }"
        >
          <TruncatedText
            :text="selectedOption?.label ?? `None`"
            :maxChars="maxChars"
          />
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
          <Box :sty="{ height: 0.25, isInteractable: false }" />
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
              isInteractable: true,
            }"
          >
            <Text
              v-for="(option, index) in speciaolOptions"
              :key="index"
              :sty="{ width: `1f`, align: $Align.centerLeft }"
              @click.stop="selectOption(option)"
              >{{ option.label }}</Text
            >
            <Box
              v-if="speciaolOptions.length > 0 && options.length > 0"
              :sty="{ width: `1f`, height: 0.125, background: mdColors.grey }"
            />
            <TruncatedText
              v-for="(option, index) in options"
              @click.stop="selectOption(option)"
              :text="option.label"
              :maxChars="isWide ? Math.floor(maxChars * 1.25) + 1 : maxChars"
            />
            <!-- <Text
              v-for="(option, index) in options"
              :key="index"
              :sty="{
                align: $Align.centerLeft,
                overflowX: $Overflow.crop,
              }"
              @click.stop="selectOption(option)"
            >
              <div
                style="
                  width: 100%;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                "
              >
                {{ option.label }}
              </div>
            </Text> -->
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
