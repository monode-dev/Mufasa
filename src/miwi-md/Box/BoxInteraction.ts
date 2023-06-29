import { CssProps } from "./BoxUtils";

export type InteractionSty = {
  isInteractable: boolean;
};

export function computeBoxInteraction(sty: Partial<InteractionSty>): CssProps {
  return {
    pointerEvents: sty.isInteractable ?? true ? undefined : `none`,
  };
}
