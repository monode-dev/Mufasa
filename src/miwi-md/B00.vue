<script>
import { defineComponent, getCurrentInstance } from 'vue';

/*** @see sty: {
  width: number | css-string | `2f`;
  height: number | css-string | `2f`;
  cornerRadius: number | css-string;
  outlineColor: css-string;
  outlineSize: number;
  background: css-string;
  shadowSize: number;
  shadowDirection: Align;
  padding: css-string | number;
  align: Align;
  axis: Axis;
  overflowX: Overflow;
  overflowY: Overflow;
  spacing: Spacing | number;
  fontFamily: css-string;
  textSize: number | css-string;
  textColor: css-string;
  textIsBold: boolean;
  textIsItalic: boolean;
  textIsUnderlined: boolean;
  isInteractable: boolean;
  zIndex: number;
} **/

export function isDefined(x) {
  return x !== undefined && x !== null;
}
export function isNum(x) {
  return isDefined(x) && typeof x === `number`;
}
export function isString(x) {
  return isDefined(x) && typeof x === `string`;
}

export const Axis = {
  row: `row`,
  column: `column`,
  stack: `stack`,
};
export const Overflow = {
  crop: `crop`,
  wrap: `wrap`,
  scroll: `scroll`,
};
export const Spacing = {
  spaceBetween: `space-between`,
  spaceAround: `space-around`,
  spaceEvenly: `space-evenly`,
};
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
};
function isLeft(align) {
  const validAligns = [Align.topLeft, Align.centerLeft, Align.bottomLeft];
  return validAligns.includes(align);
}
function isCenterX(align) {
  const validAligns = [Align.topCenter, Align.center, Align.bottomCenter];
  return validAligns.includes(align);
}
// function isRight(align) {
//   const validAligns = [Align.topRight, Align.centerRight, Align.bottomRight];
//   return validAligns.includes(align);
// }
function isTop(align) {
  const validAligns = [Align.topLeft, Align.topCenter, Align.topRight];
  return validAligns.includes(align);
}
function isCenterY(align) {
  const validAligns = [Align.centerLeft, Align.center, Align.centerRight];
  return validAligns.includes(align);
}
// function isBottom(align) {
//   const validAligns = [Align.bottomLeft, Align.bottomCenter, Align.bottomRight];
//   return validAligns.includes(align);
// }
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
};
const fontSizeToHtmlUnit = 0.825;
export function sizeToCss(num) {
  return isNum(num)
    ? `${num * (1.125 / fontSizeToHtmlUnit)}rem`
    : num;
}
function numToFontSize(num) {
  return sizeToCss(fontSizeToHtmlUnit * num);
}
function isFlexSize(size) {
  return isDefined(size?.flex);
}
function computeSizeInfo({ size, isMainAxis, }) {
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
  return [exactSize, minSize, maxSize, sizeIsFlex];
}

