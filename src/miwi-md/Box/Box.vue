<script setup lang="ts">
import { computed, getCurrentInstance, defineProps, PropType, ref } from "vue";
import { isString } from "../utils";
import { computeTextStyle, TextSty } from "./BoxText";
import { computeBoxSize, SizeSty } from "./BoxSize";
import {
  Align,
  Axis,
  computeBoxLayout,
  defaultOveflowX,
  LayoutSty,
} from "./BoxLayout";
import { computeBoxDecoration, DecorationSty } from "./BoxDecoration";
import { computeBoxInteraction, InteractionSty } from "./BoxInteraction";
import { exists } from "./BoxUtils";

export type _Sty = SizeSty &
  DecorationSty &
  LayoutSty &
  TextSty &
  InteractionSty;

const props = defineProps({
  sty: {
    type: Object as PropType<Partial<Sty>>,
    default: () => ({}),
    required: false,
  },
  onClick: {
    type: [Function, undefined, null] as PropType<
      (e: MouseEvent) => void | undefined | null
    >,
    default: undefined,
  },
});
const parentAxis = ref<Axis>(Axis.column);
const childCount = ref(0);
const childWidthGrows = ref(false);
const childHeightGrows = ref(false);
const axis = props.sty.axis ?? Axis.column;
// const maxChildWidth = computed(() => {
//   if (axis.value === Axis.stack) {
//     return children.reduce((tot, curr) => {
//       return Math.max(tot, curr.el?.offsetWidth ?? 0);
//     }, 0);
//   } else {
//     return 0;
//   }
// });
// const maxChildHeight = computed(() => {
//   if (axis.value === Axis.stack) {
//     return children.reduce((tot, curr) => {
//       return Math.max(tot, curr.el?.offsetHeight ?? 0);
//     }, 0);
//   } else {
//     return 0;
//   }
// });
const style = computed(() => {
  const align = props.sty.align ?? Align.center;
  return {
    ...computeBoxSize(
      props.sty,
      childWidthGrows.value,
      childHeightGrows.value,
      parentAxis.value,
      getCurrentInstance()?.parent,
    ),
    ...computeBoxLayout(
      props.sty,
      align,
      getCurrentInstance()?.parent,
      // parentAxis.value,
      axis,
      childCount.value,
    ),
    ...computeBoxDecoration(props.sty),
    ...computeTextStyle(
      props.sty,
      isString(align) ? align : align.alignX,
      props.sty.overflowX ?? defaultOveflowX,
    ),
    ...computeBoxInteraction(props.sty),
  };
});

function updateFromHtml(divRef: HTMLElement | undefined) {
  // Update parent axis
  (() => {
    const parent = divRef?.parentElement;
    if (!parent) return;
    parent.style.flexDirection === `row`
      ? (parentAxis.value = Axis.row)
      : parent.style.flexDirection === `column`
      ? (parentAxis.value = Axis.column)
      : (parentAxis.value = Axis.stack);
  })();

  // Update Child Count
  (() => {
    if (!divRef) return;
    const children = Array.from(divRef.childNodes);
    childCount.value = children.length;
  })();

  // Update Child Size Grows
  (() => {
    if (!divRef) return;
    if ((props.sty.width ?? -1 !== -1) && (props.sty.height ?? -1 !== -1))
      return;
    const children = Array.from(divRef.childNodes).filter(
      (child) => child instanceof HTMLElement,
    ) as HTMLElement[];
    childWidthGrows.value = children.some((child) => {
      if (!child.classList.contains(`b-x`)) return false;
      return (
        child.style.width === "100%" ||
        (axis === Axis.row &&
          (getComputedStyle(child).flexBasis !== "auto" ||
            getComputedStyle(child).flexGrow !== "0"))
      );
    });
    childHeightGrows.value = children.some((child) => {
      if (!child.classList.contains(`b-x`)) return false;
      return (
        child.style.height === "100%" ||
        (axis === Axis.column &&
          (getComputedStyle(child).flexBasis !== "auto" ||
            getComputedStyle(child).flexGrow !== "0"))
      );
    });
  })();
}
</script>

<template>
  <div
    v-if="exists(onClick)"
    @click.stop="onClick"
    :class="`b-x${sty.bonusTouch ?? exists(onClick) ? ` b-x-bonus-touch` : ``}`"
    :style="style"
    :ref="(updateFromHtml as any)"
  >
    <slot />
  </div>
  <div
    v-else
    :class="`b-x${sty.bonusTouch ?? exists(onClick) ? ` b-x-bonus-touch` : ``}`"
    :style="style"
    :ref="(updateFromHtml as any)"
  >
    <slot />
  </div>
</template>

<style scoped>
.b-x-bonus-touch::before {
  content: "";
  position: absolute;
  top: -0.375rem;
  right: -0.375rem;
  bottom: -0.375rem;
  left: -0.375rem;
}
</style>
