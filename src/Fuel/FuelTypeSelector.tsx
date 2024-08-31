import { ONE_TIME, NONE_SELECTED } from "@/utils";
import { openCreateFuelTypeDialog } from "@/Fuel/CreateFuelTypeDialog";
import {
  useProp,
  Row,
  Txt,
  Icon,
  Box,
  mdColors,
  Prop,
  doNow,
  exists,
  useFormula,
  Selector,
  theme,
} from "miwi";
import { For, Show } from "solid-js";
import { mdiFuel, mdiPlus } from "@mdi/js";
import { FuelType } from "@/model/DataModel";

type SelectedFuelType = FuelType | typeof ONE_TIME | null;

export function FuelTypeSelector(props: {
  fuelType: Prop<SelectedFuelType | undefined>;
  isOpen?: Prop<boolean>;
  showNewOption?: boolean;
  showOneTimeOption?: boolean;
  isWide?: boolean;
  hideIcon?: boolean;
  show_errors?: Prop<boolean>;
}) {
  // Set default values for props if not set -- Look into a better way to do this
  props.showNewOption = props.showNewOption ?? true;
  props.showOneTimeOption = props.showOneTimeOption ?? false;

  const isOpen = doNow(() => {
    const _fallbackIsOpen = useProp(false);
    return useFormula(
      () => props.isOpen?.value ?? _fallbackIsOpen.value,
      (v) => {
        if (exists(props.isOpen)) {
          props.isOpen.value = v;
        } else {
          _fallbackIsOpen.value = v;
        }
      },
    );
  });
  const oneTimeLabel = `One Time`;

  function selectOption(_fuelType: SelectedFuelType) {
    if (
      _fuelType !== ONE_TIME &&
      _fuelType !== NONE_SELECTED &&
      !FuelType.isValid(_fuelType)
    ) {
      return;
    }
    props.fuelType.value = _fuelType;
    isOpen.value = false;
  }
  const noneLabel = `Select Fuel`;
  function getLabelForData(data: SelectedFuelType | null) {
    return data == ONE_TIME ? oneTimeLabel : (data?.name ?? null);
  }

  return (
    <Row
      widthGrows
      alignTopLeft
      padBetween={0.6}
      onClick={() => {
        if (!isOpen.value) {
          isOpen.value = true;
        }
      }}
      height={1.15}
      overflowXSpills
      overflowYSpills
    >
      <Show when={!props.hideIcon}>
        <Box width={1} height={1}>
          <Icon iconPath={mdiFuel} scale={1.15} />
        </Box>
      </Show>

      <Row
        stroke={
          props.show_errors?.value &&
          (props.fuelType.value == undefined || props.fuelType.value == null)
            ? $theme.colors.warning
            : undefined
        }
      >
        <Selector
          value={props.fuelType.value ?? null}
          noneLabel="Select Fuel"
          isOpen={isOpen}
          getLabelForData={getLabelForData}
          noOptionsText={"No Fuels"}
          cancelOptions={{
            stroke: theme.palette.hint,
          }}
        >
          <Show when={props.showNewOption}>
            <Row
              widthGrows
              padBetween={0.125}
              alignCenterLeft
              stroke={$theme.colors.primary}
              onClick={() =>
                openCreateFuelTypeDialog({
                  onCreate: (newObject: any) => selectOption(newObject),
                })
              }
            >
              <Txt>New </Txt>
              <Icon iconPath={mdiPlus} />
            </Row>
          </Show>
          {/* One Time */}
          <Show when={props.showOneTimeOption}>
            <Txt
              widthGrows
              heightShrinks
              overflowX={$Overflow.wrap}
              stroke={$theme.colors.primary}
              onClick={() => selectOption(ONE_TIME)}
            >
              {oneTimeLabel}
            </Txt>
          </Show>
          {/* Divider */}
          <Show when={props.showNewOption || props.showOneTimeOption}>
            <Box widthGrows height={0.125} fill={mdColors.grey} />
          </Show>
          {/* Fuel Types */}
          <Show when={FuelType.sortedFuelTypes.length == 0}>
            <Txt
              hint
              widthGrows
              onClick={() => {
                isOpen.value = false;
              }}
            >
              No Fuel Types
            </Txt>
          </Show>
          <For each={FuelType.sortedFuelTypes}>
            {(fuel) => (
              <Txt
                widthGrows
                // singleLine
                overflowX={$Overflow.wrap}
                stroke={
                  FuelType.isValid(fuel) ? mdColors.black : $theme.colors.hint
                }
                onClick={() => {
                  selectOption(fuel);
                }}
              >
                {fuel.name ?? "Unknown Fuel Type"}
              </Txt>
            )}
          </For>
        </Selector>
      </Row>
    </Row>
  );
}
