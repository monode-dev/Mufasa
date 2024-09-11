import {
  mdiArrowUpLeft,
  mdiCalculator,
  mdiChevronLeft,
  mdiChevronDown,
} from "@mdi/js";
import {
  Box,
  Card,
  Row,
  Txt,
  Icon,
  exists,
  pushPage,
  useProp,
  theme,
  doNow,
} from "miwi";
import { For, Show } from "solid-js";
import { CallAndMapToIcons } from "@/Clients/CallAndMapToIcons";
import { formatNumWithCommas, formatPosixTime } from "@/utils";
import { CalculateFillDialog } from "@/Calculator/CalculateFillDialog";
import { Delivery, SubDelivery } from "../Delivery";
import { EditDeliveryPage } from "../EditDeliveryPage";
import { CheckableSubDelivery } from "./DeliveryCard.tsx.folder/CheckableSubDelivery";
import { HorizontalDivider } from "@/components/HorizontalDivider";
import { TotalsForDelivery } from "./DeliveryCard.tsx.folder/TotalsForDelivery";

export function DeliveryCard(props: { delivery: Delivery }) {
  const isExpanded = useProp(
    // Only auto expand if this delivery has been recently completed.
    (props.delivery.completedTimePosix ?? 0) > Delivery.threeAm.getTime(),
  );

  return (
    <Card
      alignTopLeft
      padBetween={0.5}
      preventClickPropagation
      stroke={props.delivery.isCompleted ? $theme.colors.hint : undefined}
      onClick={() =>
        pushPage(EditDeliveryPage, {
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
          <Icon
            scale={1.25}
            onClick={() => (isExpanded.value = !isExpanded.value)}
            iconPath={isExpanded.value ? mdiChevronDown : mdiChevronLeft}
          />
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

        {/* TODO: This should be map, calculate, call, edit. */}
        <Show when={!props.delivery.isCompleted}>
          <Icon
            stroke={theme.palette.primary}
            onClick={() =>
              pushPage(CalculateFillDialog, { delivery: props.delivery })
            }
            iconPath={mdiCalculator}
          />

          <CallAndMapToIcons
            forceHintColor={props.delivery.isCompleted}
            phoneNumber={props.delivery.phoneNumber}
            address={props.delivery.address}
          />
        </Show>
      </Row>

      {/* Client Notes */}
      <Show
        when={
          !props.delivery.isCompleted &&
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
        {(subDelivery) => (
          <CheckableSubDelivery
            subDelivery={subDelivery}
            showCard={isExpanded.value}
          />
        )}
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

      {/* Totals */}
      <Show
        when={isExpanded.value && props.delivery.sortedSubDeliveries.length > 0}
      >
        <HorizontalDivider />
        <TotalsForDelivery delivery={props.delivery} />
      </Show>
    </Card>
  );
}
