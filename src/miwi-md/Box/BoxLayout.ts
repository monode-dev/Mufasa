import { CssProps, exists, isNum, isString } from "./BoxUtils";
import { sizeToCss } from "./BoxSize";

export type LayoutSty = PadStyProps & {
  // pad:
  //   | `css ${string}`
  //   | number
  //   | `${number}`
  //   | `${number} ${number}`
  //   | `${number} ${number} ${number} ${number}`;
  // AlignX: isColumn ? BasicAlignAxisX : (BasicAlignAxisX | AdditionalMainAxisAlign)
  // type BasicAlignAxisX: left | center | right;
  // AlignY: isColumn ? (BasicAlignAxisY | AdditionalMainAxisAlign) : BasicAlignAxisY
  // type BasicAlignAxisY: top | center | bottom;
  // type AdditionalMainAxisAlign: spaceBetween | spaceAround | spaceEvenly
  // Note: Align only makes sense if the size on this axis is not "shrink"
  align: Align;
  axis: Axis;
  overflowX: Overflow;
  overflowY: Overflow;
  spacing: Spacing;
};
/**& ({
  axis: `row`
  alignX: AlignX | AdditionalMainAxisAlign;
  alignY: AlignY;
} | {
  axis: `column`
  alignX: AlignX;
  alignY: AlignY | AdditionalMainAxisAlign;
})*/
type _PadUnit = number | string;
type PadStyProps = {
  // All
  pad: _PadUnit;
  // Around
  padAround: _PadUnit;
  padAroundX: _PadUnit;
  padAroundY: _PadUnit;
  padTop: _PadUnit;
  padRight: _PadUnit;
  padBottom: _PadUnit;
  padLeft: _PadUnit;
  // Between
  padBetween: _PadUnit;
  padBetweenRows: _PadUnit;
  padBetweenColumns: _PadUnit;
};
export type Axis = (typeof Axis)[keyof typeof Axis];
export const Axis = {
  row: `row`,
  column: `column`,
  stack: `stack`,
} as const;
// Align: { x: left | center | right, y: top | center | bottom } | { mainAxis: left | center | right | spaceBetween | spaceAround | spaceEvenly, crossAxis: top | center | bottom | spaceBetween | spaceAround | spaceEvenly }
export type AlignX = (typeof AlignX)[keyof typeof AlignX];
export const AlignX = {
  left: `left`,
  center: `center`,
  right: `right`,
} as const;
export type AlignY = (typeof AlignY)[keyof typeof AlignY];
export const AlignY = {
  top: `top`,
  center: `center`,
  bottom: `bottom`,
} as const;
export type AdditionalMainAxisAlign =
  | (typeof AdditionalMainAxisAlign)[keyof typeof AdditionalMainAxisAlign];
export const AdditionalMainAxisAlign = {
  spaceBetween: `space-between`,
  spaceAround: `space-around`,
  spaceEvenly: `space-evenly`,
} as const;
export type Overflow = (typeof Overflow)[keyof typeof Overflow];
export const Overflow = {
  /** TODO: A css overflow of `visible` doesn't behave like we want it to. We
   * want it to behave like a spreadsheet, showing the overflow but not affecting
   * layout. However, a css overflow of visible instead affect the layout of
   * siblings and parents. We need to find a way to fix this. It would probabl
   * involve spawing a sub div to wrap the children in. */
  // visible: `visible`, // Maybe just call this "overflow"
  forceStretchParent: `forceStretchParent`,
  crop: `crop`, // Ellipsis should be a sub option of crop on overflowX
  wrap: `wrap`,
  scroll: `scroll`,
} as const;
export const defaultOveflowX = Overflow.forceStretchParent;
export const defaultOveflowY = Overflow.forceStretchParent; // This is because otherwise text gets cut off.
export type Spacing = (typeof Spacing)[keyof typeof Spacing];
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
export function isLeft(align: Align) {
  const validAligns: Align[] = [
    Align.topLeft,
    Align.centerLeft,
    Align.bottomLeft,
  ];
  return validAligns.includes(align);
}
export function isCenterX(align: Align) {
  const validAligns: Align[] = [
    Align.topCenter,
    Align.center,
    Align.bottomCenter,
  ];
  return validAligns.includes(align);
}
export function isRight(align: Align) {
  const validAligns: Align[] = [
    Align.topRight,
    Align.centerRight,
    Align.bottomRight,
  ];
  return validAligns.includes(align);
}
export function isTop(align: Align) {
  const validAligns: Align[] = [Align.topLeft, Align.topCenter, Align.topRight];
  return validAligns.includes(align);
}
export function isCenterY(align: Align) {
  const validAligns: Align[] = [
    Align.centerLeft,
    Align.center,
    Align.centerRight,
  ];
  return validAligns.includes(align);
}
export function isBottom(align: Align) {
  const validAligns: Align[] = [
    Align.bottomLeft,
    Align.bottomCenter,
    Align.bottomRight,
  ];
  return validAligns.includes(align);
}

