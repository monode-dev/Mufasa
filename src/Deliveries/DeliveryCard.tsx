import {
  mdiPencil,
  mdiCheck,
  mdiMapMarker,
  mdiPhoneInTalk,
  mdiArrowUpLeft,
} from "@mdi/js";
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
  doWatch,
} from "miwi";
import { DeliveryPage } from "./DeliveryPage";
import { For, Show } from "solid-js";
import CompleteSubDeliveryDialog from "./CompleteSubDelivery.dialog";
import { Delivery, SubDelivery } from "./Delivery";
import DeleteDialog from "@/components/DeleteDialog";
import { CallAndMapButtons } from "@/Clients/CallAndMapToButtons";
import {
  callPhoneNumber,
  canCallPhoneNumber,
  canMapToAddress,
  mapToAddress,
} from "@/AppData";
import { HiddenOption, HiddenOptions } from "@/components/HiddenOptions";
import { ConfirmSubDeliveryUncompletion } from "./ConfirmSubDeliveryUncompletion";

export function DeliveryCard(props: { delivery: Delivery }) {
  const shouldShowCompleteDate = useFormula(() => props.delivery.isCompleted);
  const optionsButtonNextToCompleteDate = useFormula(
    () => shouldShowCompleteDate.value,
  );
  const shouldShowNotes = useFormula(
    () =>
      exists(props.delivery.notes) && props.delivery.notes.trim().length > 0,
  );
  const optionsButtonNextToNotes = useFormula(
    () =>
      !optionsButtonNextToCompleteDate.value && shouldShowNotes.value && false,
  );
  const optionsButtonNextToClient = useFormula(
    () =>
      !optionsButtonNextToCompleteDate.value && !optionsButtonNextToNotes.value,
  );

  doWatch(() => {
    props.delivery.sortedSubDeliveries;
    console.log(
      `subDeliveries updated: ${Date.now() - (window as any).startTime}`,
    );
  });
  const noFocus = useProp(false);
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
      <Show when={shouldShowCompleteDate.value}>
        <Row>
          <Txt singleLine widthGrows>
            {formatPosixTime(props.delivery.completedTimePosix!)}
          </Txt>
          <DeliveryCardOptionButtons
            show={optionsButtonNextToCompleteDate.value}
            delivery={props.delivery}
          />
        </Row>
      </Show>

      {/* Client */}
      <Row>
        <Txt
          padLeft={0.2}
          singleLine
          widthGrows
          // scale={1.05} bold
        >
          {props.delivery.title}
        </Txt>
        <DeliveryCardOptionButtons
          show={optionsButtonNextToClient.value}
          delivery={props.delivery}
        />
      </Row>

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
          props.delivery.subDeliveries.count > 0 &&
          SubDelivery.numSubDeliveriesCompleted <= 0
        }
      >
        <Row stroke={$theme.colors.hint} alignTopLeft padBetween={0.25}>
          <Icon iconPath={mdiArrowUpLeft} scale={1.75} />
          <Txt>Tap here to complete the delivery.</Txt>
        </Row>
      </Show>

      {/* Total */}
      <Show when={props.delivery.isCompleted}>
        <Txt singleLine widthGrows bold>
          Total: ${props.delivery.totalMoney}
        </Txt>
      </Show>

      {/* Notes */}
      <Show when={shouldShowNotes.value}>
        <Row>
          <Txt widthGrows alignBottomLeft singleLine>
            {`Notes: ${props.delivery.notes.trim()}`}
          </Txt>
          <DeliveryCardOptionButtons
            show={optionsButtonNextToNotes.value}
            delivery={props.delivery}
          />
        </Row>
      </Show>

      {/* Call and Map */}
      <Show when={!props.delivery.isCompleted}>
        <Box />
        <CallAndMapButtons
          phoneNumber={props.delivery.phoneNumber}
          address={props.delivery.address}
        />
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
    <Row alignTopLeft widthGrows>
      <Box
        /* We want the check box to be vertically centered with a single line of
         * text. However, the text is not vertically centered in its bounding box.
         * So we apply a slight offset here to vertically align the check box with
         * the first line of the description text. */
        padTop={0.045}
      >
        <Box
          bonusTouchArea
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
          fill={props.subDelivery.isCompleted ? $theme.colors.hint : undefined}
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
  );
}

function DeliveryCardOptionButtons(props: {
  show: boolean;
  delivery: Delivery;
}) {
  const isOpen = useProp(false);

  function handleEdit() {
    pushPage(DeliveryPage, {
      delivery: props.delivery,
    });
  }

  function handleDelete() {
    pushPage(DeleteDialog, {
      obj: props.delivery,
      message: `Are you sure you want to permanently delete this delivery?`,
    });
  }

  return (
    <Show when={props.show}>
      <HiddenOptions
        showIcons
        isOpen={isOpen}
        onDelete={() => {
          handleDelete();
        }}
      >
        <HiddenOption
          alignCenterLeft
          padBetween={0.25}
          onClick={() => {
            isOpen.value = false;
            handleEdit();
          }}
          stroke={$theme.colors.text}
          text={`Edit`}
          icon={mdiPencil}
        />
        <Show when={canCallPhoneNumber(props.delivery.phoneNumber)}>
          <HiddenOption
            alignCenterLeft
            padBetween={0.25}
            onClick={() => {
              isOpen.value = false;
              if (canCallPhoneNumber(props.delivery.phoneNumber))
                callPhoneNumber(props.delivery.phoneNumber);
            }}
            stroke={
              canCallPhoneNumber(props.delivery.phoneNumber)
                ? $theme.colors.text
                : $theme.colors.hint
            }
            text={`Call`}
            icon={mdiPhoneInTalk}
          />
        </Show>
        <Show when={canMapToAddress(props.delivery.address)}>
          <HiddenOption
            alignCenterLeft
            padBetween={0.25}
            onClick={() => {
              isOpen.value = false;
              if (canMapToAddress(props.delivery.address))
                mapToAddress(props.delivery.phoneNumber);
            }}
            stroke={
              canMapToAddress(props.delivery.address)
                ? $theme.colors.text
                : $theme.colors.hint
            }
            text={`Map`}
            icon={mdiMapMarker}
          />
        </Show>
      </HiddenOptions>
    </Show>
  );
}
