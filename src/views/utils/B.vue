<script lang="ts">
import { CSSProperties, defineComponent, getCurrentInstance, PropType } from 'vue';
import { isDefined, isNum, isString } from '../../utils';

export interface Sty {
  width: number | string | FlexSize;
  height: number | string | FlexSize;
  cornerRadius: number | string;
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
  textSize: number | string;
  textColor: string;
  textIsBold: boolean;
  textIsItalic: boolean;
  textIsUnderlined: boolean
}
export type Axis = typeof Axis[keyof typeof Axis];
export const Axis = {
  row: `row`,
  column: `column`,
} as const;
export type Overflow = typeof Overflow[keyof typeof Overflow];
export const Overflow = {
  crop: `crop`,
  wrap: `wrap`,
  scroll: `scroll`,
} as const;
export type Spacing = number | typeof Spacing[keyof typeof Spacing];
export const Spacing = {
  spaceBetween: `space-between`,
  spaceAround: `space-around`,
  spaceEvenly: `space-evenly`,
} as const;
export type Align = typeof Align[keyof typeof Align];
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
  const validAligns: Align[] = [Align.topLeft, Align.centerLeft, Align.bottomLeft];
  return validAligns.includes(align);
}
function isCenterX(align: Align) {
  const validAligns: Align[] = [Align.topCenter, Align.center, Align.bottomCenter];
  return validAligns.includes(align);
}
function isRight(align: Align) {
  const validAligns: Align[] = [Align.topRight, Align.centerRight, Align.bottomRight];
  return validAligns.includes(align);
}
function isTop(align: Align) {
  const validAligns: Align[] = [Align.topLeft, Align.topCenter, Align.topRight];
  return validAligns.includes(align);
}
function isCenterY(align: Align) {
  const validAligns: Align[] = [Align.centerLeft, Align.center, Align.centerRight];
  return validAligns.includes(align);
}
function isBottom(align: Align) {
  const validAligns: Align[] = [Align.bottomLeft, Align.bottomCenter, Align.bottomRight];
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
const fontSizeToHtmlUnit = 0.825;
function sizeToCss(num: number | string) {
  return isNum(num)
    ? `${num * (1.125 / fontSizeToHtmlUnit)}rem`
    : num;
}
function numToFontSize(num: number) {
  return sizeToCss(fontSizeToHtmlUnit * num);
}
export interface FlexSize {
  flex: number;
  min: number;
  max: number;
}
function isFlexSize(size: any): size is FlexSize {
  return isDefined(size?.flex);
}
function computeSizeInfo(
  { size, isMainAxis }:
  { size: number | string | FlexSize; isMainAxis: boolean }
) {
  const sizeIsFlex = isFlexSize(size);
  const exactSize =
    !isMainAxis && sizeIsFlex
      ? `100%`
      : isString(size)
        ? size
        : size !== -1 && !sizeIsFlex
          ? sizeToCss(size)
          : sizeIsFlex
            ? undefined
            : `fit-content`;
  const minSize = sizeIsFlex
    ? size.min === -1
      ? `fit-content`
      : size.min === Infinity
        ? exactSize
        : sizeToCss(size.min)
    : exactSize;
  const maxSize = sizeIsFlex
    ? size.max === -1
      ? `fit-content`
      : size.max === Infinity
        ? exactSize ?? `100%`
        : sizeToCss(size.max)
    : exactSize;
  return [exactSize, minSize, maxSize, sizeIsFlex] as const;
}

export default defineComponent({
  name: "B",
  props: {
    sty: {
      type: Object as PropType<Partial<Sty>>,
      default: {},
      required: false,
    },
  },
  data() {
    return {
      childCount: 0,
      parentAxis: Axis.column as Axis,
    }
  },
  computed: {
    style(): CSSProperties {
      const axis = this.sty.axis ?? Axis.column;
      const align = this.sty.align ?? Align.center;
      let width = this.sty.width ?? -1;
      if (isString(width) && width.endsWith(`f`)) {
        width = {
          flex: parseFloat(width.split(`f`)[0]),
          min: -1,
          max: Infinity,
        };// satisfies FlexSize;
      }
      const [exactWidth, wMin, wMax, widthGrows] = computeSizeInfo({
        size: width,
        isMainAxis: false,
      });
      let height = this.sty.height ?? -1;
      if (isString(height) && height.endsWith(`f`)) {
        height = {
          flex: parseFloat(height.split(`f`)[0]),
          min: -1,
          max: Infinity,
        };// satisfies FlexSize;
      }
      const [exactHeight, hMin, hMax, heightGrows] = computeSizeInfo({
        size: height,
        isMainAxis: true,
      });
      const shadowDirection = (() => {
        switch(this.sty.shadowDirection ?? Align.bottomRight) {
          case Align.topLeft: return { x: -1, y: 1 };
          case Align.topCenter: return { x: 0, y: 1 };
          case Align.topRight: return { x: 1, y: 1 };
          case Align.centerLeft: return { x: -1, y: 0 };
          case Align.center: return { x: 0, y: 0 };
          case Align.centerRight: return { x: 1, y: 0 };
          case Align.bottomLeft: return { x: -1, y: -1 };
          case Align.bottomCenter: return { x: 0, y: -1 };
          case Align.bottomRight: return { x: 1, y: -1 };
        }
      })();
      return {
        // Sizing
        display: `flex`,
        boxSizing: `border-box`,
        // Using minWidth and maxWidth tells css to not override the size of this element
        width: exactWidth,
        minWidth: wMin,
        maxWidth: wMax,
        height: exactHeight,
        minHeight: hMin,
        maxHeight: hMax,
        flexBasis:
          this.parentAxis === Axis.column
            ? isFlexSize(height)
              ? `${height.flex * 100}%`
              : heightGrows
                ? `100%`
                : undefined
            : isFlexSize(width)
              ? `${width.flex * 100}%`
              : widthGrows
                ? `100%`
                : undefined,
        background: this.sty.background,

        // Box Style
        borderRadius: isDefined(this.sty.cornerRadius)
          ? sizeToCss(this.sty.cornerRadius)
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
        ? `${
            sizeToCss(0.12 * this.sty.shadowSize * shadowDirection.x)
          } ${
            sizeToCss(-0.12 * this.sty.shadowSize * shadowDirection.y)
          } ${
            sizeToCss(0.225 * this.sty.shadowSize)
          } 0 ${mdColors.grey.substring(0, 7)}cc`
        : undefined,

        // Padding
        padding: isNum(this.sty.padding)
          ? sizeToCss(this.sty.padding)
          : this.sty.padding,

        // Align: https://css-tricks.com/snippets/css/a-guide-to-flexbox/
        position: `relative`,
        //margin: 0,
        justifyContent:
          // Exact spacing is handled through grid gap
          Object.values(Spacing as any).includes(this.sty.spacing)
            // For whatever reason, space-between with one item puts it at the start instead of centering it.
            ? this.sty.spacing === Spacing.spaceBetween && this.childCount == 1
              ? Spacing.spaceAround
              : this.sty.spacing as typeof Spacing[keyof typeof Spacing]
            : axis === Axis.column
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
          axis === Axis.column
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
        flexDirection: axis,

        // Overflow
        flexWrap: axis === Axis.row
          ? this.sty.overflowX === Overflow.wrap
            ? `wrap`
            : undefined
          : this.sty.overflowY === Overflow.wrap
            ? `wrap`
            : undefined,
        overflowX: this.sty.overflowX === Overflow.scroll
          ? `auto` // Used to be `overlay` // Scroll when nesscary, and float above contents
          : this.sty.overflowX === Overflow.crop
            ? `hidden`
            : undefined, //`hidden`,
        overflowY: this.sty.overflowY === Overflow.scroll
          ? `auto` // Scroll when nesscary, and float above contents
          : this.sty.overflowY === Overflow.crop
            ? `hidden`
            : undefined, //`hidden`,
        scrollbarWidth: [this.sty.overflowX, this.sty.overflowY].includes(Overflow.scroll)
          ? `thin`
          : undefined,
        scrollbarColor: [this.sty.overflowX, this.sty.overflowY].includes(Overflow.scroll)
          ? `#e3e3e3 transparent`
          : undefined,

        // Spacing
        rowGap: axis === Axis.column && isDefined(this.sty.spacing)
          ? sizeToCss(this.sty.spacing)
          : undefined,
        columnGap: axis === Axis.row && isDefined(this.sty.spacing)
          ? sizeToCss(this.sty.spacing)
          : undefined,

        // Text Style
        fontFamily: `Roboto`,
        fontSize: isNum(this.sty.textSize)
          ? numToFontSize(this.sty.textSize)
          : this.sty.textSize,
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
        textAlign:
          isLeft(align)
            ? `left`
            : isCenterX(align)
              ? `center`
              : `right`,
        color: this.sty.textColor,
      };
    },
  },
  methods: {
    updateStats() {
      const instance = getCurrentInstance();
      this.childCount = this.$slots?.default?.()?.length ?? 0;
      this.parentAxis = (instance?.parent?.props?.sty as Partial<Sty>)?.axis ?? Axis.column;
    }
  },
  updated() {
    this.updateStats()
  },
  mounted() {
    this.updateStats()
  }
})
</script>

<template>
  <div :style="style">
    <slot></slot>
  </div>
</template>