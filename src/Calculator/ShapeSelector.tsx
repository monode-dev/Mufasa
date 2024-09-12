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
import { For, Show } from "solid-js";
import { mdiArrowUpRight, mdiHelpCircleOutline } from "@mdi/js";
import { ShapeInfoDialog } from "./ShapeInfoDialog";
import { autoSavingProp } from "@/utils";

export default function ShapeSelector(
  props: Readonly<{
    value: Prop<TankShapeId | null>;
    label: string | undefined;
    hideActionButtons?: boolean;
  }>,
) {
  const shapeIconSize = 1.675;
  const dropDownIsOpen = useProp(false);

  const haveOpenedShapeInfoDialog = autoSavingProp<boolean>(
    `haveOpenedShapeInfoDialog`,
    false,
  );
  return (
    <>
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
            stroke: theme.palette.hint,
          }}
          actionButtons={
            props.hideActionButtons ? undefined : (
              <Icon
                iconPath={mdiHelpCircleOutline}
                onClick={() => {
                  haveOpenedShapeInfoDialog.value = true;
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
      <Show
        when={
          !haveOpenedShapeInfoDialog.value && props.hideActionButtons !== true
        }
      >
        <Row stroke={$theme.colors.hint} padBetween={0.75}>
          <Txt widthGrows alignCenterRight>
            See what to measure
          </Txt>
          <Box
            scale={1.5}
            padBottom={0.5}
            padRight={0.71}
            height={0.5}
            width={0.5}
            overflowYSpills
          >
            <Icon iconPath={mdiArrowUpRight} />
          </Box>
        </Row>
      </Show>
    </>
  );
}
