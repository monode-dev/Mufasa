import { listTanks } from "@/AppData";
import { mdiPlus } from "@mdi/js";
import {
  Box,
  Icon,
  JUST_FUEL,
  Row,
  Selector,
  Prop,
  Txt,
  useFormula,
  mdColors,
  useProp,
  exists,
  theme,
} from "miwi";
import { For, Show } from "solid-js";
import { openCreateTankDialog } from "./CreateTankDialog";
import { Client } from "@/Clients/Client";
import { Tank } from "./Tank";

type TankType = Tank | typeof JUST_FUEL | null;

export default function TankSelector(
  props: Readonly<{
    value: Prop<TankType | null | undefined>;
    client: Client;
    showNewOption?: boolean;
    showJustFuelOption?: boolean;
    hintColorOverride?: string;
    hideTanksList?: boolean;
  }>,
) {
  const value: Prop<TankType | null> = useFormula(
    () => props.value.value ?? null,
    (newValue) => (props.value.value = newValue),
  );
  const dropDownIsOpen = useProp(false);

  function selectOption(newValue: TankType) {
    value.value = newValue;
    dropDownIsOpen.value = false;
  }

  const tanks = useFormula(() => {
    if (!props.client) return null;
    if (!exists(props.client.tanks)) return null;
    return listTanks(props.client.tanks, true);
  });

  const justFuelLabel = `Just Fuel`;

  return (
    <Selector
      value={value.value}
      noneLabel={"Select Tank"}
      isOpen={dropDownIsOpen}
      getLabelForData={(data: TankType) => {
        if (!exists(data)) return null;
        if (data == JUST_FUEL) return justFuelLabel;
        return data.getLabel();
      }}
      noOptionsText={"No Tanks"}
      cancelOptions={{
        stroke: theme.palette.hint,
      }}
    >
      {/* New Tank Type */}
      <Show when={props.showNewOption}>
        <Row
          padBetween={0.1}
          stroke={mdColors.green}
          onClick={() =>
            openCreateTankDialog({
              client: props.client,
              onCreate: (newObject) => selectOption(newObject),
            })
          }
        >
          <Txt>New</Txt>
          <Icon iconPath={mdiPlus} />
        </Row>
      </Show>
      <Show when={props.showJustFuelOption}>
        <Txt
          onClick={() => {
            selectOption(JUST_FUEL);
          }}
          widthGrows
          stroke={mdColors.green}
        >
          {justFuelLabel}
        </Txt>
      </Show>
      {/* Divider */}
      <Show
        when={
          (props.showNewOption || props.showJustFuelOption) &&
          !props.hideTanksList
        }
      >
        <Box widthGrows height={0.125} fill={mdColors.grey} />
      </Show>

      {/* Tanks */}
      <Show when={!props.hideTanksList}>
        <For
          each={tanks.value ?? []}
          fallback={
            <Txt
              onClick={() => {
                dropDownIsOpen.value = false;
              }}
              widthGrows
              stroke={props.hintColorOverride ?? mdColors.grey}
            >
              No Tanks
            </Txt>
          }
        >
          {(tank) => (
            <Txt
              stroke={mdColors.black}
              onClick={() => {
                selectOption(tank);
              }}
              widthGrows
              alignCenterLeft
            >
              {tank.getLabel()}
            </Txt>
          )}
        </For>
      </Show>
    </Selector>
  );
}