export function computeBoxLayout(
  sty: Partial<LayoutSty>,
  align: Align,
  parent: any,
  axis: Axis,
  childCount: number,
): CssProps {
  const overflowX = sty.overflowX ?? defaultOveflowX;
  const overflowY = sty.overflowY ?? defaultOveflowY;
  const padTop = sizeToCss(
    sty.padTop ?? sty.padAroundY ?? sty.padAround ?? sty.pad ?? 0,
  );
  const padRight = sizeToCss(
    sty.padRight ?? sty.padAroundX ?? sty.padAround ?? sty.pad ?? 0,
  );
  const padBottom = sizeToCss(
    sty.padBottom ?? sty.padAroundY ?? sty.padAround ?? sty.pad ?? 0,
  );
  const padLeft = sizeToCss(
    sty.padLeft ?? sty.padAroundX ?? sty.padAround ?? sty.pad ?? 0,
  );
  const padBetweenRows = sizeToCss(
    sty.padBetweenRows ?? sty.padBetween ?? sty.pad ?? 0,
  );
  const padBetweenColumns = sizeToCss(
    sty.padBetweenColumns ?? sty.padBetween ?? sty.pad ?? 0,
  );
  return {
    position: parent?.props?.sty?.axis === Axis.stack ? `absolute` : `relative`,

    // Pad
    // NOTE: Default could maybe be based off of font size.
    // NOTE: We might consider making padding and spacing cascade. I'm not sure if we want to, but it might reduce developer code.
    padding: `${padTop} ${padRight} ${padBottom} ${padLeft}`,
    rowGap: padBetweenRows,
    columnGap: padBetweenColumns,
    margin: 0,

    // Align: https://css-tricks.com/snippets/css/a-guide-to-flexbox/
    // I've decided that space-between with one child should center it, instead of putting it at the start like CSS does.
    justifyContent: Object.values(Spacing as any).includes(sty.spacing)
      ? sty.spacing === Spacing.spaceBetween && childCount === 1
        ? Spacing.spaceAround
        : (sty.spacing as (typeof Spacing)[keyof typeof Spacing])
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
    flexDirection: axis === Axis.stack ? undefined : axis,

    // Overflow
    flexWrap:
      axis === Axis.row
        ? overflowX === Overflow.wrap
          ? `wrap`
          : undefined
        : overflowY === Overflow.wrap
        ? `wrap`
        : undefined,
    overflowX:
      overflowX === Overflow.scroll
        ? `auto` // Scroll when nesscary, and float above contents so we can make it invisible
        : overflowX === Overflow.crop
        ? `hidden`
        : `visible`,
    overflowY:
      overflowY === Overflow.scroll
        ? `auto` // Scroll when nesscary, and float above contents so we can make it invisible
        : overflowY === Overflow.crop
        ? `hidden`
        : `visible`,
    // Scroll bar should be invisible
    scrollbarWidth: [overflowX, overflowY].includes(Overflow.scroll)
      ? `thin`
      : undefined,
    scrollbarColor: [overflowX, overflowY].includes(Overflow.scroll)
      ? `#e3e3e3 transparent`
      : undefined,
  };
}
