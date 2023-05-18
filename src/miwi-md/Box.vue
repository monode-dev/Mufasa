<script lang="ts">
import {
  ComponentInternalInstance,
  CSSProperties,
  defineComponent,
  getCurrentInstance,
  PropType,
  ref,
  RendererElement,
  RendererNode,
  VNode,
  VNodeRef,
  watchEffect,
} from "vue";
import { isDefined, isNum, isString } from "./utils";

export interface Sty {
  width: number | string | FlexSize;
  height: number | string | FlexSize;
  cornerRadius: number | string | [number, number, number, number];
  outlineColor: string;
  outlineSize: number;
  background: string;
  shadowSize: number;
  shadowDirection: Align;
  padding: string | number;
  align: Align;
  axis: Axis;
  overflowX: Overflow;
  overflowY: Overflow;
  spacing: Spacing;
  scale: number | string;
  textColor: string;
  textIsBold: boolean;
  textIsItalic: boolean;
  textIsUnderlined: boolean;
  isInteractable: boolean;
  zIndex: number;
}
export type Axis = (typeof Axis)[keyof typeof Axis];
export const Axis = {
  row: `row`,
  column: `column`,
  stack: `stack`,
} as const;
export type Overflow = (typeof Overflow)[keyof typeof Overflow];
export const Overflow = {
  visible: `visible`,
  crop: `crop`,
  wrap: `wrap`,
  scroll: `scroll`,
} as const;
export type Spacing = number | (typeof Spacing)[keyof typeof Spacing];
export const Spacing = {
  spaceBetween: `space-between`,
  spaceAround: `space-around`,
  spaceEvenly: `space-evenly`,
} as const;
export type Align = (typeof Align)[keyof typeof Align];
export const Align = {
  topLeft: `topLeft`,
  topCenter: `topCenter`,
  topRight: `topRight`,
  centerLeft: `centerLeft`,
  center: `center`,
  centerRight: `centerRight`,
  bottomLeft: `bottomLeft`,
  bottomCenter: `bottomCenter`,
  bottomRight: `bottomRight`,
} as const;
function isLeft(align: Align) {
  const validAligns: Align[] = [
    Align.topLeft,
    Align.centerLeft,
    Align.bottomLeft,
  ];
  return validAligns.includes(align);
}
function isCenterX(align: Align) {
  const validAligns: Align[] = [
    Align.topCenter,
    Align.center,
    Align.bottomCenter,
  ];
  return validAligns.includes(align);
}
function isRight(align: Align) {
  const validAligns: Align[] = [
    Align.topRight,
    Align.centerRight,
    Align.bottomRight,
  ];
  return validAligns.includes(align);
}
function isTop(align: Align) {
  const validAligns: Align[] = [Align.topLeft, Align.topCenter, Align.topRight];
  return validAligns.includes(align);
}
function isCenterY(align: Align) {
  const validAligns: Align[] = [
    Align.centerLeft,
    Align.center,
    Align.centerRight,
  ];
  return validAligns.includes(align);
}
function isBottom(align: Align) {
  const validAligns: Align[] = [
    Align.bottomLeft,
    Align.bottomCenter,
    Align.bottomRight,
  ];
  return validAligns.includes(align);
}
export const mdColors = {
  white: `#ffffffff`,
  almostWhite: `#f9fafdff`,
  pink: `#e91e63ff`,
  red: `#f44336ff`,
  orange: `#ff9800ff`,
  yellow: `#ffea00ff`,
  green: `#4caf50ff`,
  teal: `#009688ff`,
  blue: `#2196f3ff`,
  purple: `#9c27b0ff`,
  brown: `#795548ff`,
  grey: `#9e9e9eff`,
  black: `#000000ff`,
  transparent: `#ffffff00`,
  sameAsText: `currentColor`,
} as const;

