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
  Field,
  FieldCapitalization,
  FieldInputType,
  FormatFieldInput,
  Icon,
  KeyboardType,
  Label,
  NumField,
  Prop,
  Row,
  Selector,
  Txt,
  useFormula,
  useProp
} from "miwi";

import { formatPhoneNumber, formatIdNumber } from "@/utils";
import { Client, ClientPhoneNumber, WeekDays } from "./Client";
import { Component, For, onCleanup, Show, Switch } from "solid-js";
import {IndexedField, IndexedFieldKeyHandler} from "@/components/IndexedField";

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
  create?: boolean;
  notes: Prop<string>;
}) {
  const weekSelectorIsOpen = useProp(false);
  const daySelectorIsOpen = useProp(false);
  const dateSelectorIsOpen = useProp(false);

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

  function enterKey(nextprop: Prop<string>, index:Prop<number>): EnterKeyHint {
    const key = props.create && nextprop.value.trim().length == 0 ? `next` : `done`;
    enterHintRefs.value.set(index.value, key);
    return key;
  }

  const focusOnID = useProp(false);
  const focusOnPhone = useProp(false);
  const focusOnAddress = useProp(false);
  const focusOnNotes = useProp(false);

  onCleanup(() => {
    document.removeEventListener("keydown", (event) => IndexedFieldKeyHandler(event, fieldRefs, enterHintRefs));
  });
  //document.addEventListener("keydown", FieldKeyHandler);

  function getDeliveryDates(
    weeks: number,
    dayOfWeek: string,
    currentDate: Date,
  ): (Date) {
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
    return `Week of ${month} ${day}${suffix}, ${year}`;
  }
  document.addEventListener("keydown", (event) => IndexedFieldKeyHandler(event, fieldRefs, enterHintRefs));
  const fieldRefs: Prop<Map<number,HTMLDivElement>> = useProp(new Map());
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
      <IndexedField refs={fieldRefs} index={nameIndex}>
        <Field
          hasFocus={autoFocusFirstField}
          hintText={`Name`}
          iconPath={mdiAccount} //mdiDomain
          value={props.name}
          underlined
          capitalize={`words`}
          keyboard={"text"}
          enterKeyHint={ useFormula(() => enterKey(props.clientId, nameIndex)).value }
          onlyWriteOnBlur
        />
      </IndexedField>
      <IndexedField refs={fieldRefs} index={idIndex}>
        <Field
          hasFocus={focusOnID}
          hintText={`Client ID`}
          iconPath={mdiIdentifier}
          value={props.clientId}
          underlined
          formatInput={formatIdNumber}
          keyboard={"numeric"}
          enterKeyHint={ useFormula(() => enterKey(props.phoneNumber, idIndex)).value }
          onlyWriteOnBlur
        />
      </IndexedField>
      <IndexedField refs={fieldRefs} index={phoneIndex}>
        <Field
          hasFocus={focusOnPhone}
          hintText={`Phone`}
          iconPath={mdiPhone}
          value={props.phoneNumber}
          underlined
          formatInput={formatPhoneNumber}
          keyboard="tel"
          enterKeyHint={ useFormula(() => enterKey(props.address, phoneIndex)).value }
          onlyWriteOnBlur
        />
      </IndexedField>
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
                stroke={$theme.colors.error}
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
            stroke={$theme.colors.primary}
            iconPath={mdiPlus}
            scale={1.25}
          />
          <Txt stroke={$theme.colors.primary}>Add Phone Number</Txt>
        </Row>
      </Show> */}
      <IndexedField refs={fieldRefs} index={addressIndex}>
        <Field
          hasFocus={focusOnAddress}
          hintText={`Address`}
          multiline
          iconPath={mdiMapMarker}
          value={props.address}
          underlined
          capitalize={`words`}
          keyboard={"text"}
          enterKeyHint={ `enter` }
        />
      </IndexedField>
      <IndexedField refs={fieldRefs} index={rateOffsetIndex}>
        <NumField
          hint={`$0.00 / gal.`}
          icon={mdiPlusMinusVariant}
          value={props.rateOffset}
          underlined
          keyboard={"numeric"}
          enterKeyHint={ useFormula(() => enterKey(props.notes, rateOffsetIndex)).value }
          negativesAreAllowed
          onlyWriteOnBlur
        />
      </IndexedField>
      <IndexedField refs={fieldRefs} index={notesIndex}>
        <Field
          hasFocus={focusOnNotes}
          hintText={`Notes, Gate Code, Key Tag`}
          multiline
          iconPath={mdiTextBox}
          value={props.notes}
          underlined
          capitalize={`sentences`}
          keyboard={"text"}
          enterKeyHint={ `enter` }
        />
      </IndexedField>
      <Row alignTopLeft padBetween={0.35}>
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
          outlineColor={$theme.colors.text}
          // outlineColor={props.shouldScheduleDeliveriesForThisClient.value ? $theme.colors.hint : $theme.colors.primary}
          // fill={
          //   props.shouldScheduleDeliveriesForThisClient.value ? $theme.colors.hint : undefined
          // }
        >
          <Show when={props.shouldScheduleDeliveriesForThisClient.value}>
            <Icon iconPath={mdiCheck} scale={0.8} stroke={$theme.colors.text} />
          </Show>
        </Box>
        <Txt widthGrows alignTopLeft>
          Schedule deliveries
        </Txt>
      </Row>
      <Row>
        <Show when={props.shouldScheduleDeliveriesForThisClient.value}>
          <Label label="Every">
            <Box width={3.7}>
              <Selector
                value={props.weeksBetweenScheduledDeliveries.value}
                stroke={$theme.colors.hint}
                getLabelForData={() =>
                  `${props.weeksBetweenScheduledDeliveries.value ?? `#`} wk` ??
                  null
                }
                isOpen={weekSelectorIsOpen}
                noneLabel="# wk"
                dropDownWidth={6}
              >
                {[...Array(4).keys()].map((i) => (
                  <Txt
                    stroke={
                      props.weeksBetweenScheduledDeliveries.value === i + 1
                        ? $theme.colors.primary
                        : "inherit"
                    }
                    onClick={() => {
                      props.weeksBetweenScheduledDeliveries.value = i + 1;
                    }}
                  >
                    {i + 1} wk
                  </Txt>
                ))}
              </Selector>
            </Box>
            <Txt>on </Txt>
            <Box width={7}>
              <Selector
                value={props.weekday.value}
                getLabelForData={() => props.weekday.value}
                noneLabel="day"
                isOpen={daySelectorIsOpen}
                dropDownWidth={8}
              >
                <For each={Array.from(Object.values(WeekDays))}>
                  {(day) => (
                    <Txt
                      stroke={
                        props.weekday.value === day
                          ? $theme.colors.primary
                          : "inherit"
                      }
                      onClick={() => {
                        props.weekday.value = day;
                      }}
                    >
                      {day}
                    </Txt>
                  )}
                </For>
              </Selector>
            </Box>
          </Label>
        </Show>
      </Row>
      <Show when={props.shouldScheduleDeliveriesForThisClient.value}>
        <Row padBetween={0.25}>
          <Txt>Starting on: </Txt>
          <Selector
            value={props.scheduledDeliveryStartDate.value}
            stroke={$theme.colors.hint}
            getLabelForData={() =>
              `${formatStartDate(props.scheduledDeliveryStartDate.value!)}` ?? null
            }
            isOpen={dateSelectorIsOpen}
          >
            {[...Array(4).keys()].map((i) => {
              return (
                <Txt
                  widthGrows
                  onClick={() => {
                    const deliveryStartDate = getDeliveryDates(
                      i,
                      props.weekday.value!,
                      new Date(),
                    );
                    props.scheduledDeliveryStartDate.value = deliveryStartDate.valueOf();
                  }}
                >
                  {doNow(() => {
                    const deliveryStartDate = getDeliveryDates(
                      i,
                      props.weekday.value!,
                      new Date(),
                    )
                    return `${formatStartDate(deliveryStartDate.valueOf())}`;
                  })}
                </Txt>
              );
            })}
          </Selector>
        </Row>
      </Show>
    </>
  );
}
