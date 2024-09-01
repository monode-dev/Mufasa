// noinspection t

import {
  Txt,
  Card,
  Body,
  Row,
  Column,
  Box,
  Label,
  NumField,
  doWatch,
  roundToString,
  useFormula,
  exists,
  pushPage,
  useProp,
  Selector,
  Slider,
  theme,
  Icon,
  Prop,
  HiddenOption,
  Button,
} from "miwi";
import { For, Show } from "solid-js";
import {
  calcGallonsToReachPercent,
  createReactiveTankGeometry,
  getTankShape,
} from "@/Calculator/ShapeUtils";
import { formatNumWithCommas } from "@/utils";
import CompleteSubDeliveryDialog from "@/Deliveries/CompleteSubDelivery.dialog";
import TankFields from "@/Tanks/TankFields";
import { ClientAndTankSelector } from "@/Clients/ClientAndTankSelector";
import { Delivery, SubDelivery } from "@/Deliveries/Delivery";
import { Client } from "@/Clients/Client";
import { Tank } from "@/Tanks/Tank";
import { mdiPencil } from "@mdi/js";
import { DeliveryPage } from "@/Deliveries/DeliveryPage";

const maxSafe = 90.0001;
export default function Calculator() {
  // Constants
  const emptyText = `--`;
  // Tab Control
  const selectedCalcType = useProp(0);
  const tabs = { delivery: 0, tank: 1, dimensions: 2 };
  // Delivery Tab
  const selectedDelivery = useProp<Delivery | null>(null);
  const deliverySelectorIsOpen = useProp(false);
  const selectedSubDelivery = useProp<SubDelivery | null>(null);

  // combined 3 doWatch into one to avoid a possible infinite loop
  doWatch(() => {
    if (
      selectedSubDelivery.value?.isCompleted ||
      selectedSubDelivery.value?.isDeleted
    ) {
      selectedSubDelivery.value = null;
    }
    if (
      selectedDelivery.value?.isCompleted ||
      selectedDelivery.value?.isDeleted
    ) {
      selectedDelivery.value = null;
    }

    // When the delivery changes unselect the subDelivery.
    if (
      selectedSubDelivery.value?.delivery.docId !==
      selectedDelivery.value?.docId
    ) {
      selectedSubDelivery.value = null;
    }
  });

  const subDeliverySelectorIsOpen = useProp(false);
  function getSubDeliveryName(subDelivery: SubDelivery | null) {
    return subDelivery?.title ?? null;
  }
  // Tank Tab
  const selectedClient = useProp(null) as Prop<Client | null | undefined>;
  const selectedTank = useProp(null) as Prop<Tank | null>;
  // Dimensions Tab
  const explicitTankGeometry = createReactiveTankGeometry();
  // Calculations
  const tankGeometry = useFormula(() =>
    selectedCalcType.value === tabs.delivery
      ? (selectedSubDelivery.value?.tankGeometry ?? explicitTankGeometry)
      : selectedCalcType.value === tabs.tank
        ? selectedTank.value
        : explicitTankGeometry,
  );
  const desiredFill = useProp(0.9);
  const totalGallons = useFormula(() =>
    getTankShape(tankGeometry.value?.shape)?.calcTotalVolume(
      tankGeometry.value,
    ),
  );

  const TankFields_warning = useProp("");
  const showWarning = useFormula(
    () =>
      exists(TankFields_warning.value) &&
      selectedCalcType.value == tabs.dimensions,
  );

  const calcStickedInches: Prop<number | null | undefined> = useProp<
    number | null | undefined
  >(undefined);
  const stickedInchesHasFocus = useProp(false);
  const focusOnStickedInchesIfEmpty = () => {
    if (!exists(calcStickedInches.value)) {
      stickedInchesHasFocus.value = true;
    }
  };

  const currentGallons = useFormula(() => {
    // console.log("warn: ", showWarning.value);
    if (!showWarning.value) {
      const geo = tankGeometry.value;
      // console.log("geo: ", geo);
      const geoShape = geo?.shape;
      // console.log("geoShape: ", geoShape);
      const tank = getTankShape(geoShape);
      // console.log("tank: ", tank);
      const vol = tank?.calcFilledVolume(geo, calcStickedInches.value);
      // console.log("calcStickedInches: ", calcStickedInches.value);
      // console.log("vol: ", vol);
      return vol;
    } else {
      return undefined;
    }
  });
  const currentFillPercent = useFormula(() => {
    // console.log("total: ", totalGallons.value);
    // console.log("current: ", currentGallons.value);
    return !showWarning.value &&
      exists(totalGallons.value) &&
      exists(currentGallons.value)
      ? totalGallons.value === 0
        ? 0
        : currentGallons.value / totalGallons.value
      : undefined;
  });
  const gallonsToReachDesiredFill = useFormula(() =>
    calcGallonsToReachPercent(
      tankGeometry.value,
      calcStickedInches.value,
      desiredFill.value,
    ),
  );

  // Complete Delivery
  const deliveryCanBeCompleted = useFormula(() => {
    return (
      exists(selectedDelivery.value) &&
      exists(gallonsToReachDesiredFill.value) &&
      gallonsToReachDesiredFill.value > 0
    );
  });
  function completeDelivery() {
    if (!exists(selectedSubDelivery.value)) return;
    if (!selectedSubDelivery.value.isValid) return;
    if (!exists(gallonsToReachDesiredFill.value)) return;
    if (gallonsToReachDesiredFill.value <= 0) return;
    pushPage(CompleteSubDeliveryDialog, {
      subDelivery: selectedSubDelivery.value,
    });
  }

  function fillColor(val: number) {
    const fill = val * 100;
    if (fill <= maxSafe) {
      return $theme.colors.text;
    } else if (fill <= 95) {
      return $theme.colors.warning;
    } else {
      return $theme.colors.error;
    }
  }

  const desiredFillTextColor = useFormula(() => {
    const val = desiredFill.value;
    return fillColor(val);
  });
  const sliderColor = useFormula(() => {
    const textColor = desiredFillTextColor.value;
    return textColor === $theme.colors.text ? $theme.colors.primary : textColor;
  });

  function desiredStr(val: number) {
    return roundToString(val * 100) + "%";
  }

  function fillOutline(val: number | undefined) {
    if (!exists(val) || isNaN(val))
      if ((calcStickedInches.value ?? 0) > 0) return $theme.colors.error;
      else return undefined;

    return val * 100 > maxSafe ? fillColor(val) : undefined;
  }

  return (
    <Body asWideAsParent padBetween={0.5}>
      <Txt h2>Calculate Fill</Txt>
      <Card widthGrows>
        <Label label="Calc for">
          <Selector
            value={selectedCalcType.value}
            getLabelForData={(tabIndex) =>
              ["Upcoming Delivery", "Look Up Tank", "Manual Dimensions"][
                tabIndex
              ]
            }
            cancelOptions={{
              stroke: theme.palette.hint,
            }}
          >
            <For
              each={["Upcoming Delivery", "Look Up Tank", "Manual Dimensions"]}
            >
              {(calcType, getIndex) => (
                <HiddenOption
                  onClick={() => (selectedCalcType.value = getIndex())}
                >
                  {calcType}
                </HiddenOption>
              )}
            </For>
          </Selector>
        </Label>

        {/*</Row>*/}
        <Show when={selectedCalcType.value === tabs.delivery}>
          <Column>
            {/* --Delivery-- */}
            <Label
              label="Delivery"
              stroke={
                !selectedDelivery.value?.isValid && selectedDelivery.value
                  ? $theme.colors.warning
                  : undefined
              }
            >
              <Selector
                value={selectedDelivery.value}
                isOpen={deliverySelectorIsOpen}
                noneLabel={"Select Delivery"}
                getLabelForData={(delivery) => delivery?.title ?? null}
                noOptionsText={"No Upcoming Deliveries"}
                cancelOptions={{
                  stroke: theme.palette.hint,
                }}
                stroke={$theme.colors.text}
                actionButtons={
                  <Show when={exists(selectedDelivery.value)}>
                    <Icon
                      iconPath={mdiPencil}
                      onClick={() => {
                        if (exists(selectedDelivery.value)) {
                          pushPage(DeliveryPage, {
                            delivery: selectedDelivery.value,
                          });
                        }
                      }}
                    />
                  </Show>
                }
              >
                {/* Selector does not allow invalid deliveries */}
                <For
                  each={Delivery.upcomingDeliveries.filter(
                    (delivery) => delivery.isValid,
                  )}
                  fallback={<Txt hint>No Upcoming Deliveries</Txt>}
                >
                  {(delivery) => (
                    <Txt
                      onclick={() => {
                        selectedDelivery.value = delivery;
                        deliverySelectorIsOpen.value = false;
                        subDeliverySelectorIsOpen.value = true;
                      }}
                      widthGrows
                      heightShrinks
                      overflowX={$Overflow.wrap}
                      stroke={$theme.colors.text}
                    >
                      {delivery.title}
                    </Txt>
                  )}
                </For>
              </Selector>
            </Label>

            {/* --Sub Delivery-- */}
            <Show
              when={
                exists(selectedDelivery.value) &&
                selectedDelivery.value?.isValid
              }
            >
              <Label
                label="Tank"
                stroke={
                  !selectedSubDelivery.value?.isValid &&
                  selectedSubDelivery.value &&
                  selectedSubDelivery.value?.delivery.selectedClient !=
                    selectedDelivery.value?.selectedClient
                    ? $theme.colors.warning
                    : undefined
                }
              >
                <Selector
                  value={selectedSubDelivery.value}
                  isOpen={subDeliverySelectorIsOpen}
                  noneLabel={"Select Tank"}
                  getLabelForData={getSubDeliveryName}
                  noOptionsText={"No Tanks"}
                  cancelOptions={{ stroke: theme.palette.hint }}
                >
                  <Show
                    when={
                      (selectedDelivery.value?.sortedSubDeliveries?.length ??
                        0) <= 0
                    }
                  >
                    <Txt
                      onclick={() => {
                        subDeliverySelectorIsOpen.value = false;
                      }}
                      hint
                      widthGrows
                    >
                      No Individual Deliveries
                    </Txt>
                  </Show>

                  <For
                    each={
                      selectedDelivery.value?.sortedSubDeliveries.filter(
                        (sub) => !sub._isOneTimeFuel && sub.isValid,
                      ) ?? []
                    }
                  >
                    {(subDelivery) => (
                      <Txt
                        onclick={() => {
                          selectedSubDelivery.value = subDelivery;
                          subDeliverySelectorIsOpen.value = false;
                          focusOnStickedInchesIfEmpty();
                        }}
                        widthGrows
                        heightShrinks
                        overflowX={$Overflow.wrap}
                        stroke={
                          subDelivery.completedTimePosix ? "grey" : undefined
                        }
                      >
                        {getSubDeliveryName(subDelivery) ?? `Unknown Delivery`}
                      </Txt>
                    )}
                  </For>
                </Selector>
              </Label>
              {/* <Show
                when={
                  exists(selectedSubDelivery.value) &&
                  !exists(selectedSubDelivery.value.tankGeometry) 
                }
              >
                <Box
                  onClick={() => {
                    openCreateTankDialog({
                      client:selectedDelivery.value?._client!,
                      onCreate(newTank) {                     
                        if(selectedSubDelivery.value){
                          selectedSubDelivery.value._tank = newTank;
                        }
                      },
                    })
                  }}
                >
                  <Row stroke={$theme.colors.primary} alignCenterLeft padBetween={0.125}>
                    <Txt>Add Tank</Txt>
                    <Icon iconPath={mdiPlus} />
                  </Row>
                </Box>      
              </Show> */}
              <Show when={selectedSubDelivery.value}>
                <Show
                  when={
                    selectedSubDelivery.value?.delivery.selectedClient !=
                    selectedDelivery.value?.selectedClient
                  }
                >
                  <Txt stroke={$theme.colors.warning} widthGrows>
                    This sub delivery is not for the selected client.
                  </Txt>
                </Show>
                <Show
                  when={
                    !selectedSubDelivery.value?.isValid &&
                    selectedSubDelivery.value?.delivery.selectedClient ==
                      selectedDelivery.value?.selectedClient
                  }
                >
                  <Txt stroke={$theme.colors.warning} widthGrows>
                    The selected sub delivery is not valid.
                  </Txt>
                </Show>
              </Show>
            </Show>
          </Column>
          <Show
            when={!selectedDelivery.value?.isValid && selectedDelivery.value}
          >
            <Txt stroke={$theme.colors.warning} widthGrows>
              This delivery is invalid.
            </Txt>
          </Show>
        </Show>

        {/* TANK TAB */}
        <Show when={selectedCalcType.value === tabs.tank}>
          <ClientAndTankSelector
            client={selectedClient}
            tank={selectedTank}
            onTankSelected={focusOnStickedInchesIfEmpty}
            showNewOption={!selectedClient.value?.isDeleted}
          />
        </Show>

        {/* DIMENSIONS TAB */}
        <Show when={selectedCalcType.value === tabs.dimensions}>
          <TankFields
            create
            tankGeometry={tankGeometry.value!}
            warningMessage={TankFields_warning}
          />
          <Show when={showWarning.value}>
            <Txt widthGrows stroke={$theme.colors.warning}>
              {TankFields_warning.value}
            </Txt>
          </Show>
        </Show>

        {/* Other Fields */}
        <Label
          label={`Sticked Inches`}
          outlineSize={1 / 8}
          stroke={fillOutline(currentFillPercent.value)}
        >
          <NumField
            value={useFormula(
              () => calcStickedInches.value,
              (v) => {
                calcStickedInches.value = v;
              },
            )}
            hasFocusSig={stickedInchesHasFocus}
            underlined
            hint="in."
            negativesAreAllowed={false}
          />
        </Label>

        {/* SECTION Current Tank Info */}
        <Row widthGrows spaceBetweenX padBetween={0.5} overflowXWraps>
          <Label
            label="Current Fill"
            align={$Align.centerLeft}
            stroke={fillColor(currentFillPercent.value ?? 0)}
            widthShrinks
          >
            {exists(currentFillPercent.value) &&
            !isNaN(currentFillPercent.value)
              ? `${roundToString(100 * currentFillPercent.value)}%`
              : emptyText}
          </Label>
          <Label
            label="Current Gal"
            align={$Align.centerLeft}
            overflowXCrops
            widthShrinks
          >
            {exists(currentGallons.value) && !isNaN(currentGallons.value)
              ? formatNumWithCommas(currentGallons.value)
              : emptyText}
          </Label>
        </Row>

        {/* SECTION: Fill Details */}
        <Box widthGrows height={0.125} fill={"grey"} />
        <Row widthGrows spaceBetweenX padBetween={0.5} overflowXWraps>
          <Label
            stroke={desiredFillTextColor.value}
            label="Desired Fill"
            align={$Align.centerLeft}
            widthShrinks
          >
            {desiredStr(desiredFill.value)}
          </Label>
          <Label
            stroke={desiredFillTextColor.value}
            label="Gal. to Add"
            align={$Align.centerLeft}
            widthShrinks
          >
            {exists(gallonsToReachDesiredFill.value) &&
            !isNaN(gallonsToReachDesiredFill.value)
              ? formatNumWithCommas(gallonsToReachDesiredFill.value)
              : emptyText}
          </Label>
        </Row>
        <Slider
          min={0.75}
          value={desiredFill}
          max={1}
          color={sliderColor.value}
          step={1}
        />

        {/* SECTION: Complete Delivery */}
        <Button
          widthGrows
          fill={
            selectedCalcType.value === tabs.delivery &&
            deliveryCanBeCompleted.value
              ? theme.palette.primary
              : theme.palette.hint
          }
          onClick={() => {
            if (selectedCalcType.value === tabs.delivery) return;
            completeDelivery();
          }}
        >
          Complete Delivery
        </Button>
      </Card>
    </Body>
  );
}
