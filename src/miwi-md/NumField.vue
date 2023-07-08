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
import { exists } from "@/utils";
// Allow overriding of the default sty
const props = defineProps({
  sty: {
    type: Object as PropType<Partial<Sty>>,
    default: {},
  },
  value: {
    type: [Number, undefined, null] as PropType<number | undefined | null>,
    optional: true,
    default: "",
  },
  negativesAreAllowed: {
    type: Boolean,
    default: true,
  },
  hasFocus: {
    type: Boolean,
    default: false,
  },
  hint: {
    type: String,
    default: "--",
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
  onClick: {
    type: [Function, undefined, null] as PropType<
      (e: MouseEvent) => void | undefined | null
    >,
    default: undefined,
  },
});
const emit = defineEmits<{
  (event: "update:value", newValue: number | null): void;
  (event: "update:hasFocus", newHasFocus: boolean): void;
}>();

function textToNumber(text: string): number | null {
  const withoutCommas = text.replaceAll(",", "");
  return withoutCommas.length > 0 ? Number(withoutCommas) : null;
}

function updateValue(newText: string) {
  emit("update:value", textToNumber(newText));
}

function validateInput(newInput: string) {
  const asNumber = textToNumber(newInput);
  if (!exists(asNumber)) return true;
  if (!props.negativesAreAllowed && asNumber < 0) return false;
  if (Number.isNaN(asNumber)) return false;
  return true;
}
</script>

<template>
  <Field
    :onClick="onClick"
    :sty="sty"
    :value="(value ?? ``).toString()"
    @update:value="updateValue"
    :hasFocus="hasFocus"
    @update:hasFocus="emit('update:hasFocus', $event)"
    :hint="hint"
    :hintColor="hintColor"
    :icon="icon"
    :underlined="underlined"
    :title="title"
    :heading="heading"
    :validateNextInput="validateInput"
  />
</template>