/*** @see sty: {
  width: number | css-string | `2f` | -1;
  height: number | css-string | `2f` | -1;
  cornerRadius: number | css-string;
  outlineColor: css-string;
  outlineSize: number;
  background: css-string;
  shadowSize: number;
  shadowDirection: Align;
  padding: css-string | number;
  align: Align;
  axis: Axis;
  overflowX: Overflow;
  overflowY: Overflow;
  spacing: Spacing | number;
  fontFamily: css-string;
  textSize: number | css-string;
  textColor: css-string;
  textIsBold: boolean;
  textIsItalic: boolean;
  textIsUnderlined: boolean;
  isInteractable: boolean;
  zIndex: number;
} **/
export default defineComponent({
  name: "Box",
  props: {
    sty: {
      type: Object,
      default: () => ({}),
      required: false,
    },
  },
  data() {
    return {
      parentAxis: Axis.column,
      isBBox: () => (true),
    }
  },
  computed: {
    axis() {
      return this.sty.axis ?? Axis.column;
    },
    maxChildWidth() {
      if (this.axis === Axis.stack) {
        return this.children.reduce((tot, curr) => {
          return Math.max(tot, curr.el?.offsetWidth ?? 0)
        }, 0);
      } else {
        return 0;
      }
    },
    maxChildHeight() {
      if (this.axis === Axis.stack) {
        return this.children.reduce((tot, curr) => {
          return Math.max(tot, curr.el?.offsetHeight ?? 0)
        }, 0);
      } else {
        return 0;
      }
    },
    style() {
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
        isMainAxis: this.parentAxis === Axis.row,
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
        isMainAxis: this.parentAxis === Axis.column,
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
        width: this.axis === Axis.stack && width === -1 ? this.maxChildWidth : exactWidth,
        minWidth: this.axis === Axis.stack && width === -1 ? this.maxChildWidth : wMin,
        maxWidth: this.axis === Axis.stack && width === -1 ? this.maxChildWidth : wMax,
        height: this.axis === Axis.stack && height === -1 ? this.maxChildWidth : exactHeight,
        minHeight: this.axis === Axis.stack && height === -1 ? this.maxChildWidth : hMin,
        maxHeight: this.axis === Axis.stack && height === -1 ? this.maxChildWidth : hMax,
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
        // TODO: Default could maybe be based off of font size.
        padding: isNum(this.sty.padding)
          ? sizeToCss(this.sty.padding)
          : this.sty.padding,

        // Align: https://css-tricks.com/snippets/css/a-guide-to-flexbox/
        position: (this.$parent)?.sty?.axis === Axis.stack ? `absolute` : `relative`,
        //margin: 0,
        justifyContent:
          // Exact spacing is handled through grid gap
          Object.values(Spacing).includes(this.sty.spacing)
            // For whatever reason, space-between with one item puts it at the start instead of centering it.
            ? this.sty.spacing === Spacing.spaceBetween && this.children.length == 1
              ? Spacing.spaceAround
              : this.sty.spacing
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
        flexWrap: this.axis === Axis.row
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
            : `visible`, //`hidden`,
        overflowY: this.sty.overflowY === Overflow.scroll
          ? `auto` // Scroll when nesscary, and float above contents
          : this.sty.overflowY === Overflow.crop
            ? `hidden`
            : `visible`, //`hidden`,
        scrollbarWidth: [this.sty.overflowX, this.sty.overflowY].includes(Overflow.scroll)
          ? `thin`
          : undefined,
        scrollbarColor: [this.sty.overflowX, this.sty.overflowY].includes(Overflow.scroll)
          ? `#e3e3e3 transparent`
          : undefined,

        // Spacing
        // TODO: Default could maybe be based off of font size.
        rowGap: this.axis === Axis.column && isDefined(this.sty.spacing)
          ? sizeToCss(this.sty.spacing)
          : undefined,
        columnGap: this.axis === Axis.row && isDefined(this.sty.spacing)
          ? sizeToCss(this.sty.spacing)
          : undefined,

        // Text Style
        fontFamily: this.sty.fontFamily ?? `inherit`,
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
        pointerEvents: this.sty.isInteractable === false ? `none` : undefined,
        zIndex: this.sty.zIndex,
      };
    },
    children() {
      return this.$slots?.default?.() ?? [];
    },
  },
  methods: {
    updateStats() {
      const instance = getCurrentInstance();
      /* This is janky, but it circumvents the issue of the parent being a custom Vue
       * component insead of a `B` component, which are the only components with
       * "substance". */
      const parent = (() => {
        let lastCheckedParentUid = -1;
        function findParent(node) {
          if (node === null || node === undefined) return undefined;
          if (node?.parent?.data?.isBBox ?? false) {
            return node.parent;
          }
          if (lastCheckedParentUid === node.uid) {
            return undefined;
          } else {
            lastCheckedParentUid = node.uid;
          return findParent(instance?.parent ?? undefined);
          }
        }
        return findParent(instance);
      })();
      this.parentAxis = (parent?.props?.sty)?.axis ?? Axis.column;
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
    <slot/>
  </div>
</template>