<script setup lang="ts">
import { defineProps, PropType, ref, VNodeRef, watchEffect } from "vue";
import Box, { Sty, mdColors, Axis, numToFontSize } from "./Box.vue";
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
    type: String,
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
});
const emit = defineEmits(["update:value", "update:hasFocus"]);
const inputRef = ref<VNodeRef | null>(null);

// Input
function handleInput(event: Event) {
  emit("update:value", (event.target as any)?.value ?? "");
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
  if (inputElementHasFocus.value !== props.hasFocus) {
    if (props.hasFocus) {
      inputRef.value?.focus();
    } else {
      inputRef.value?.blur();
    }
  }
});
</script>

<template>
  <Box @click="inputRef?.focus()" :sty="{
    width: `1f`,
    height: underlined ? undefined : 1,
    ...sty,
  }">
    <!-- Underliened -->
    <Box v-if="underlined" :sty="{
        width: `1f`,
        height: 1,
      }">
      <!-- Input -->
      <Box :sty="{
          width: `1f`,
          height: `1f`,
          axis: Axis.column,
        }">
        <Box :sty="{
            width: `1f`,
            height: `1f`,
            axis: Axis.row,
          }">
          <Box :sty="{ width: 0.25 }" />

          <Box :sty="{ width: `1f`, }">
            <input :ref="inputRef" type="text" :value="value" @input="handleInput" @focus="handleFocus" @blur="handleBlur"
              :placeholder="hint" class="field" :style="{
                  [`--placeholder-color`]: hintColor,
                  padding: 0,
                  margin: 0,
                  height: numToFontSize(1),
                  caretColor: mdColors.green,
                }" />
          </Box>
          <Box :sty="{ width: 0.25 }" />
        </Box>
      </Box>

      <!-- Underline -->
      <Box :sty="{ width: `1f`, height: 0.25, align: $Align.bottomCenter }">
        <Box :sty="{
            width: `1f`,
            height: 0.0625,
            background: inputElementHasFocus ? mdColors.green : hintColor,//mdColors.black,
          }" />
      </Box>
    </Box>

    <!-- Blank -->
    <input v-else :ref="inputRef" type="text" :value="value" @input="handleInput" @focus="handleFocus" @blur="handleBlur"
      :placeholder="hint" class="field" :style="{
          padding: 0,
          margin: 0,
          height: numToFontSize(1),
          [`--placeholder-color`]: hintColor,
          caretColor: mdColors.green,
        }" />
  </Box>
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
