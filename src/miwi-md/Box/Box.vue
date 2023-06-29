<script lang="ts">
import { CSSProperties, defineComponent, PropType } from "vue";
import { isNum, isString } from "../utils";
import { computeTextStyle, TextSty } from "./BoxText";
import { computeBoxSize, SizeSty, sizeToCss } from "./BoxSize";
import { Align, Axis, computeBoxLayout, LayoutSty } from "./BoxLayout";
import { computeBoxDecoration, DecorationSty } from "./BoxDecoration";

export type Sty = SizeSty &
  DecorationSty &
  LayoutSty &
  TextSty & {
    isInteractable: boolean;
    zIndex: number;
  };

export default defineComponent({
  name: "Box",
  props: {
    sty: {
      type: Object as PropType<Partial<Sty>>,
      default: {},
      required: false,
    },
  },
  data() {
    return {
      parentAxis: Axis.column as Axis,
      childCount: 0,
      childWidthGrows: false,
      childHeightGrows: false,
    };
  },
  computed: {
    axis(): Axis {
      return this.sty.axis ?? Axis.column;
    },
    // maxChildWidth(): number {
    //   if (this.axis === Axis.stack) {
    //     return this.children.reduce((tot, curr) => {
    //       return Math.max(tot, curr.el?.offsetWidth ?? 0);
    //     }, 0);
    //   } else {
    //     return 0;
    //   }
    // },
    // maxChildHeight(): number {
    //   if (this.axis === Axis.stack) {
    //     return this.children.reduce((tot, curr) => {
    //       return Math.max(tot, curr.el?.offsetHeight ?? 0);
    //     }, 0);
    //   } else {
    //     return 0;
    //   }
    // },
    style(): CSSProperties {
      const align = this.sty.align ?? Align.center;
      const cssPadding =
        isString(this.sty.padding) && this.sty.padding.startsWith(`css `)
          ? this.sty.padding.split(`css `)[1]
          : isNum(this.sty.padding)
          ? sizeToCss(this.sty.padding)
          : (this.sty.padding ?? ``)
              .split(` `)
              .map((p) => sizeToCss(Number(p)))
              .join(` `);
      return {
        ...computeBoxSize(
          this.sty,
          this.childWidthGrows,
          this.childHeightGrows,
          this.parentAxis,
          this.$parent,
        ),
        ...computeBoxDecoration(this.sty),
        ...computeBoxLayout(
          this.sty,
          align,
          cssPadding,
          this.$parent,
          this.axis,
          this.childCount,
        ),
        ...computeTextStyle(this.sty, align),
        pointerEvents: this.sty.isInteractable ?? true ? undefined : `none`,
        zIndex: this.sty.zIndex,
      };
    },
  },
  methods: {
    updateFromHtml(divRef: HTMLElement | undefined) {
      // Update parent axis
      (() => {
        const parent = divRef?.parentElement;
        if (!parent) return;
        parent.style.flexDirection === `row`
          ? (this.parentAxis = Axis.row)
          : parent.style.flexDirection === `column`
          ? (this.parentAxis = Axis.column)
          : (this.parentAxis = Axis.stack);
      })();

      // Update Child Count
      (() => {
        if (!divRef) return;
        const children = Array.from(divRef.childNodes);
        this.childCount = children.length;
      })();

      // Update Child Size Grows
      (() => {
        if (!divRef) return;
        if ((this.sty.width ?? -1 !== -1) && (this.sty.height ?? -1 !== -1))
          return;
        const children = Array.from(divRef.childNodes).filter(
          (child) => child instanceof HTMLElement,
        ) as HTMLElement[];
        this.childWidthGrows = children.some((child) => {
          if (!child.classList.contains(`b-x`)) return false;
          return (
            child.style.width === "100%" ||
            (this.axis === Axis.row &&
              (getComputedStyle(child).flexBasis !== "auto" ||
                getComputedStyle(child).flexGrow !== "0"))
          );
        });
        this.childHeightGrows = children.some((child) => {
          if (!child.classList.contains(`b-x`)) return false;
          return (
            child.style.height === "100%" ||
            (this.axis === Axis.column &&
              (getComputedStyle(child).flexBasis !== "auto" ||
                getComputedStyle(child).flexGrow !== "0"))
          );
        });
      })();
    },
  },
});
</script>

<template>
  <div class="b-x" :style="style" :ref="(updateFromHtml as any)">
    <slot />
  </div>
</template>
