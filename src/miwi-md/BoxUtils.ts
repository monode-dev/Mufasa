// globals.ts
import { App, PropType } from "vue";

interface _Sty {
  width: number | string | FlexSize;
  height: number | string | FlexSize;
  cornerRadius: number | string | [number, number, number, number];
  outlineColor: string;
  outlineSize: number;
  background: string;
  shadowSize: number;
  shadowDirection: Align;
  padding:
    | `css ${string}`
    | number
    | `${number}`
    | `${number} ${number}`
    | `${number} ${number} ${number} ${number}`;
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
  shouldLog: boolean;
  debugName: string;
}
export interface FlexSize {
  flex: number;
  min: number;
  max: number;
}
export type Axis = (typeof Axis)[keyof typeof Axis];
export const Axis = {
  row: `row`,
  column: `column`,
  stack: `stack`,
} as const;
export type Overflow = (typeof Overflow)[keyof typeof Overflow];
export const Overflow = {
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

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $Axis: typeof Axis;
    $Overflow: typeof Overflow;
    $Spacing: typeof Spacing;
    $Align: typeof Align;
  }
}

declare global {
  type Sty = Partial<_Sty>;
  type StyProp = PropType<Sty>;
}

export function registerGlobalProperties(app: App): void {
  app.config.globalProperties.$Axis = Axis;
  app.config.globalProperties.$Overflow = Overflow;
  app.config.globalProperties.$Spacing = Spacing;
  app.config.globalProperties.$Align = Align;
}
