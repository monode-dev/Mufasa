// noinspection t

import {
  Txt,
  Card,
  Body,
  Button,
  Row,
  Column,
  Box,
  Label,
  mdColors,
  NumField,
  doWatch,
  roundToString,
  Prop,
  useFormula,
  exists,
  pushPage,
  useProp,
  Selector,
  Icon,
  JUST_FUEL,
  ONE_TIME,
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
import { Slider } from "@/components/Slider";
import { openCreateTankDialog } from "@/Tanks/CreateTankDialog";
import { mdiPlus } from "@mdi/js";
import { prop } from "mufasa";

const maxSafe = 90.0001;
export default function Calculator() {
  // Constants
  const emptyText = `--`;
  // Tab Control
  const selectedTab = useProp(0);
  const tabs = { delivery: 0, tank: 1, dimensions: 2 };
  // Delivery Tab
  const selectedDelivery = useProp<Delivery | null>(null);
  const deliverySelectorIsOpen = useProp(false);
  const selectedSubDelivery = useProp<SubDelivery | null>(null);
  doWatch(() => {
    if (
      selectedSubDelivery.value?.isCompleted ||
      selectedSubDelivery.value?.isDeleted
    ) {
      selectedSubDelivery.value = null;
      stickedInches.value = null;
    }
    if (
      selectedDelivery.value?.isCompleted ||
      selectedDelivery.value?.isDeleted
    ) {
      selectedDelivery.value = null;
      stickedInches.value = null;
    }
  });
  // If there is only one subDelivery, select it.
  doWatch(() => {
    if (
      exists(selectedDelivery.value) &&
      !exists(selectedSubDelivery.value) &&
      selectedDelivery.value.incompleteSubDeliveries.length === 1
    ) {
      selectedSubDelivery.value =
        selectedDelivery.value.incompleteSubDeliveries[0];
    }
  });
  // When the delivery changes unselect the subDelivery.
  doWatch(() => {
    if (
      selectedSubDelivery.value?.delivery.docId !==
      selectedDelivery.value?.docId
    ) {
      selectedSubDelivery.value = null;
      stickedInches.value = null;
    }
  });
  const subDeliverySelectorIsOpen = useProp(false);
  function getSubDeliveryName(subDelivery: SubDelivery | null) {
    return subDelivery?.subTitle ?? null;
  }
  // Tank Tab
  const selectedClient = useProp(null) as Prop<Client | null | undefined>;
  const selectedTank = useProp(null) as Prop<Tank | null>;
  // Dimensions Tab
  const explicitTankGeometry = createReactiveTankGeometry();
  // Calculations
  const tankGeometry = useFormula(() =>
    selectedTab.value === tabs.delivery
      ? selectedSubDelivery.value?.tankGeometry ?? explicitTankGeometry
      : selectedTab.value === tabs.tank
        ? selectedTank.value
        : explicitTankGeometry,
  );
  const stickedInches = useProp(null) as Prop<number | null>;
  const desiredFill = useProp(0.9);
  const totalGallons = useFormula(() =>
    getTankShape(tankGeometry.value?.shape)?.calcTotalVolume(
      tankGeometry.value,
    ),
  );

  const TankFields_warning = useProp("");
  const showWarning = useFormula(
    () => exists(TankFields_warning.value) && selectedTab.value == tabs.dimensions,
  );

  const currentGallons = useFormula(() =>
    !showWarning.value
      ? getTankShape(tankGeometry.value?.shape)?.calcFilledVolume(
          tankGeometry.value,
          stickedInches.value,
        )
      : undefined,
  );
  const currentFillPercent = useFormula(() =>
    (!showWarning.value
      && exists(totalGallons.value)
      && exists(currentGallons.value))
      ? totalGallons.value === 0
        ? 0
        : currentGallons.value / totalGallons.value
      : undefined,
  );
  const gallonsToReachDesiredFill = useFormula(() =>
    calcGallonsToReachPercent(
      tankGeometry.value,
      stickedInches.value,
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
    if (!selectedSubDelivery.value.isValid){ 
      if(selectedSubDelivery.value.gallons && selectedSubDelivery.value.explicitRate && selectedSubDelivery.value.fuelName){
        return;
      }
    }
    if (!exists(gallonsToReachDesiredFill.value)){ console.log("157"); return;}
    if (gallonsToReachDesiredFill.value <= 0){ console.log("158"); return;}
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
      if ((stickedInches.value ?? 0) > 0) return $theme.colors.error;
      else return undefined;

    return val * 100 > maxSafe ? fillColor(val) : undefined;
  }
  
  return (
    <Body asWideAsParent padBetween={0.5}>
      <Txt h2>Tank Details</Txt>
      <Card widthGrows>
        <Row widthGrows spaceBetween>
          <Button
            pill
            outlined={selectedTab.value !== tabs.delivery}
            onClick={() => (selectedTab.value = tabs.delivery)}
          >
            Delivery
          </Button>
          <Button
            pill
            outlined={selectedTab.value !== tabs.tank}
            onClick={() => (selectedTab.value = tabs.tank)}
          >
            Tank
          </Button>
          <Button
            pill
            outlined={selectedTab.value !== tabs.dimensions}
            onClick={() => (selectedTab.value = tabs.dimensions)}
          >
            Dimensions
          </Button>
        </Row>
        <Show when={selectedTab.value === tabs.delivery}>
          <Column>
            {/* --Delivery-- */}
            <Label label="Delivery">
              <Selector
                value={selectedDelivery.value}
                modalIsOpenSig={deliverySelectorIsOpen}
                noneLabel={"Select Delivery"}
                getLabelForData={(delivery) => delivery?.title ?? null}
                emptyListText={"No Upcoming Deliveries"}
              >
                {/* Selector does not allow invalid deliveries */}
                <For
                  each={Delivery.upcomingDeliveries.filter(
                    (delivery) => delivery.isValid[0], 
                  )}
                  fallback={<Txt hint>No Upcoming Deliveries</Txt>}
                >
                  {(delivery) => (
                    <Txt
                      onclick={() => {
                        selectedDelivery.value = delivery;
                        deliverySelectorIsOpen.value = false;
                      }}
                      widthGrows
                      heightShrinks
                      overflowX={$Overflow.wrap}
                    >
                      {delivery.title}
                    </Txt>
                  )}
                </For>
              </Selector>
            </Label>

            {/* --Sub Delivery-- */}
            <Show when={exists(selectedDelivery.value)}>
              <Label label="Tank">
                <Selector
                  value={selectedSubDelivery.value}
                  modalIsOpenSig={subDeliverySelectorIsOpen}
                  noneLabel={"Select Tank"}
                  getLabelForData={getSubDeliveryName}
                  emptyListText={"No Clients"}
                >
                  <Show when={Delivery.upcomingDeliveries.length < 0}>
                    <Txt
                      onclick={() => {
                        subDeliverySelectorIsOpen.value = false;
                      }}
                      hint
                      widthGrows
                    >
                      No Upcoming Deliveries
                    </Txt>
                  </Show>
                  
                  <For each={selectedDelivery.value?.sortedSubDeliveries ?? []} 
                    fallback={                     
                      <Box 
                        onClick={async () => { 
                          selectedDelivery.value?.createSubDelivery();
                        }}> 
                        <Row stroke={$theme.colors.primary} alignCenterLeft padBetween={0.125}>                   
                          <Txt>Add Sub Delivery</Txt> 
                          <Icon iconPath={mdiPlus} />    
                        </Row>
                      </Box>
                    }

                  >
                    {(subDelivery) => (
                      <Txt
                        onclick={() => {
                          selectedSubDelivery.value = subDelivery;
                          subDeliverySelectorIsOpen.value = false;
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
              <Show
                when={
                  exists(selectedSubDelivery.value) &&
                  !exists(selectedSubDelivery.value.tankGeometry) 
                }
              >
                {/*<TankFields tankGeometry={tankGeometry.value!} />*/}
                {/* TODO: Show a button to add this tank to the client. */} 
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
              </Show>
            </Show>
          </Column>
        </Show>

        {/* TANK TAB */}
        <Show when={selectedTab.value === tabs.tank}>
          <ClientAndTankSelector
            client={selectedClient}
            tank={selectedTank}
            showNewOption={true}
          />
        </Show>

        {/* DIMENSIONS TAB */}
        <Show when={selectedTab.value === tabs.dimensions} >
          <TankFields tankGeometry={tankGeometry.value!}
          warningMessage={TankFields_warning}/>
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
            valueSig={stickedInches}
            underlined
            hint="in."
            negativesAreAllowed={false}
          />
        </Label>
        <Box widthGrows height={0.125} fill={"grey"} />
        <Row>
          <Label
            label="Current Fill"
            align={$Align.centerLeft}
            widthGrows
            stroke={fillColor(currentFillPercent.value ?? 0)}
          >
            {exists(currentFillPercent.value) &&
            !isNaN(currentFillPercent.value)
              ? `${roundToString(100 * currentFillPercent.value)}%`
              : emptyText}
          </Label>
          <Label label="Current Gal" align={$Align.centerLeft} widthGrows>
            {exists(currentGallons.value) && !isNaN(currentGallons.value)
              ? formatNumWithCommas(currentGallons.value)
              : emptyText}
          </Label>
        </Row>
      </Card>

      {/* SECTION: Fill Details */}
      <Box height={1.25} />
      <Txt h2>Fill Details</Txt>
      <Card widthGrows>
        <Row>
          <Label
            stroke={desiredFillTextColor.value}
            label="Desired Fill"
            align={$Align.centerLeft}
            widthGrows
          >
            {desiredStr(desiredFill.value)}
          </Label>
          <Label
            stroke={desiredFillTextColor.value}
            label="Gallons to Add"
            align={$Align.centerLeft}
            widthGrows
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
          knobHSL={sliderColor.value}
          trackHSL={sliderColor.value}
          step={1}
        />
      </Card>
      <Show when={selectedTab.value === tabs.delivery}>
        <Button
          widthGrows
          fill={
            deliveryCanBeCompleted.value && selectedTab.value === tabs.delivery
              ? mdColors.green
              : mdColors.grey
          }
          onClick={() => {
            selectedTab.value = tabs.delivery;
            completeDelivery();
          }}
        >
          Complete Delivery
        </Button>
      </Show>
    </Body>
  );
}
