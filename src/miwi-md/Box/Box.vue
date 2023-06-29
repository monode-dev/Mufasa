<script setup lang="ts">
import { computed, getCurrentInstance, defineProps, PropType, ref } from "vue";
import { isNum, isString } from "../utils";
import { computeTextStyle, TextSty } from "./BoxText";
import { computeBoxSize, SizeSty, sizeToCss } from "./BoxSize";
import { Align, Axis, computeBoxLayout, LayoutSty } from "./BoxLayout";
import { computeBoxDecoration, DecorationSty, mdColors } from "./BoxDecoration";
import { computeBoxInteraction, InteractionSty } from "./BoxInteraction";

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
});
const parentAxis = ref<Axis>(Axis.column);
const childCount = ref(0);
const childWidthGrows = ref(false);
const childHeightGrows = ref(false);
const axis = computed(() => props.sty.axis ?? Axis.column);
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
  const cssPadding =
    isString(props.sty.padding) && props.sty.padding.startsWith(`css `)
      ? props.sty.padding.split(`css `)[1]
      : isNum(props.sty.padding)
      ? sizeToCss(props.sty.padding)
      : (props.sty.padding ?? ``)
          .split(` `)
          .map((p) => sizeToCss(Number(p)))
          .join(` `);
  return {
    ...computeBoxSize(
      props.sty,
      childWidthGrows.value,
      childHeightGrows.value,
      parentAxis.value,
      //this.$parent
      getCurrentInstance()?.parent,
    ),
    ...computeBoxLayout(
      props.sty,
      align,
      cssPadding,
      //this.$parent
      getCurrentInstance()?.parent,
      axis.value,
      childCount.value,
    ),
    ...computeBoxDecoration(props.sty),
    ...computeTextStyle(props.sty, align),
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
        (axis.value === Axis.row &&
          (getComputedStyle(child).flexBasis !== "auto" ||
            getComputedStyle(child).flexGrow !== "0"))
      );
    });
    childHeightGrows.value = children.some((child) => {
      if (!child.classList.contains(`b-x`)) return false;
      return (
        child.style.height === "100%" ||
        (axis.value === Axis.column &&
          (getComputedStyle(child).flexBasis !== "auto" ||
            getComputedStyle(child).flexGrow !== "0"))
      );
    });
  })();
}
</script>

<template>
  <div class="b-x" :style="style" :ref="(updateFromHtml as any)">
    <slot />
  </div>
</template>
