import { CssProps, exists } from "./BoxUtils";
import { Align } from "./BoxLayout";
import { sizeToCss } from "./BoxSize";

export type DecorationSty = {
  cornerRadius: number | string | [number, number, number, number];
  outlineColor: string;
  outlineSize: number;
  background: string;
  shadowSize: number;
  shadowDirection: Align;
  zIndex: number;
};

export const mdColors = {
  white: `#ffffffff`,
  almostWhite: `#f9fafdff`,
  pink: `#e91e63ff`,
  red: `#f44336ff`,
  orange: `#ff9800ff`,
  yellow: `#ffea00ff`,
  dataplateyellow: "#f2b212", // Added by Jorge to Dataplate project.
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

export function computeBoxDecoration(sty: Partial<DecorationSty>): CssProps {
  const shadowDirection = (() => {
    switch (sty.shadowDirection ?? Align.bottomRight) {
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
  return {
    // Box Style
    // background: sty.background,
    borderRadius: exists(sty.cornerRadius)
      ? Array.isArray(sty.cornerRadius)
        ? sty.cornerRadius.map(sizeToCss).join(` `)
        : sizeToCss(sty.cornerRadius)
      : undefined,
    //border: `none`,
    outline: exists(sty.outlineSize)
      ? `${sizeToCss(sty.outlineSize)} solid ${sty.outlineColor}`
      : undefined,
    outlineOffset: exists(sty.outlineSize)
      ? `-${sizeToCss(sty.outlineSize)}`
      : undefined,
    backgroundColor: sty.background?.startsWith(`data:image`)
      ? undefined
      : sty.background,
    backgroundImage: sty.background?.startsWith(`data:image`)
      ? `url('${sty.background}')`
      : undefined,
    backgroundSize: `cover`,
    // Add background images
    boxShadow: exists(sty.shadowSize)
      ? `${sizeToCss(0.09 * sty.shadowSize * shadowDirection.x)} ${sizeToCss(
          -0.09 * sty.shadowSize * shadowDirection.y,
        )} ${sizeToCss(0.4 * sty.shadowSize)} 0 ${mdColors.grey.substring(
          0,
          7,
        )}cc`
      : undefined,
    zIndex: sty.zIndex,
  };
}