// Size
// scale: [positive-space, negative-space]
const muToRem = 1.125; //1.0625;
export function sizeToCss(num: number | string) {
  if (isNum(num)) {
    const remValue = num * muToRem;
    const fontSize = parseFloat(
      getComputedStyle(document.documentElement).fontSize,
    );
    const pixelValue = remValue * fontSize;
    return `${Math.round(pixelValue)}px`;
  } else {
    return num;
  }
}
export function numToFontSize(num: number) {
  // return sizeToCss(fontSizeToHtmlUnit * num);
  return sizeToCss(num);
}
export interface FlexSize {
  flex: number;
  min: number;
  max: number;
}
function isFlexSize(size: any): size is FlexSize {
  return isDefined(size?.flex);
}
function computeSizeInfo({
  size,
  isMainAxis,
}: {
  size: number | string | FlexSize;
  isMainAxis: boolean;
}) {
  const isShrink = size === -1;
  const sizeIsFlex = isFlexSize(size);
  const exactSize =
    !isMainAxis && sizeIsFlex
      ? `100%`
      : isString(size)
      ? size
      : !isShrink && !sizeIsFlex
      ? sizeToCss(size)
      : sizeIsFlex
      ? undefined
      : `fit-content`;
  const minSize = sizeIsFlex
    ? isShrink
      ? `0` // We used `0` because a min of `fit-content` can overflow the parent which is not what we want
      : size.min === Infinity
      ? exactSize
      : sizeToCss(size.min)
    : exactSize;
  const maxSize = sizeIsFlex
    ? isShrink
      ? `fit-content`
      : size.max === Infinity
      ? exactSize ?? `100%`
      : sizeToCss(size.max)
    : exactSize;
  return [exactSize, minSize, maxSize, sizeIsFlex] as const;
}

