import { PropType, App } from "vue";
import { _Sty } from "./Box.vue";
import { mdColors } from "./BoxDecoration";
import { Axis, Overflow, Spacing, Align } from "./BoxLayout";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $Axis: typeof Axis;
    $Overflow: typeof Overflow;
    $Spacing: typeof Spacing;
    $Align: typeof Align;
    $mdColors: typeof mdColors;
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
  app.config.globalProperties.$mdColors = mdColors;
}
