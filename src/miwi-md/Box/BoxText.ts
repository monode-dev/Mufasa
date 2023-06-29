import { isNum, exists, CssProps } from "./BoxUtils";
import { Align, isCenterX, isLeft } from "./BoxLayout";
import { sizeToCss } from "./BoxSize";

export type TextSty = {
  scale: number | string;
  textColor: string;
  textIsBold: boolean;
  textIsItalic: boolean;
  textIsUnderlined: boolean;
};

export function numToFontSize(num: number) {
  // return sizeToCss(fontSizeToHtmlUnit * num);
  return sizeToCss(num);
}

export function computeTextStyle(
  sty: Partial<TextSty>,
  align: Align,
): CssProps {
  return {
    // Text Style
    fontFamily: `Roboto`, //sty.fontFamily ?? `Roboto` ?? `inherit`,
    fontSize: isNum(sty.scale) ? numToFontSize(sty.scale) : sty.scale,
    fontWeight: exists(sty.textIsBold)
      ? sty.textIsBold
        ? `bold`
        : `normal`
      : undefined,
    fontStyle: exists(sty.textIsItalic)
      ? sty.textIsItalic
        ? `italic`
        : `normal`
      : undefined,
    textDecoration: exists(sty.textIsUnderlined)
      ? sty.textIsUnderlined
        ? `underline`
        : `none`
      : undefined,
    textAlign: isLeft(align) ? `left` : isCenterX(align) ? `center` : `right`,
    lineHeight: sty.scale === undefined ? undefined : sizeToCss(sty.scale),
    color: sty.textColor,
  };
}
