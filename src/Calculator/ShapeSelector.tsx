import {
  Label,
  Prop,
  Txt,
  exists,
  useProp,
  Selector,
  theme,
  Icon,
  pushPage,
} from "miwi";
import { TANK_SHAPE_IDS, TankShapeId, getTankShape } from "./ShapeUtils";
import { For } from "solid-js";
import { InfoCard } from "@/settings/InfoCard";
import { mdiHelpCircleOutline } from "@mdi/js";
import { ShapeInfoDialog } from "./ShapeInfoDialog";

export default function ShapeSelector(
  props: Readonly<{
    value: Prop<TankShapeId | null>;
    label: string | undefined;
    hideActionButtons?: boolean;
  }>,
) {
  const dropDownIsOpen = useProp(false);
  return (
    <Label label={props.label}>
      <Selector
        value={props.value.value}
        isOpen={dropDownIsOpen}
        hintText="Select Shape"
        getLabelForData={(shapeId: TankShapeId | null) => {
          if (!exists(shapeId)) return null;
          const tankShape = getTankShape(shapeId);
          return tankShape.nameLong;
        }}
        noOptionsText={"No Shapes"}
        cancelOptions={{
          icon: undefined,
          stroke: theme.palette.hint,
        }}
        actionButtons={
          props.hideActionButtons ? undefined : (
            <Icon
              iconPath={mdiHelpCircleOutline}
              onClick={() => {
                if (!exists(props.value.value)) return;
                pushPage(ShapeInfoDialog, {
                  shapeId: props.value.value,
                });
              }}
            />
          )
        }
      >
        <For each={TANK_SHAPE_IDS} fallback={<Txt>Loading...</Txt>}>
          {(shapeId) => (
            <Txt
              onClick={() => {
                props.value.value = shapeId;
                dropDownIsOpen.value = false;
              }}
              widthGrows
              heightShrinks
              overflowX={$Overflow.wrap}
            >
              {getTankShape(shapeId).nameLong}
            </Txt>
          )}
        </For>
      </Selector>
    </Label>
  );
}
