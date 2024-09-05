import { mdiPencil, mdiCheck, mdiArrowUpLeft } from "@mdi/js";
import {
  Box,
  Card,
  Row,
  Txt,
  Icon,
  exists,
  formatPosixTime,
  pushPage,
  useProp,
  useFormula,
  mdColors,
  HiddenOption,
  HiddenOptions,
  DeleteOption,
  theme,
} from "miwi";
import { DeliveryPage } from "./DeliveryPage";
import { For, Show } from "solid-js";
import CompleteSubDeliveryDialog from "./CompleteSubDelivery.dialog";
import { Delivery, SubDelivery } from "./Delivery";
import DeleteDialog from "@/components/DeleteDialog";
import { ConfirmSubDeliveryUncompletion } from "./ConfirmSubDeliveryUncompletion";
import { CallAndMapToIcons } from "@/Clients/CallAndMapToIcons";
import { formatNumWithCommas } from "@/utils";

export function DeliveryCard(props: { delivery: Delivery }) {
  // TODO: Make this based off of fuel id not fuel name
  const totalPerFuelType = useFormula(() => {
    const totalPerFuelType = new Map<string, number>();
    props.delivery.sortedSubDeliveries.forEach((sub) => {
      const fuelName = sub.fuelSpecs?.name;
      if (!exists(fuelName)) return;
      totalPerFuelType.set(
        fuelName,
        Math.ceil(
          ((totalPerFuelType.get(fuelName) ?? 0) +
            (sub.isCompleted ? (sub.sales ?? 0) : 0)) *
            100,
        ) / 100,
      );
    });
    return totalPerFuelType;
  });

  return (
    <Card
      alignTopLeft
      padBetween={0.5}
      preventClickPropagation
      stroke={props.delivery.isCompleted ? $theme.colors.hint : undefined}
      onClick={() =>
        pushPage(DeliveryPage, {
          delivery: props.delivery,
        })
      }
    >
      {/* Time */}
      <Show when={props.delivery.isCompleted}>
        <Row alignTopRight>
          <Txt singleLine widthGrows>
            {formatPosixTime(props.delivery.completedTimePosix!)}
          </Txt>
          <DeliveryCardOptionButtons delivery={props.delivery} />
        </Row>
      </Show>

      {/* Client */}
      <Row padBetween={1}>
        <Txt
          padLeft={0.2}
          singleLine
          widthGrows
          // scale={1.05} bold
        >
          {props.delivery.title}
        </Txt>

        <CallAndMapToIcons
          forceHintColor={props.delivery.isCompleted}
          phoneNumber={props.delivery.phoneNumber}
          address={props.delivery.address}
        />
        <Show when={!props.delivery.isCompleted}>
          <DeliveryCardOptionButtons delivery={props.delivery} />
        </Show>
      </Row>

      {/* Client Notes */}
      <Show
        when={
          exists(props.delivery._client?.notes) &&
          props.delivery._client.notes.trim().length > 0
        }
      >
        <Txt widthGrows>"{props.delivery._client?.notes}"</Txt>
      </Show>

      {/* Sub-Deliveries */}
      <For
        each={props.delivery.sortedSubDeliveries}
        fallback={
          <>
            <Box />
            {/* If there is only a little text it should be centered, if there is a
             * lot of text it should be left aligned. */}
            <Box widthGrows alignCenter>
              <Txt alignLeft stroke={$theme.colors.warning}>
                No Sub-Deliveries!
              </Txt>
            </Box>
          </>
        }
      >
        {(subDelivery) => <SubDeliveryRow subDelivery={subDelivery} />}
      </For>

      {/* Completion hint. */}
      <Show
        when={
          !props.delivery.isCompleted &&
          props.delivery.subDeliveries.count > 0 &&
          SubDelivery.numSubDeliveriesCompleted <= 0
        }
      >
        <Row stroke={$theme.colors.hint} alignTopLeft padBetween={0.25}>
          <Icon iconPath={mdiArrowUpLeft} scale={1.75} />
          <Txt>Tap the </Txt>
          <Box
            width={1}
            height={1}
            outlineSize={1 / 8}
            outlineColor={$theme.colors.hint}
            cornerRadius={1 / 7}
          ></Box>
          <Txt>to complete the delivery.</Txt>
        </Row>
      </Show>

      {/* <Box widthGrows height={0.125} fill={$theme.colors.text} /> */}

      <Show when={props.delivery.sortedSubDeliveries}>
        <For each={Array.from(totalPerFuelType.value.entries())}>
          {([FuelName, totalSalesWorth]) => (
            <Row>
              <Txt singleLine width={5} alignLeft>
                {FuelName}
              </Txt>
              <Txt widthGrows>${formatNumWithCommas(totalSalesWorth, 2)}</Txt>
            </Row>
          )}
        </For>
        <Show when={props.delivery.sortedSubDeliveries.length > 0}>
          <Row>
            <Txt bold alignLeft width={5}>
              Total:
            </Txt>
            <Txt widthGrows>${props.delivery.totalMoney}</Txt>
          </Row>
        </Show>
      </Show>

      {/* Notes */}
      <Show
        when={
          exists(props.delivery.notes) && props.delivery.notes.trim().length > 0
        }
      >
        <Txt widthGrows alignBottomLeft singleLine>
          {`Notes: ${props.delivery.notes.trim()}`}
        </Txt>
      </Show>
    </Card>
  );
}

