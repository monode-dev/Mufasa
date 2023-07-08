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
import { exists } from "./utils";
// Allow overriding of the default sty
const props = defineProps({
  sty: {
    type: Object as PropType<Partial<Sty>>,
    default: {},
  },
  underlined: {
    type: Boolean,
    default: false,
  },
  value: {
    type: String as PropType<string | undefined | null>,
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
  title: {
    type: Boolean,
    default: false,
  },
  heading: {
    type: Boolean,
    default: false,
  },
  validateNextInput: {
    type: Function as PropType<(nextInput: string) => boolean>,
    default: undefined,
  },
  onClick: {
    type: [Function, undefined, null] as PropType<
      (e: MouseEvent) => void | undefined | null
    >,
    default: undefined,
  },
});
const emit = defineEmits<{
  (event: "update:value", newValue: string): void;
  (event: "update:hasFocus", newHasFocus: boolean): void;
}>();
const inputRef = ref<VNodeRef | null>(null);

// Input
function handleInput(event: Event) {
  emit("update:value", (event.target as any)?.value ?? "");
}
function handleKeyPress(event: KeyboardEvent) {
  const nextInput = predictNextInput(event.key);
  if (exists(nextInput) && exists(props.validateNextInput)) {
    return props.validateNextInput(nextInput);
  } else {
    return true;
  }
}
function handlePaste(event: ClipboardEvent) {
  const nextInput = predictNextInput(
    event.clipboardData?.getData("text") ?? ``,
  );
  if (exists(nextInput) && exists(props.validateNextInput)) {
    return props.validateNextInput(nextInput);
  } else {
    return true;
  }
}
function predictNextInput(newText: string) {
  const input = inputRef.value;
  if (!exists(input)) return;
  return (
    input.value.slice(0, input.selectionStart) +
    newText +
    input.value.slice(input.selectionEnd)
  );
}

// Focus
const inputElementHasFocus = ref(props.hasFocus);

const handleFocus = (e: FocusEvent) => {
  inputElementHasFocus.value = true;
  emit("update:hasFocus", true);
};

const handleBlur = (e: FocusEvent) => {
  inputElementHasFocus.value = false;
  emit("update:hasFocus", false);
};

watchEffect(() => {
  if (props.hasFocus !== (inputRef.value === document.activeElement)) {
    if (props.hasFocus) {
      inputRef.value?.focus();
    } else {
      inputRef.value?.blur();
    }
  }
});

const detailColor = computed(() =>
  inputElementHasFocus.value
    ? mdColors.green
    : props.value === `` || !exists(props.value)
    ? mdColors.grey
    : props.sty?.textColor ?? mdColors.black,
);

const scale = computed(() => (props.heading ? 1.5 : props.title ? 1.25 : 1));

onMounted(() => {
  if (props.hasFocus) {
    inputRef.value?.focus();
  }
});

function tryFocus() {
  inputRef.value?.focus();
}

const underlineHeight = computed(() =>
  props.underlined ? 0.25 * scale.value : 0,
);
</script>

<template>
  <Row
    :onClick="onClick ?? (() => tryFocus())"
    :sty="{
      width: `1f`,
      height: scale + underlineHeight,
      textColor: mdColors.black,
      padBetween: 0.25,
      overflowY: $Overflow.forceStretchParent,
      align: $Align.topLeft,
      ...sty,
      scale: scale,
    }"
  >
    <Icon v-if="icon !== ``" :icon="icon" :color="detailColor" />
    <!-- Underliened -->
    <Box
      v-if="underlined"
      :sty="{
        width: `1f`,
        height: scale + underlineHeight,
      }"
    >
      <!-- Input -->
      <Box
        :sty="{
          width: `1f`,
          height: `1f`,
          axis: $Axis.column,
        }"
      >
        <Box
          :sty="{
            width: `1f`,
            height: `1f`,
            axis: $Axis.row,
          }"
        >
          <Box :sty="{ width: 0.25 }" />

          <Box :sty="{ width: `1f` }">
            <input
              ref="inputRef"
              type="text"
              :value="value"
              @input="handleInput"
              @focus="handleFocus"
              @blur="handleBlur"
              :placeholder="hint"
              :onkeypress="handleKeyPress"
              :on-paste="handlePaste"
              class="field"
              :style="{
                padding: 0,
                margin: 0,
                height: numToFontSize(
                  typeof sty.scale === `string` ? 1 : sty.scale ?? scale,
                ),
                lineHeight:
                  typeof sty.scale === `string`
                    ? sty.scale
                    : sizeToCss(sty.scale ?? scale),
                [`--placeholder-color`]: hintColor,
                caretColor: $mdColors.green,
              }"
            />
          </Box>
          <Box :sty="{ width: 0.25 }" />
        </Box>
      </Box>

      <!-- Underline -->
      <Box
        :sty="{
          width: `1f`,
          height: underlineHeight,
          align: $Align.bottomCenter,
        }"
      >
        <Box
          :sty="{
            width: `1f`,
            height: 0.0625,
            background: detailColor,
          }"
        />
      </Box>
    </Box>

    <!-- Blank -->
    <input
      v-else
      ref="inputRef"
      type="text"
      :value="value"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      :placeholder="hint"
      :onkeypress="handleKeyPress"
      :on-paste="handlePaste"
      class="field"
      :style="{
        padding: 0,
        margin: 0,
        overflowY: `visible`,
        height: numToFontSize(
          typeof sty.scale === `string` ? 1 : sty.scale ?? scale,
        ),
        lineHeight:
          typeof sty.scale === `string`
            ? sty.scale
            : sizeToCss(sty.scale ?? scale),
        [`--placeholder-color`]: hintColor,
        caretColor: $mdColors.green,
      }"
    />
  </Row>
</template>

<style scoped>
.field {
  border: none;
  background-color: transparent;
  outline: none;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  color: inherit;
  padding: 0;
  margin: 0;
  width: 100%;
  overflow: visible;
  /* background-color: #ff0000; */
  /* display: flex; */
  /* justify-content: start; */
  /* align-items: start; */
}

.field::placeholder {
  color: var(--placeholder-color);
}

/* Add vendor-prefixed rules for better browser compatibility */
.field::-webkit-input-placeholder {
  color: var(--placeholder-color);
}

.field::-moz-placeholder {
  color: var(--placeholder-color);
  opacity: 1;
}

.field:-ms-input-placeholder {
  color: var(--placeholder-color);
}

.field::-ms-input-placeholder {
  color: var(--placeholder-color);
}
</style>
