import { formatPosixTime, ONE_TIME } from "@/utils";
import {
  Card,
  Field,
  Label,
  Row,
  Txt,
  pushPage,
  NumField,
  exists,
  useFormula,
  HiddenOption,
  HiddenOptions,
  DeleteOption,
  theme,
  EnterKeyHint,
  Prop,
  DeleteDialog,
} from "miwi";
import { Show } from "solid-js";
import CompleteSubDeliveryDialog from "./CompleteSubDeliveryDialog";
import { CompletedSubDeliveryFields } from "./CompletedSubDeliveryFields";
import TankSelector from "@/Tanks/TankSelector";
import { FuelTypeSelector } from "@/Fuel/FuelTypeSelector";
import { SubDelivery } from "./Delivery";
import { mdiCheck, mdiUndo } from "@mdi/js";
import { Client } from "@/Clients/Client";
import { ConfirmSubDeliveryUncompletion } from "./ConfirmSubDeliveryUncompletion";

export default function SubDeliveryCard(props: {
  subDelivery: SubDelivery;
  nextSubDelivery: Prop<SubDelivery | undefined>;
  fieldRefs: Prop<Map<number, HTMLDivElement>>;
  // filled in enterKey() function
  enterHintRefs: Prop<Map<number, EnterKeyHint>>;
  subDeliveryIndex: Prop<number>;
  nextOverride: Prop<Map<number, Prop<number>>>;
  noKeyHandler?: boolean;
}) {
  function handleComplete() {
    pushPage(CompleteSubDeliveryDialog, {
      subDelivery: props.subDelivery,
    });
  }

  function handleDeleteRequest() {
    pushPage(DeleteDialog, {
      onDelete: () => props.subDelivery.deleteDoc(),
      message: `Are you sure you want to permanently delete this step of the delivery?`,
    });
  }

  function handleDeleteOfCompletedSubDelivery() {
    pushPage(DeleteDialog, {
      onDelete: () => props.subDelivery.deleteDoc(),
      message: `Are you sure you want to permanently delete this completed delivery?`,
    });
  }

  const scale = 1;

  const selectedFuel = useFormula(
    () => props.subDelivery.selectedFuel,
    (v) => (props.subDelivery.selectedFuel = v),
  );
  const selectedTank = useFormula(
    () => props.subDelivery.selectedTank,
    (v) => (props.subDelivery.selectedTank = v),
  );
  const tankHintColor = useFormula(() =>
    exists(selectedTank.value) ? undefined : $theme.colors.warning,
  );
  const mayPickTank = useFormula(
    () =>
      !props.subDelivery.delivery.selectedClientDoc?.isDeleted &&
      props.subDelivery.delivery.selectedClient !== ONE_TIME,
  );

  function handleUnComplete() {
    pushPage(ConfirmSubDeliveryUncompletion, {
      subDelivery: props.subDelivery,
    });
  }

  function midEnterHint(num: number | null): EnterKeyHint {
    return (num ?? 0) <= 0 ? `next` : `done`;
  }

  // local zero based indexes are shifted by subDeliveryIndex then converted to 1 based indexes
  const fields = 3;
  const baseIndex = useFormula(() => 1 + props.subDeliveryIndex.value * fields);
  const nameIndex = useFormula(() => baseIndex.value);
  const rateIndex = useFormula(() => 1 + baseIndex.value);
  const gallonsIndex = useFormula(() => 2 + baseIndex.value);
  const overrideNext = useFormula(() => baseIndex.value + fields + 2);
  function lastEnterHint(
    sub: Prop<SubDelivery | undefined>,
    index: Prop<number>,
  ): EnterKeyHint {
    const s = sub.value;
    let key: EnterKeyHint = `done`;
    if (exists(s)) {
      if (s._isOneTimeFuel) {
        props.nextOverride.value.delete(index.value);
        if ((s._fuelName ?? ``).trim().length == 0) key = `next`;
      } else if ((s.gallons ?? 0) <= 0) {
        key = `next`;
        props.nextOverride.value.set(index.value, overrideNext);
      }
    }
    return key;
  }

  return (
    <Card
      widthGrows
      outlineSize={1 / 8}
      outlineColor={
        props.subDelivery.isValid ? undefined : $theme.colors.warning
      }
      preventClickPropagation
    >
      <Show
        when={props.subDelivery.isCompleted}
        fallback={
          <>
            {/* Tank */}
            <Show when={props.subDelivery.shouldShowTankSelector}>
              <Row padBetween={1}>
                <Label label="Tank" stroke={tankHintColor.value}>
                  <TankSelector
                    value={selectedTank}
                    client={props.subDelivery.delivery.selectedClient as Client}
                    showNewOption={mayPickTank.value}
                    showJustFuelOption={true}
                    hintColorOverride={tankHintColor.value}
                    hideTanksList={!mayPickTank.value}
                  />
                </Label>
                <HiddenOptions
                  cancelOptions={{
                    stroke: theme.palette.hint,
                  }}
                >
                  <HiddenOption
                    scale={scale}
                    alignCenterLeft
                    padBetween={0.25}
                    onClick={handleComplete}
                    stroke={$theme.colors.primary}
                    text={`Complete`}
                    icon={mdiCheck}
                  />
                  <DeleteOption onClick={handleDeleteRequest} />
                </HiddenOptions>
              </Row>
            </Show>

            {/* Fuel Type */}
            <Show when={props.subDelivery.shouldShowFuelSelector}>
              <Row padBetween={1}>
                <Label label="Fuel" stroke={tankHintColor.value}>
                  <FuelTypeSelector
                    hideIcon
                    fuelType={selectedFuel}
                    showNewOption
                    showOneTimeOption
                  />
                </Label>
                <Show when={!props.subDelivery.shouldShowTankSelector}>
                  <HiddenOptions
                    cancelOptions={{
                      stroke: theme.palette.hint,
                    }}
                  >
                    <HiddenOption
                      scale={scale}
                      alignCenterLeft
                      padBetween={0.25}
                      onClick={handleComplete}
                      stroke={$theme.colors.primary}
                      text={`Complete`}
                      icon={mdiCheck}
                    />
                    <DeleteOption onClick={handleDeleteRequest} />
                  </HiddenOptions>
                </Show>
              </Row>
            </Show>

            {/* One Time Fuel Type Fields */}
            <Show
              when={
                props.subDelivery.showFuelNameAndRate &&
                props.subDelivery.shouldShowFuelSelector
              }
            >
              <Label label="Name">
                <Field
                  value={useFormula(
                    () => props.subDelivery.explicitFuelName,
                    (v) => (props.subDelivery.explicitFuelName = v),
                  )}
                  underlined
                  hintText="Fuel Name"
                  capitalize={`words`}
                  keyboard={"text"}
                  enterKeyHint={
                    useFormula(() => {
                      const key: EnterKeyHint = midEnterHint(
                        props.subDelivery.explicitRate,
                      );
                      props.enterHintRefs.value.set(nameIndex.value, key);
                      return key;
                    }).value
                  }
                  onlyWriteOnBlur
                />
              </Label>
              <Label label="Rate">
                <NumField
                  value={useFormula(
                    () => props.subDelivery.explicitRate,
                    (v) => (props.subDelivery.explicitRate = v),
                  )}
                  underlined
                  hint="Rate"
                  enterKeyHint={
                    useFormula(() => {
                      const key: EnterKeyHint = midEnterHint(
                        props.subDelivery.explicitRate,
                      );
                      props.enterHintRefs.value.set(rateIndex.value, key);
                      return key;
                    }).value
                  }
                  onlyWriteOnBlur
                />
              </Label>
            </Show>

            {/* Gallons */}
            <Label
              label="Gallons"
              stroke={
                props.subDelivery.gallons ? undefined : $theme.colors.warning
              }
            >
              <NumField
                value={useFormula(
                  () => props.subDelivery.gallons,
                  (v) => (props.subDelivery.gallons = v),
                )}
                hintColor={
                  props.subDelivery.gallons ? undefined : $theme.colors.warning
                }
                underlined
                hint="Est. gal."
                enterKeyHint={
                  useFormula(() => {
                    const key: EnterKeyHint = lastEnterHint(
                      props.nextSubDelivery,
                      gallonsIndex,
                    );
                    props.enterHintRefs.value.set(gallonsIndex.value, key);
                    return key;
                  }).value
                }
                // allowing write so 0 Gallons warning will go away
                // onlyWriteOnBlur
              />
            </Label>
            <Show
              when={
                exists(props.subDelivery.subInvalidError) &&
                props.subDelivery.subInvalidError != ``
              }
            >
              <Txt stroke={$theme.colors.warning}>
                {props.subDelivery.subInvalidError}
              </Txt>
            </Show>
          </>
        }
      >
        <Row
          widthGrows
          // alignCenterRight
          alignTopCenter
          stroke={
            props.subDelivery.isCompleted ? $theme.colors.hint : undefined
          }
        >
          <Txt widthGrows alignTopLeft>
            {exists(props.subDelivery.completedTimePosix)
              ? formatPosixTime(props.subDelivery.completedTimePosix)
              : "Unknown Date"}
          </Txt>
          <HiddenOptions
            cancelOptions={{
              stroke: theme.palette.hint,
            }}
          >
            <HiddenOption
              stroke={$theme.colors.warning}
              text={`Uncomplete`}
              icon={mdiUndo}
              onClick={handleUnComplete}
            />
            <DeleteOption onClick={handleDeleteOfCompletedSubDelivery} />
          </HiddenOptions>
        </Row>
        {/* NOTE propToSig is interfering with turning the text in the card gray when subDelivery is completed */}
        <CompletedSubDeliveryFields
          fuelName={useFormula(
            () => props.subDelivery.explicitFuelName,
            (v) => (props.subDelivery.explicitFuelName = v),
          )}
          baseRate={useFormula(
            () => props.subDelivery.explicitRate,
            (v) => (props.subDelivery.explicitRate = v),
          )}
          rateOffset={useFormula(
            () => props.subDelivery.explicitRateOffset,
            (v) => (props.subDelivery.explicitRateOffset = v),
          )}
          gallons={useFormula(
            () => props.subDelivery.gallons,
            (v) => (props.subDelivery.gallons = v),
          )}
          stickedInchesBeforeFilling={useFormula(
            () => props.subDelivery.stickedInchesBeforeFilling,
            (v) => (props.subDelivery.stickedInchesBeforeFilling = v),
          )}
          stickedInchesAfterFilling={useFormula(
            () => props.subDelivery.stickedInchesAfterFilling,
            (v) => (props.subDelivery.stickedInchesAfterFilling = v),
          )}
          tankGeometry={props.subDelivery.tankGeometry}
          allGrey={true}
        />
      </Show>
    </Card>
  );
}