export default defineComponent({
  name: "Box",
  props: {
    sty: {
      type: Object as PropType<Partial<Sty>>,
      default: {},
      required: false,
    },
    shouldLog: {
      type: Boolean,
      default: false,
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
      let width =
        (this.sty.width ?? -1) === -1
          ? this.childWidthGrows
            ? `1f`
            : -1
          : this.sty.width ?? -1;
      if (isString(width) && width.endsWith(`f`)) {
        width = {
          flex: parseFloat(width.split(`f`)[0]),
          min: -1,
          max: Infinity,
        }; // satisfies FlexSize;
      }
      const [exactWidth, wMin, wMax, widthGrows] = computeSizeInfo({
        size: width,
        isMainAxis: this.parentAxis === Axis.row,
      });
      let height =
        (this.sty.height ?? -1) === -1
          ? this.childHeightGrows
            ? `1f`
            : -1
          : this.sty.height ?? -1;
      if (isString(height) && height.endsWith(`f`)) {
        height = {
          flex: parseFloat(height.split(`f`)[0]),
          min: -1,
          max: Infinity,
        }; // satisfies FlexSize;
      }
      const [exactHeight, hMin, hMax, heightGrows] = computeSizeInfo({
        size: height,
        isMainAxis: this.parentAxis === Axis.column,
      });
      const shadowDirection = (() => {
        switch (this.sty.shadowDirection ?? Align.bottomRight) {
          case Align.topLeft:
            return { x: -1, y: 1 };
          case Align.topCenter:
            return { x: 0, y: 1 };
          case Align.topRight:
            return { x: 1, y: 1 };
          case Align.centerLeft:
            return { x: -1, y: 0 };
          case Align.center:
            return { x: 0, y: 0 };
          case Align.centerRight:
            return { x: 1, y: 0 };
          case Align.bottomLeft:
            return { x: -1, y: -1 };
          case Align.bottomCenter:
            return { x: 0, y: -1 };
          case Align.bottomRight:
            return { x: 1, y: -1 };
        }
      })();
      const cssPadding = isNum(this.sty.padding)
        ? sizeToCss(this.sty.padding)
        : this.sty.padding;
      return {
        // Sizing
        display: `flex`,
        boxSizing: `border-box`,
        // Using minWidth and maxWidth tells css to not override the size of this element
        width: (() => {
          let size = exactWidth;
          // this.axis === Axis.stack && width === -1
          //   ? this.maxChildWidth
          //   : exactWidth;
          if ((this.$parent as any)?.sty?.axis === Axis.stack) {
            size = `calc(${size} - ${
              this.$parent?.$el?.paddingLeft ?? `0px`
            } - ${this.$parent?.$el?.paddingRight ?? `0px`})`;
          }
          return size;
        })(),
        minWidth: (() => {
          let size = wMin;
          // this.axis === Axis.stack && width === -1
          //   ? this.maxChildWidth
          //   : wMin;
          if ((this.$parent as any)?.sty?.axis === Axis.stack) {
            size = `calc(${size} - ${
              this.$parent?.$el?.paddingLeft ?? `0px`
            } - ${this.$parent?.$el?.paddingRight ?? `0px`})`;
          }
          return size;
        })(),
        maxWidth: (() => {
          let size = wMax;
          // this.axis === Axis.stack && width === -1
          //   ? this.maxChildWidth
          //   : wMax;
          if ((this.$parent as any)?.sty?.axis === Axis.stack) {
            size = `calc(${size} - ${
              this.$parent?.$el?.paddingLeft ?? `0px`
            } - ${this.$parent?.$el?.paddingRight ?? `0px`})`;
          }
          return size;
        })(),
        height: (() => {
          let size = exactHeight;
          // this.axis === Axis.stack && height === -1
          //   ? this.maxChildHeight
          //   : exactHeight;
          if ((this.$parent as any)?.sty?.axis === Axis.stack) {
            size = `calc(${size} - ${
              this.$parent?.$el?.paddingTop ?? `0px`
            } - ${this.$parent?.$el?.paddingBottom ?? `0px`})`;
          }
          return size;
        })(),
        minHeight: (() => {
          let size = hMin;
          // this.axis === Axis.stack && height === -1
          //   ? this.maxChildHeight
          //   : hMin;
          if ((this.$parent as any)?.sty?.axis === Axis.stack) {
            size = `calc(${size} - ${
              this.$parent?.$el?.paddingTop ?? `0px`
            } - ${this.$parent?.$el?.paddingBottom ?? `0px`})`;
          }
          return size;
        })(),
        maxHeight: (() => {
          let size = hMax;
          // this.axis === Axis.stack && height === -1
          //   ? this.maxChildHeight
          //   : hMax;
          if ((this.$parent as any)?.sty?.axis === Axis.stack) {
            size = `calc(${size} - ${
              this.$parent?.$el?.paddingTop ?? `0px`
            } - ${this.$parent?.$el?.paddingBottom ?? `0px`})`;
          }
          return size;
        })(),
        flexBasis:
          this.parentAxis === Axis.column
            ? isFlexSize(height)
              ? `${height.flex * 100}%`
              : heightGrows
              ? `100%`
              : undefined
            : this.parentAxis === Axis.row
            ? isFlexSize(width)
              ? `${width.flex * 100}%`
              : widthGrows
              ? `100%`
              : undefined
            : undefined,
        // flexBasis:
        //   this.parentAxis === Axis.column
        //     ? isFlexSize(height)
        //       ? `calc(${height.flex * 100}% - (4 * ${cssPadding ?? `0px`}))`
        //       : heightGrows
        //         ? `calc(100% - (4 * ${cssPadding ?? `0px`}))`
        //         : undefined
        //     : this.parentAxis === Axis.row
        //       ? isFlexSize(width)
        //         ? `calc(${width.flex * 100}% - (4 * ${cssPadding ?? `0px`}))`
        //         : widthGrows
        //           ? `calc(100% - (4 * ${cssPadding ?? `0px`}))`
        //           : undefined
        //       : undefined,

        // Box Style
        background: this.sty.background,
        borderRadius: isDefined(this.sty.cornerRadius)
          ? Array.isArray(this.sty.cornerRadius)
            ? this.sty.cornerRadius.map(sizeToCss).join(` `)
            : sizeToCss(this.sty.cornerRadius)
          : undefined,
        //border: `none`,
        outline: isDefined(this.sty.outlineSize)
          ? `${sizeToCss(this.sty.outlineSize)} solid ${this.sty.outlineColor}`
          : undefined,
        outlineOffset: isDefined(this.sty.outlineSize)
          ? `-${sizeToCss(this.sty.outlineSize)}`
          : undefined,
        backgroundColor: this.sty.background,
        // Add background images
        boxShadow: isDefined(this.sty.shadowSize)
          ? `${sizeToCss(
              0.09 * this.sty.shadowSize * shadowDirection.x,
            )} ${sizeToCss(
              -0.09 * this.sty.shadowSize * shadowDirection.y,
            )} ${sizeToCss(
              0.4 * this.sty.shadowSize,
            )} 0 ${mdColors.grey.substring(0, 7)}cc`
          : undefined,

        // Padding
        // TODO: Default could maybe be based off of font size.
        padding: cssPadding,

        // Align: https://css-tricks.com/snippets/css/a-guide-to-flexbox/
        position:
          (this.$parent as any)?.sty?.axis === Axis.stack
            ? `absolute`
            : `relative`,
        //margin: 0,
        justifyContent:
          // Exact spacing is handled through grid gap
          Object.values(Spacing as any).includes(this.sty.spacing)
            ? // For whatever reason, space-between with one item puts it at the start instead of centering it.
              this.sty.spacing === Spacing.spaceBetween && this.childCount === 1
              ? Spacing.spaceAround
              : (this.sty.spacing as (typeof Spacing)[keyof typeof Spacing])
            : this.axis === Axis.column
            ? isTop(align)
              ? `flex-start`
              : isCenterY(align)
              ? `safe center`
              : `flex-end`
            : isLeft(align)
            ? `flex-start`
            : isCenterX(align)
            ? `safe center`
            : `flex-end`,
        alignItems:
          this.axis === Axis.column
            ? isLeft(align)
              ? `flex-start`
              : isCenterX(align)
              ? `safe center`
              : `flex-end`
            : isTop(align)
            ? `flex-start`
            : isCenterY(align)
            ? `safe center`
            : `flex-end`,

        // Axis
        flexDirection: this.axis === Axis.stack ? undefined : this.axis,

        // Overflow
        flexWrap:
          this.axis === Axis.row
            ? this.sty.overflowX === Overflow.wrap
              ? `wrap`
              : undefined
            : this.sty.overflowY === Overflow.wrap
            ? `wrap`
            : undefined,
        overflowX:
          this.sty.overflowX === Overflow.scroll
            ? `auto` // Used to be `overlay` // Scroll when nesscary, and float above contents
            : this.sty.overflowX === Overflow.crop
            ? `hidden`
            : `visible`, //`hidden`,
        overflowY:
          this.sty.overflowY === Overflow.scroll
            ? `auto` // Scroll when nesscary, and float above contents
            : this.sty.overflowY === Overflow.crop
            ? `hidden`
            : `visible`, //`hidden`,
        scrollbarWidth: [this.sty.overflowX, this.sty.overflowY].includes(
          Overflow.scroll,
        )
          ? `thin`
          : undefined,
        scrollbarColor: [this.sty.overflowX, this.sty.overflowY].includes(
          Overflow.scroll,
        )
          ? `#e3e3e3 transparent`
          : undefined,

        // Spacing
        // TODO: Default could maybe be based off of font size.
        rowGap: isDefined(this.sty.spacing)
          ? sizeToCss(this.sty.spacing)
          : undefined,
        columnGap: isDefined(this.sty.spacing)
          ? sizeToCss(this.sty.spacing)
          : undefined,

        // Text Style
        fontFamily: `Roboto`, //this.sty.fontFamily ?? `Roboto` ?? `inherit`,
        fontSize: isNum(this.sty.scale)
          ? numToFontSize(this.sty.scale)
          : this.sty.scale,
        fontWeight: isDefined(this.sty.textIsBold)
          ? this.sty.textIsBold
            ? `bold`
            : `normal`
          : undefined,
        fontStyle: isDefined(this.sty.textIsItalic)
          ? this.sty.textIsItalic
            ? `italic`
            : `normal`
          : undefined,
        textDecoration: isDefined(this.sty.textIsUnderlined)
          ? this.sty.textIsUnderlined
            ? `underline`
            : `none`
          : undefined,
        textAlign: isLeft(align)
          ? `left`
          : isCenterX(align)
          ? `center`
          : `right`,
        lineHeight:
          this.sty.scale === undefined ? undefined : sizeToCss(this.sty.scale),
        color: this.sty.textColor,
        pointerEvents: this.sty.isInteractable ?? true ? undefined : `none`,
        zIndex: this.sty.zIndex,
      };
    },
  },
  methods: {
    updateFromHtml(divRef: Element | undefined) {
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
          const childStyle = child.style;
          return (
            childStyle.width === "100%" ||
            (this.axis === Axis.row &&
              (childStyle.flexBasis !== "auto" || childStyle.flexGrow !== "0"))
          );
        });
        this.childHeightGrows = children.some((child) => {
          if (!child.classList.contains(`b-x`)) return false;
          const childStyle = getComputedStyle(child);
          return (
            childStyle.height === "100%" ||
            (this.axis === Axis.column &&
              (childStyle.flexBasis !== "auto" || childStyle.flexGrow !== "0"))
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
