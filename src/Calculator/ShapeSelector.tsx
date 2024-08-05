import {
  Label,
  Row,
  // Selector,
  Prop,
  Txt,
  exists,
  useProp,
  Selector,
  Icon,
  pushPage,
} from "miwi";
import { TANK_SHAPE_IDS, TankShapeId, getTankShape } from "./ShapeUtils";
import { For } from "solid-js";
import { mdiHelpCircleOutline } from "@mdi/js";
import { InfoCard } from "@/components/InfoCard";

export default function ShapeSelector(
  props: Readonly<{
    value: Prop<TankShapeId | null>;
    label: string | undefined;
  }>,
) {
  // const value = useProp(props.value);
  const dropDownIsOpen = useProp(false);

  function selectTankShape(shape: TankShapeId) {
    console.log("selectTankShape", shape);
    dropDownIsOpen.value = false;
    props.value.value = shape;
  }

  return (
    <Row padBetween={0.75}>
      <Label label={props.label}>
        <Selector
          value={props.value.value}
          modalIsOpenSig={dropDownIsOpen}
          noneLabel="Select Shape"
          getLabelForData={(shapeId: TankShapeId | null) => {
            if (exists(shapeId)) {
              const tankShape = getTankShape(shapeId);
              return tankShape.nameLong;
            }
            return null;
          }}
        >
          <For each={TANK_SHAPE_IDS} fallback={<Txt>Loading...</Txt>}>
            {(shapeId) => (
              <Txt
                onClick={() => {
                  selectTankShape(shapeId);
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
          <Icon 
            iconPath={mdiHelpCircleOutline} 
            onClick={()=> {
              pushPage(InfoCard, {entriesToOpen: ["Tank","Shape", getTankShape(props.value.value)?.nameLong ?? ""]});
            }}
          >
        </Icon>
      </Label>
      {/* <Show when={exists(props.value.value)}>
        <Icon
          iconPath={mdiHelp}
          stroke={mdColors.grey}
          scale={0.875}
          onClick={() => {
            pushPage(ShapeHelpDialog, {
              shape: props.value,
            });
          }}
        />
      </Show> */}
    </Row>
  );
}
