import {
  mdiAccount,
  mdiCheck,
  mdiIdentifier,
  mdiMapMarker,
  mdiPhone,
  mdiPlusMinusVariant,
  mdiTextBox,
} from "@mdi/js";
import {
  Box,
  BoxProps,
  Column,
  doNow,
  EnterKeyHint,
  exists,
  Field,
  FieldCapitalization,
  FieldInputType,
  FormatFieldInput,
  HiddenOption,
  Icon,
  KeyboardType,
  Label,
  NumField,
  Prop,
  Row,
  Selector,
  theme,
  Txt,
  useFormula,
  useProp,
} from "miwi";

import { formatPhoneNumber, formatIdNumber } from "@/utils";
import { Client, ClientPhoneNumber, WeekDays } from "./Client";
import { Component, For, onCleanup, Show, Switch } from "solid-js";
import { mfs } from "@/model/DataModel";

export function ClientFields(props: {
  autoFocusFirstField?: boolean;
  //client?: Prop<Client>;
  address: Prop<string>;
  name: Prop<string>;
  clientId: Prop<string>;
  phoneNumber: Prop<string>;
  rateOffset: Prop<number | null>;
  shouldScheduleDeliveriesForThisClient: Prop<Boolean>;
  weekday: Prop<WeekDays | null>;
  weeksBetweenScheduledDeliveries: Prop<number | null>;
  scheduledDeliveryStartDate: Prop<number | null>;
  assignedTo: Prop<string | null>;
  create?: boolean;
  notes: Prop<string>;
}) {
  const weekSelectorIsOpen = useProp(false);
  const daySelectorIsOpen = useProp(false);
  const dateSelectorIsOpen = useProp(false);
  const teamMemberSelectorIsOpen = useProp(false);

  // const addPhoneNumber = () => {
  //   props.client?.value.addPhoneNumber();
  // };
  // const deletePhoneNumber = (num: ClientPhoneNumber) => {
  //   props.client?.value.sortedAdditionalPhoneNumbers
  //     .find((phoneNumber) => phoneNumber === num)
  //     ?.deleteDoc();
  // };
  //const keyHintMap = new Map<string, EnterKeyHint>();

  const autoFocusFirstField = useProp(props.autoFocusFirstField ?? false);

  function enterKey(nextprop: Prop<string>, index: Prop<number>): EnterKeyHint {
    const key =
      props.create && nextprop.value.trim().length == 0 ? `next` : `done`;
    enterHintRefs.value.set(index.value, key);
    return key;
  }

  const focusOnID = useProp(false);
  const focusOnPhone = useProp(false);
  const focusOnAddress = useProp(false);
  const focusOnNotes = useProp(false);

  function getDeliveryDate(
    weeks: number,
    dayOfWeek: string,
    currentDate: Date,
  ): Date {
    const currentDayOfWeek = currentDate.getDay();
    const dayOfTheWeekNum =
      Object.values(WeekDays).indexOf(
        Object.values(WeekDays).find((day) => day === dayOfWeek)!,
      ) + 1;

    // Calculate the start date (first delivery date)
    let daysUntilStart = dayOfTheWeekNum - currentDayOfWeek;
    if (daysUntilStart < 0) {
      daysUntilStart += 7;
    }
    const originDate = new Date(currentDate);
    originDate.setDate(currentDate.getDate() + daysUntilStart);

    // Calculate the nth delivery date based on the number of weeks
    const deliveryStartDate = new Date(originDate);
    deliveryStartDate.setDate(originDate.getDate() + weeks * 7);
    return deliveryStartDate;
  }
  function formatStartDate(posixTime: number) {
    // Create a new Date object from the posix time
    let date = new Date(posixTime);

    // Array of day names
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Array of month names
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Get the day of the week, the month and the date
    let month = months[date.getMonth()];
    let day = date.getDate();

    // Add the ordinal suffix
    let suffix = "";
    switch (day % 10) {
      case 1:
        suffix = day === 11 ? "th" : "st";
        break;
      case 2:
        suffix = day === 12 ? "th" : "nd";
        break;
      case 3:
        suffix = day === 13 ? "th" : "rd";
        break;
      default:
        suffix = "th";
    }

    // Get the year
    let year = date.getFullYear();

    // Return the formatted string
    return `${month} ${day}${suffix}, ${year}`;
  }

  const fieldRefs: Prop<Map<number, HTMLDivElement>> = useProp(new Map());
  // filled in enterKey() function
  const enterHintRefs: Prop<Map<number, EnterKeyHint>> = useProp(new Map());
  const nameIndex = useProp(1);
  const idIndex = useProp(2);
  const phoneIndex = useProp(3);
  const addressIndex = useProp(4);
  const rateOffsetIndex = useProp(5);
  const notesIndex = useProp(6);

  return (
    <>
      <Field
        hasFocus={autoFocusFirstField}
        hintText={`Name`}
        iconPath={mdiAccount} //mdiDomain
        value={props.name}
        underlined
        capitalize={`words`}
        keyboard={"text"}
        enterKeyHint={
          useFormula(() => enterKey(props.clientId, nameIndex)).value
        }
        onlyWriteOnBlur
      />
      <Field
        hasFocus={focusOnID}
        hintText={`Client ID`}
        iconPath={mdiIdentifier}
        value={props.clientId}
        underlined
        formatInput={formatIdNumber}
        keyboard={"numeric"}
        enterKeyHint={
          useFormula(() => enterKey(props.phoneNumber, idIndex)).value
        }
        onlyWriteOnBlur
      />
      <Field
        hasFocus={focusOnPhone}
        hintText={`Phone`}
        iconPath={mdiPhone}
        value={props.phoneNumber}
        underlined
        formatInput={formatPhoneNumber}
        keyboard="tel"
        enterKeyHint={
          useFormula(() => enterKey(props.address, phoneIndex)).value
        }
        onlyWriteOnBlur
      />
      {/* <For each={props.client?.value.sortedAdditionalPhoneNumbers}>
        {(phoneNumber) => (
          <Box padLeft={1.2}>
            <Row>
              <Field
                hintText={`Name`}
                value={useFormula(
                  () => phoneNumber.name ?? "",
                  (v) => (phoneNumber.name = v),
                )}
                underlined
                capitalize={`words`}
                keyboard={"text"}
                width={4.8}
              />
              <Field
                hintText={`Number`}
                value={useFormula(
                  () => phoneNumber.number ?? "",
                  (v) => (phoneNumber.number = v),
                )}
                underlined
                formatInput={formatPhoneNumber}
                keyboard="tel"
              />
              <Icon
                stroke={theme.palette.error}
                iconPath={mdiTrashCanOutline}
                scale={1.3}
                onClick={() => deletePhoneNumber(phoneNumber)}
              />
            </Row>
          </Box>
        )}
      </For>
      <Show when={props.client}>
        <Row onClick={addPhoneNumber} padBetween={0.25}>
          <Icon
            stroke={theme.palette.primary}
            iconPath={mdiPlus}
            scale={1.25}
          />
          <Txt stroke={theme.palette.primary}>Add Phone Number</Txt>
        </Row>
      </Show> */}
      <Field
        hasFocus={focusOnAddress}
        hintText={`Address`}
        multiline
        iconPath={mdiMapMarker}
        value={props.address}
        underlined
        capitalize={`words`}
        keyboard={"text"}
        enterKeyHint={`enter`}
      />
      <NumField
        hint={`$0.00 / gal.`}
        icon={mdiPlusMinusVariant}
        value={props.rateOffset}
        underlined
        keyboard={"numeric"}
        enterKeyHint={
          useFormula(() => enterKey(props.notes, rateOffsetIndex)).value
        }
        negativesAreAllowed
        onlyWriteOnBlur
      />
      <Field
        hasFocus={focusOnNotes}
        hintText={`Notes, Gate Code, Key Tag`}
        multiline
        iconPath={mdiTextBox}
        value={props.notes}
        underlined
        capitalize={`sentences`}
        keyboard={"text"}
        enterKeyHint={`enter`}
      />

      {/* SECTION: Schedule Deliveries */}
      <Row alignTopLeft padBetween={0.25}>
        <Box
          bonusTouchArea
          width={1}
          height={1}
          outlineSize={1 / 8}
          cornerRadius={1 / 7}
          onClick={() => {
            props.shouldScheduleDeliveriesForThisClient.value =
              !props.shouldScheduleDeliveriesForThisClient.value;
          }}
          outlineColor={theme.palette.text}
        >
          <Show when={props.shouldScheduleDeliveriesForThisClient.value}>
            <Icon iconPath={mdiCheck} scale={0.8} stroke={theme.palette.text} />
          </Show>
        </Box>
        <Txt widthGrows alignTopLeft>
          Schedule deliveries
        </Txt>
      </Row>
      <Show when={props.shouldScheduleDeliveriesForThisClient.value}>
        <Label label="Every">
          <Selector
            value={props.weeksBetweenScheduledDeliveries.value}
            stroke={theme.palette.hint}
            getLabelForData={() =>
              !exists(props.weeksBetweenScheduledDeliveries.value)
                ? null
                : props.weeksBetweenScheduledDeliveries.value === 1
                  ? `week`
                  : `${props.weeksBetweenScheduledDeliveries.value} weeks`
            }
            isOpen={weekSelectorIsOpen}
            noneLabel="Pick frequency"
            cancelOptions={{
              stroke: theme.palette.hint,
            }}
          >
            <For each={Array.from(Array(4).keys()).map((i) => i + 1)}>
              {(numWeeks) => (
                <HiddenOption
                  onClick={() => {
                    props.weeksBetweenScheduledDeliveries.value = numWeeks;
                  }}
                >
                  {numWeeks === 1 ? `week` : `${numWeeks} weeks`}
                </HiddenOption>
              )}
            </For>
          </Selector>
        </Label>
        <Label label={`On`}>
          <Selector
            value={props.weekday.value}
            getLabelForData={() => props.weekday.value}
            noneLabel="Pick day of week"
            isOpen={daySelectorIsOpen}
            cancelOptions={{
              stroke: theme.palette.hint,
            }}
          >
            <For each={Array.from(Object.values(WeekDays)).filter(exists)}>
              {(day) => (
                <HiddenOption onClick={() => (props.weekday.value = day)}>
                  {day}
                </HiddenOption>
              )}
            </For>
          </Selector>
        </Label>
        <Label label="Starting on">
          <Selector
            value={props.scheduledDeliveryStartDate.value}
            stroke={theme.palette.hint}
            getLabelForData={(startDate) => {
              if (!exists(startDate)) return null;

              if (
                props.shouldScheduleDeliveriesForThisClient.value &&
                !props.scheduledDeliveryStartDate.value &&
                props.weekday.value &&
                props.weeksBetweenScheduledDeliveries.value
              ) {
                props.scheduledDeliveryStartDate.value = getDeliveryDate(
                  0,
                  props.weekday.value,
                  new Date(),
                ).valueOf();
              }

              return (
                `${formatStartDate(props.scheduledDeliveryStartDate.value!)}` ??
                null
              );
            }}
            noneLabel="Pick start date"
            isOpen={dateSelectorIsOpen}
            cancelOptions={{
              stroke: theme.palette.hint,
            }}
          >
            {[...Array(4).keys()].map((i) => {
              return (
                <HiddenOption
                  onClick={() => {
                    const deliveryStartDate = getDeliveryDate(
                      i,
                      props.weekday.value!,
                      new Date(),
                    );
                    props.scheduledDeliveryStartDate.value =
                      deliveryStartDate.valueOf();
                  }}
                >
                  {doNow(() => {
                    const deliveryStartDate = getDeliveryDate(
                      i,
                      props.weekday.value!,
                      new Date(),
                    );
                    return `${formatStartDate(deliveryStartDate.valueOf())}`;
                  })}
                </HiddenOption>
              );
            })}
          </Selector>
        </Label>
        <Label label="Driver">
          <Selector
            value={props.assignedTo.value}
            getLabelForData={(assignedUid) =>
              assignedUid === mfs.user.uid
                ? mfs.user.email
                : (mfs.user.workspace?.otherMembers?.find(
                    (member) => member.uid === assignedUid,
                  )?.email ?? null)
            }
            noneLabel="Assign to driver"
            isOpen={teamMemberSelectorIsOpen}
            cancelOptions={{
              stroke: theme.palette.hint,
            }}
          >
            <HiddenOption
              singleLine={false}
              onClick={() => (props.assignedTo.value = mfs.user.uid!)}
            >
              {mfs.user.email}
            </HiddenOption>
            <For each={mfs.user.workspace?.otherMembers}>
              {(member) => (
                <HiddenOption
                  singleLine={false}
                  onClick={() => (props.assignedTo.value = member.uid)}
                >
                  {member.email}
                </HiddenOption>
              )}
            </For>
          </Selector>
        </Label>
      </Show>
    </>
  );
}
