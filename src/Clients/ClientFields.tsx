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
  EnterKeyHint,
  exists,
  Field,
  HiddenOption,
  Icon,
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
import { getWeekDayAsJsDayOfWeek, WeekDay } from "./Client";
import { For, Show } from "solid-js";
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
  weekday: Prop<WeekDay | null>;
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

  const possibleScheduleStartDates = useFormula(() => {
    if (!exists(props.weeksBetweenScheduledDeliveries.value)) return [];
    if (!exists(props.weekday.value)) return [];
    const selectedDayOfWeek = getWeekDayAsJsDayOfWeek(props.weekday.value!);
    const currentDayOfWeek = new Date().getDay();
    const daysUntilStart = selectedDayOfWeek - currentDayOfWeek;
    const start = new Date();
    start.setDate(start.getDate() + daysUntilStart);
    const startDates = [];
    for (let i = 0; i < props.weeksBetweenScheduledDeliveries.value; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i * 7);
      startDates.push(date);
    }
    return startDates.map((date) => date.valueOf());
  });
  function getDeliveryDate(
    weeks: number,
    dayOfWeek: string,
    currentDate: Date,
  ): Date {
    const currentDayOfWeek = currentDate.getDay();
    const dayOfTheWeekNum =
      Object.values(WeekDay).indexOf(
        Object.values(WeekDay).find((day) => day === dayOfWeek)!,
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
        keyboard={"decimal"}
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
            hintText="Pick frequency"
            cancelOptions={{
              stroke: theme.palette.hint,
            }}
          >
            <For each={Array.from(Array(8).keys()).map((i) => i + 1)}>
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
            hintText="Pick day of week"
            isOpen={daySelectorIsOpen}
            cancelOptions={{
              stroke: theme.palette.hint,
            }}
          >
            <For each={Array.from(Object.values(WeekDay)).filter(exists)}>
              {(day) => (
                <HiddenOption onClick={() => (props.weekday.value = day)}>
                  {day}
                </HiddenOption>
              )}
            </For>
          </Selector>
        </Label>
        <Show
          when={
            exists(props.weeksBetweenScheduledDeliveries.value) &&
            props.weeksBetweenScheduledDeliveries.value > 1 &&
            exists(props.weekday.value)
          }
        >
          <Label label="Starting on">
            <Selector
              value={props.scheduledDeliveryStartDate.value}
              stroke={theme.palette.hint}
              getLabelForData={(startDate) =>
                exists(startDate) ? formatStartDate(startDate) : null
              }
              hintText="Pick start date"
              noOptionsText={"Select frequency and day of week first."}
              isOpen={dateSelectorIsOpen}
              cancelOptions={{ stroke: theme.palette.hint }}
            >
              <For each={possibleScheduleStartDates.value}>
                {(date) => (
                  <HiddenOption
                    onClick={() =>
                      (props.scheduledDeliveryStartDate.value = date)
                    }
                  >
                    {formatStartDate(date)}
                  </HiddenOption>
                )}
              </For>
            </Selector>
          </Label>
        </Show>
        <Label label="Driver">
          <Selector
            value={props.assignedTo.value}
            getLabelForData={(assignedUid) =>
              assignedUid === mfs.user.uid
                ? mfs.user.email
                : mfs.user.workspace?.otherMembers?.find(
                    (member) => member.uid === assignedUid,
                  )?.email ?? null
            }
            hintText="Assign to driver"
            isOpen={teamMemberSelectorIsOpen}
            cancelOptions={{
              stroke: theme.palette.hint,
            }}
          >
            {/* TODO: These should wrap, but that is not working in Selectors right now. */}
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
