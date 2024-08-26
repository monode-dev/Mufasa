import { formatPosixTime, ONE_TIME } from "@/utils";
import {
  Card,
  Field,
  Label,
  Row,
  Txt,
  pushPage,
  NumField,
  useProp,
  exists,
  useFormula,
  HiddenOption,
  HiddenOptions,
  DeleteOption,
  theme,
  EnterKeyHint,
  Prop,
  doNow,
} from "miwi";
import { onCleanup, Show } from "solid-js";
import CompleteSubDeliveryDialog from "./CompleteSubDelivery.dialog";
import CompletedSubDeliveryFields from "./CompletedSubDeliveryFields";
import TankSelector from "@/Tanks/TankSelector";
import { FuelTypeSelector } from "@/Fuel/FuelTypeSelector";
import { SubDelivery } from "./Delivery";
import DeleteDialog from "@/components/DeleteDialog";
import { mdiCheck, mdiUndo } from "@mdi/js";
import { Client } from "@/Clients/Client";
// import { HiddenOption, HiddenOptions } from "@/components/HiddenOptions";
import { ConfirmSubDeliveryUncompletion } from "./ConfirmSubDeliveryUncompletion";
import { Flag } from "mufasa/dist/Utils";
import { OptionalPropFlag } from "mufasa/dist/Doc";
import { FieldKeyHandler } from "@/AppData";

export default function SubDeliveryCard(props: {
  subDelivery: SubDelivery;
  nextSubDelivery: Prop<SubDelivery | undefined>;
}) {
  function handleComplete() {
    pushPage(CompleteSubDeliveryDialog, {
      subDelivery: props.subDelivery,
    });
  }

  function handleDeleteRequest() {
    console.log("handleDeleteRequest");
    pushPage(DeleteDialog, {
      obj: props.subDelivery,
      message: `Are you sure you want to permanently delete this step of the delivery?`,
    });
  }

  function handleDeleteOfCompletedSubDelivery() {
    pushPage(DeleteDialog, {
      obj: props.subDelivery,
      message: `Are you sure you want to permanently delete this completed delivery?`,
    });
  }

  const scale = 1;
  const isOpen = useProp(false);

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

  function midEnterHint(
    num:
      | (number & Flag<typeof OptionalPropFlag>)
      | (null & Flag<typeof OptionalPropFlag>)
      | number
      | null,
  ): EnterKeyHint {
    const key = (num ?? 0) <= 0 ? `next` : `done`;
    console.log("key: ", key);
    return key;
  }

  onCleanup(() => {
    document.removeEventListener("keydown", FieldKeyHandler);
  });
  document.addEventListener("keydown", FieldKeyHandler);
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
                    useFormula(() =>
                      midEnterHint(props.subDelivery.explicitRate),
                    ).value
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
                    useFormula(() => midEnterHint(props.subDelivery.gallons))
                      .value
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
                enterKeyHint={doNow(() => {
                  const sub = props.nextSubDelivery.value;
                  return sub?.selectedFuel === ONE_TIME
                    ? (sub.fuelSpecs.name ?? ``).trim().length == 0
                      ? `next`
                      : `done`
                    : (sub?.gallons ?? 0) === 0
                      ? `next`
                      : `done`;
                })}
              />
            </Label>
            {/* <Label
              label="Sticked Inches Before"
              stroke={
                props.subDelivery.stickedInchesBeforeFilling
                  ? undefined
                  : $theme.colors.warning
              }
            >
              <NumField
                value={useFormula(
                  () => props.subDelivery.stickedInchesBeforeFilling,
                  (v) => (props.subDelivery.stickedInchesBeforeFilling = v),
                )}
                hintColor={
                  props.subDelivery.stickedInchesBeforeFilling
                    ? undefined
                    : $theme.colors.warning
                }
                underlined
                hint="in."
              />
            </Label>
            <Label
              label="Sticked Inches After"
              stroke={
                props.subDelivery.stickedInchesAfterFilling
                  ? undefined
                  : $theme.colors.warning
              }
            >
              <NumField
                value={useFormula(
                  () => props.subDelivery.stickedInchesAfterFilling,
                  (v) => (props.subDelivery.stickedInchesAfterFilling = v),
                )}
                hintColor={
                  props.subDelivery.stickedInchesAfterFilling
                    ? undefined
                    : $theme.colors.warning
                }
                underlined
                hint="in."
              />
            </Label> */}
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
          fuelNameSig={useFormula(
            () => props.subDelivery.explicitFuelName,
            (v) => (props.subDelivery.explicitFuelName = v),
          )}
          rateSig={useFormula(
            () => props.subDelivery.explicitRate,
            (v) => (props.subDelivery.explicitRate = v),
          )}
          rateOffset={useFormula(
            () => props.subDelivery.explicitRateOffset,
            (v) => (props.subDelivery.explicitRateOffset = v),
          )}
          gallonsSig={useFormula(
            () => props.subDelivery.gallons,
            (v) => (props.subDelivery.gallons = v),
          )}
          stickedInchesBeforeFillingSig={useFormula(
            () => props.subDelivery.stickedInchesBeforeFilling,
            (v) => (props.subDelivery.stickedInchesBeforeFilling = v),
          )}
          stickedInchesAfterFillingSig={useFormula(
            () => props.subDelivery.stickedInchesAfterFilling,
            (v) => (props.subDelivery.stickedInchesAfterFilling = v),
          )}
          allGrey={true}
        />
      </Show>
    </Card>
  );
}
