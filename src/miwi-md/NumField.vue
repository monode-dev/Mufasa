<script setup lang="ts">
import {
  computed,
  defineProps,
  PropType,
  ref,
  VNodeRef,
  watchEffect,
  onMounted,
} from "vue";
import { mdColors } from "./Box/BoxDecoration";
import { sizeToCss } from "./Box/BoxSize";
import { numToFontSize } from "./Box/BoxText";
import { Overflow, Axis, Align } from "./Box/BoxLayout";
// Allow overriding of the default sty
const props = defineProps({
  sty: {
    type: Object as PropType<Partial<Sty>>,
    default: {},
  },
  value: {
    type: Number as PropType<number | undefined | null>,
    optional: true,
    default: "",
  },
  hasFocus: {
    type: Boolean,
    default: false,
  },
  hint: {
    type: String,
    default: "Input text.",
  },
  hintColor: {
    type: String,
    default: mdColors.grey,
  },
  icon: {
    type: String,
    default: "",
  },
  underlined: {
    type: Boolean,
    default: false,
  },
  title: {
    type: Boolean,
    default: false,
  },
  heading: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits<{
  (event: "update:value", newValue: number): void;
  (event: "update:hasFocus", newHasFocus: boolean): void;
}>();

function textToNumber(text: string) {
  const withoutCommas = text.replaceAll(",", "");
  return Number(withoutCommas);
}

function updateValue(newText: string) {
  emit("update:value", textToNumber(newText));
}

function allowOnlyNumbers(newInput: string) {
  return !Number.isNaN(textToNumber(newInput));
}
</script>

<template>
  <Field
    :sty="sty"
    :value="value?.toString()"
    @update:value="updateValue"
    :hasFocus="hasFocus"
    @update:hasFocus="emit('update:hasFocus', $event)"
    :hint="hint"
    :hintColor="hintColor"
    :icon="icon"
    :underlined="underlined"
    :title="title"
    :heading="heading"
    :validateNextInput="allowOnlyNumbers"
  />
</template>
