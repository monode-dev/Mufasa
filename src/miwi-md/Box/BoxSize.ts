import { isNum, exists, isString, CssProps } from "./BoxUtils";
import { Axis } from "./BoxLayout";

export type SizeSty = {
  width: number | string | FlexSize;
  height: number | string | FlexSize;
};

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

export interface FlexSize {
  flex: number;
  min: number;
  max: number;
}
export function isFlexSize(size: any): size is FlexSize {
  return exists(size?.flex);
}
export function computeSizeInfo({
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
      : //: `fit-content`;
        `auto`;
  const minSize = sizeIsFlex
    ? isShrink
      ? `0` // We used `0` because a min of `fit-content` can overflow the parent which is not what we want
      : size.min === Infinity
      ? exactSize
      : sizeToCss(size.min)
    : exactSize;
  const maxSize = sizeIsFlex
    ? isShrink
      ? //? `fit-content`
        `auto`
      : size.max === Infinity
      ? undefined // ?? `100%` // I turned (maxSize: 100%) off because a 100% caps the element at the height of its parent which doesn't work if the parent scrolls its content
      : sizeToCss(size.max)
    : exactSize;
  return [exactSize, minSize, maxSize, sizeIsFlex] as const;
}

export function computeBoxSize(
  sty: Partial<SizeSty>,
  childWidthGrows: boolean,
  childHeightGrows: boolean,
  parentAxis: Axis,
  parent: any,
): CssProps {
  let width =
    (sty.width ?? -1) === -1 ? (childWidthGrows ? `1f` : -1) : sty.width ?? -1;
  if (isString(width) && width.endsWith(`f`)) {
    width = {
      flex: parseFloat(width.split(`f`)[0]),
      min: -1,
      max: Infinity,
    }; // satisfies FlexSize;
  }
  const [exactWidth, wMin, wMax, widthGrows] = computeSizeInfo({
    size: width,
    isMainAxis: parentAxis === Axis.row,
  });
  let height =
    (sty.height ?? -1) === -1
      ? childHeightGrows
        ? `1f`
        : -1
      : sty.height ?? -1;
  if (isString(height) && height.endsWith(`f`)) {
    height = {
      flex: parseFloat(height.split(`f`)[0]),
      min: -1,
      max: Infinity,
    }; // satisfies FlexSize;
  }
  const [exactHeight, hMin, hMax, heightGrows] = computeSizeInfo({
    size: height,
    isMainAxis: parentAxis === Axis.column,
  });
  return {
    // Sizing
    display: `flex`,
    boxSizing: `border-box`,
    // Using minWidth and maxWidth tells css to not override the size of this element
    width: (() => {
      let size = exactWidth;
      // axis === Axis.stack && width === -1
      //   ? maxChildWidth
      //   : exactWidth;
      if ((parent as any)?.sty?.axis === Axis.stack) {
        size = `calc(${size} - ${parent?.$el?.paddingLeft ?? `0px`} - ${
          parent?.$el?.paddingRight ?? `0px`
        })`;
      }
      return size;
    })(),
    minWidth: (() => {
      let size = wMin;
      // axis === Axis.stack && width === -1
      //   ? maxChildWidth
      //   : wMin;
      if ((parent as any)?.sty?.axis === Axis.stack) {
        size = `calc(${size} - ${parent?.$el?.paddingLeft ?? `0px`} - ${
          parent?.$el?.paddingRight ?? `0px`
        })`;
      }
      return size;
    })(),
    maxWidth: (() => {
      let size = wMax;
      // axis === Axis.stack && width === -1
      //   ? maxChildWidth
      //   : wMax;
      if ((parent as any)?.sty?.axis === Axis.stack) {
        size = `calc(${size} - ${parent?.$el?.paddingLeft ?? `0px`} - ${
          parent?.$el?.paddingRight ?? `0px`
        })`;
      }
      return size;
    })(),
    height: (() => {
      let size = exactHeight;
      // axis === Axis.stack && height === -1
      //   ? maxChildHeight
      //   : exactHeight;
      if ((parent as any)?.sty?.axis === Axis.stack) {
        size = `calc(${size} - ${parent?.$el?.paddingTop ?? `0px`} - ${
          parent?.$el?.paddingBottom ?? `0px`
        })`;
      }
      return size;
    })(),
    minHeight: (() => {
      let size = hMin;
      // axis === Axis.stack && height === -1
      //   ? maxChildHeight
      //   : hMin;
      if ((parent as any)?.sty?.axis === Axis.stack) {
        size = `calc(${size} - ${parent?.$el?.paddingTop ?? `0px`} - ${
          parent?.$el?.paddingBottom ?? `0px`
        })`;
      }
      return size;
    })(),
    maxHeight: (() => {
      let size = hMax;
      // axis === Axis.stack && height === -1
      //   ? maxChildHeight
      //   : hMax;
      if ((parent as any)?.sty?.axis === Axis.stack) {
        size = `calc(${size} - ${parent?.$el?.paddingTop ?? `0px`} - ${
          parent?.$el?.paddingBottom ?? `0px`
        })`;
      }
      return size;
    })(),
    flexBasis:
      parentAxis === Axis.column
        ? isFlexSize(height)
          ? `${height.flex * 100}%`
          : heightGrows
          ? `100%`
          : undefined
        : parentAxis === Axis.row
        ? isFlexSize(width)
          ? `${width.flex * 100}%`
          : widthGrows
          ? `100%`
          : undefined
        : undefined,
    // flexBasis:
    //   parentAxis === Axis.column
    //     ? isFlexSize(height)
    //       ? `calc(${height.flex * 100}% - (4 * ${cssPadding ?? `0px`}))`
    //       : heightGrows
    //         ? `calc(100% - (4 * ${cssPadding ?? `0px`}))`
    //         : undefined
    //     : parentAxis === Axis.row
    //       ? isFlexSize(width)
    //         ? `calc(${width.flex * 100}% - (4 * ${cssPadding ?? `0px`}))`
    //         : widthGrows
    //           ? `calc(100% - (4 * ${cssPadding ?? `0px`}))`
    //           : undefined
    //       : undefined,
  };
}
