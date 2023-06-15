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
import Box, {
  Sty,
  mdColors,
  Axis,
  numToFontSize,
  Overflow,
  sizeToCss,
} from "./Box.vue";
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
    type: [String, Number] as PropType<string | number | undefined | null>,
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

const detailColor = computed(() =>
  inputElementHasFocus.value
    ? mdColors.green
    : props.value === ``
    ? mdColors.grey
    : mdColors.black,
);

const scale = computed(() => (props.heading ? 1.5 : props.title ? 1.25 : 1));

onMounted(() => {
  if (props.hasFocus) {
    inputRef.value?.focus();
  }
});
</script>

<template>
  <Box
    @click="inputRef?.focus()"
    :sty="{
      width: `1f`,
      height: underlined ? undefined : 1,
      textColor: mdColors.black,
      axis: Axis.row,
      spacing: 0.25,
      overflowY: Overflow.visible,
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
        height: scale,
      }"
    >
      <!-- Input -->
      <Box
        :sty="{
          width: `1f`,
          height: `1f`,
          axis: Axis.column,
        }"
      >
        <Box
          :sty="{
            width: `1f`,
            height: `1f`,
            axis: Axis.row,
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
                caretColor: `#f2b212ff`,
              }"
            />
          </Box>
          <Box :sty="{ width: 0.25 }" />
        </Box>
      </Box>

      <!-- Underline -->
      <Box :sty="{ width: `1f`, height: 0.25, align: $Align.bottomCenter }">
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
        caretColor: `#f2b212ff`,
      }"
    />
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
  overflow: visible;
  background-color: #ff0000;
  display: flex;
  justify-content: start;
  align-items: start;
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
