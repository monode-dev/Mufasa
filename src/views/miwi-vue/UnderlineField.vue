<script setup lang="ts">
import { defineProps, PropType, ref, VNodeRef, watchEffect } from "vue";
import B, { Sty, mdColors, Axis } from "./B.vue";
// Allow overriding of the default sty
const props = defineProps({
  sty: {
    type: Object as PropType<Partial<Sty>>,
    default: {},
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
  <B
    @click="inputRef?.focus()"
    :sty="{
      width: 10,
      height: 2,
      ...sty,
    }"
  >
    <!-- Input -->
    <B
      :sty="{
        width: `1f`,
        height: `1f`,
        axis: Axis.column,
      }"
    >
      <B :sty="{ height: 0.125 }" />
      <B
        :sty="{
          width: `1f`,
          height: `1f`,
          axis: Axis.row,
        }"
      >
        <B :sty="{ width: 0.5 }" />
        <input
          :ref="inputRef"
          type="text"
          :value="value"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
          :placeholder="hint"
          class="field"
          :style="{
            [`--placeholder-color`]: hintColor,
            caretColor: mdColors.green,
          }"
        />
        <B :sty="{ width: 0.125 }" />
      </B>
    </B>

    <!-- Underline -->
    <B
      :sty="{
        width: `1f`,
        height: `2px`,
        background: inputElementHasFocus ? mdColors.green : mdColors.black,
      }"
    />
  </B>
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