export function SubDeliveryRow(props: { subDelivery: SubDelivery }) {
  const highlightColor = useFormula(() =>
    props.subDelivery.isCompleted
      ? $theme.colors.hint
      : props.subDelivery.isValid
        ? undefined
        : $theme.colors.warning,
  );
  return (
    <>
      {/* <Show when={props.subDelivery.isCompleted}>
        <Txt>
          {props.subDelivery.selectedKnownTank?.fuelType?.name}:
          {props.subDelivery.stickedInchesBeforeFilling}" -{">"}{" "}
          {props.subDelivery.stickedInchesAfterFilling}",
          {roundToString(
            getTankShape(
              props.subDelivery.selectedKnownTank?.shape,
            )?.calcTotalVolume(props.subDelivery.selectedKnownTank) ?? 0,
            0,
          )}{" "}
          gal. -{">"} {props.subDelivery.gallons} gal.
        </Txt>
      </Show> */}
      <Row alignTopLeft widthGrows>
        <Box
          /* We want the check box to be vertically centered with a single line of
           * text. However, the text is not vertically centered in its bounding box.
           * So we apply a slight offset here to vertically align the check box with
           * the first line of the description text. */
          padTop={0.045}
        >
          <Box
            onClick={() =>
              props.subDelivery.isCompleted
                ? pushPage(ConfirmSubDeliveryUncompletion, {
                    subDelivery: props.subDelivery,
                  })
                : pushPage(CompleteSubDeliveryDialog, {
                    subDelivery: props.subDelivery,
                  })
            }
            width={1}
            height={1}
            outlineSize={1 / 8}
            outlineColor={highlightColor.value ?? $theme.colors.primary}
            cornerRadius={1 / 7}
            fill={
              props.subDelivery.isCompleted ? $theme.colors.hint : undefined
            }
          >
            <Show when={props.subDelivery.isCompleted}>
              <Icon iconPath={mdiCheck} scale={0.8} stroke={mdColors.white} />
            </Show>
          </Box>
        </Box>
        <Txt
          widthGrows
          asTallAsParent
          overflowXWraps
          alignTopLeft
          stroke={highlightColor.value ?? $theme.colors.text}
        >
          {props.subDelivery.title}
        </Txt>
      </Row>
    </>
  );
}

function DeliveryCardOptionButtons(props: { delivery: Delivery }) {
  const isOpen = useProp(false);

  return (
    <HiddenOptions
      cancelOptions={{
        stroke: theme.palette.hint,
      }}
    >
      <HiddenOption
        padBetween={0.25}
        onClick={() =>
          pushPage(DeliveryPage, {
            delivery: props.delivery,
          })
        }
        stroke={$theme.colors.text}
        text={`Edit`}
        icon={mdiPencil}
      />
      <DeleteOption
        onClick={() =>
          pushPage(DeleteDialog, {
            obj: props.delivery,
            message: `Are you sure you want to permanently delete this delivery?`,
          })
        }
      />
    </HiddenOptions>
  );
}
