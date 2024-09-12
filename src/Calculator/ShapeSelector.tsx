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
  Row,
  Box,
} from "miwi";
import { TANK_SHAPE_IDS, TankShapeId, getTankShape } from "./ShapeUtils";
import { For } from "solid-js";
import { mdiHelpCircleOutline } from "@mdi/js";
import { ShapeInfoDialog } from "./ShapeInfoDialog";

export default function ShapeSelector(
  props: Readonly<{
    value: Prop<TankShapeId | null>;
    label: string | undefined;
    hideActionButtons?: boolean;
  }>,
) {
  const shapeIconSize = 1.675;
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
          return (
            <Row padBetween={0.5}>
              <Box width={shapeIconSize} height={1}>
                <Box
                  width={shapeIconSize}
                  height={shapeIconSize}
                  fill={getTankShape(shapeId)!.iconImage}
                />
              </Box>
              <Txt widthGrows singleLine>
                {tankShape.nameLong}
              </Txt>
            </Row>
          );
        }}
        noOptionsText={"No Shapes"}
        cancelOptions={{
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
            <Row
              onClick={() => {
                props.value.value = shapeId;
                dropDownIsOpen.value = false;
              }}
              padBetween={0.5}
              // alignTopLeft - alignCenter looked better
            >
              <Box width={shapeIconSize} height={1}>
                <Box
                  width={shapeIconSize}
                  height={shapeIconSize}
                  fill={getTankShape(shapeId)!.iconImage}
                />
              </Box>
              <Txt widthGrows heightShrinks overflowX={$Overflow.wrap}>
                {getTankShape(shapeId).nameLong}
              </Txt>
            </Row>
          )}
        </For>
      </Selector>
    </Label>
  );
}
