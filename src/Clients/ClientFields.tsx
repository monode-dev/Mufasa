import {
  mdiAccount,
  mdiCheck,
  mdiIdentifier,
  mdiLockPercent,
  mdiMapMarker,
  mdiPhone,
  mdiPlus,
  mdiPlusMinusVariant,
  mdiTextBox,
  mdiTrashCanOutline,
} from "@mdi/js";
import {
  Box,
  BoxProps,
  Column,
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
  useProp,
} from "miwi";

import { formatPhoneNumber, formatIdNumber } from "@/utils";
import { Client, ClientPhoneNumber, WeekDays } from "./Client";
import { Component, For, onCleanup, Show, Switch } from "solid-js";
import { FieldKeyHandler } from "@/AppData";

export function ClientFields(props: {
  firstFieldHasFocus?: Prop<boolean>;
  //client?: Prop<Client>;
  address: Prop<string>;
  name: Prop<string>;
  clientId: Prop<string>;
  phoneNumber: Prop<string>;
  rateOffset: Prop<number | null>;
  shouldScheduleDeliveriesForThisClient: Prop<Boolean>;
  weekday: Prop<WeekDays | null>;
  weeksBetweenScheduledDeliveries: Prop<number | null>;
  create?: boolean;
  notes: Prop<string>;
}) {
  const firstFocus = props.firstFieldHasFocus ?? useProp(true);
  const weekSelectorIsOpen = useProp(false);
  const daySelectorIsOpen = useProp(false);

  // const addPhoneNumber = () => {
  //   props.client?.value.addPhoneNumber();
  // };
  // const deletePhoneNumber = (num: ClientPhoneNumber) => {
  //   props.client?.value.sortedAdditionalPhoneNumbers
  //     .find((phoneNumber) => phoneNumber === num)
  //     ?.deleteDoc();
  // };
  const keyHintMap = new Map<string, EnterKeyHint>();

  function enterKey(nextprop: Prop<string>): EnterKeyHint {
    const key =
      props.create && nextprop.value.trim().length == 0 ? `next` : `done`;
    // keyHintMap.set(curprop.value, key);
    console.log("key: ", key);
    return key;
  }

  const focusOnID = useProp(false);
  const focusOnPhone = useProp(false);
  const focusOnAddress = useProp(false);
  const focusOnNotes = useProp(false);

  onCleanup(() => {
    document.removeEventListener("keydown", FieldKeyHandler);
  });
  document.addEventListener("keydown", FieldKeyHandler);

  return (
    <>
      <Field
        hasFocus={firstFocus}
        hintText={`Name`}
        iconPath={mdiAccount} //mdiDomain
        value={props.name}
        underlined
        capitalize={`words`}
        keyboard={"text"}
        enterKeyHint={useFormula(() => enterKey(props.clientId)).value}
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
        enterKeyHint={useFormula(() => enterKey(props.phoneNumber)).value}
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
        enterKeyHint={useFormula(() => enterKey(props.address)).value}
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
      <Field
        hasFocus={focusOnAddress}
        hintText={`Address`}
        multiline
        iconPath={mdiMapMarker}
        value={props.address}
        underlined
        capitalize={`words`}
        keyboard={"text"}
        enterKeyHint={useFormula(() => enterKey(props.notes)).value}
        onlyWriteOnBlur
      />
      <NumField
        hint={`$0.00 / gal.`}
        icon={mdiPlusMinusVariant}
        value={props.rateOffset}
        underlined
        keyboard={"numeric"}
        enterKeyHint={`done`}
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
        onlyWriteOnBlur
      />
      <Row alignTopLeft padBetween={0.35}>
        <Box 
          bonusTouchArea
          width={1}
          height={1}
          outlineSize={1 / 8} 
          cornerRadius={1 / 7}
          onClick={() => {
            props.shouldScheduleDeliveriesForThisClient.value = !props.shouldScheduleDeliveriesForThisClient.value;
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
              getLabelForData={() => `${props.weeksBetweenScheduledDeliveries.value ?? `#`} wk` ?? null} 
              isOpen={weekSelectorIsOpen}
              noneLabel='# wk'
              dropDownWidth={6}
            >
              {[...Array(4).keys()].map(i => (
                <Txt 
                stroke={props.weeksBetweenScheduledDeliveries.value === i + 1 ? $theme.colors.primary : 'inherit'}
                onClick={() => {
                  props.weeksBetweenScheduledDeliveries.value = i + 1;
                }}>
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
              noneLabel='day'
              isOpen={daySelectorIsOpen} 
              dropDownWidth={8}
            >
              <Txt stroke={props.weekday.value === WeekDays.monday ? $theme.colors.primary : 'inherit'} onClick={() => {
                props.weekday.value = WeekDays.monday;
              }}>
                Monday
              </Txt>
              <Txt stroke={props.weekday.value === WeekDays.tuesday ? $theme.colors.primary : 'inherit'} onClick={() => {
                props.weekday.value = WeekDays.tuesday;
              }}>
                Tuesday
              </Txt>
              <Txt stroke={props.weekday.value === WeekDays.wednesday ? $theme.colors.primary : 'inherit'} onClick={() => {
                props.weekday.value = WeekDays.wednesday;
              }}>
                Wednesday
              </Txt>
              <Txt stroke={props.weekday.value === WeekDays.thursday ? $theme.colors.primary : 'inherit'} onClick={() => {
                props.weekday.value = WeekDays.thursday;
              }}>
                Thursday
              </Txt>
              <Txt stroke={props.weekday.value === WeekDays.friday ? $theme.colors.primary : 'inherit'} onClick={() => {
                props.weekday.value = WeekDays.friday;
              }}>
                Friday
              </Txt>
              <Txt stroke={props.weekday.value === WeekDays.saturday ? $theme.colors.primary : 'inherit'} onClick={() => {
                props.weekday.value = WeekDays.saturday;
              }}>
                Saturday
              </Txt>
              <Txt stroke={props.weekday.value === WeekDays.sunday ? $theme.colors.primary : 'inherit'} onClick={() => {
                props.weekday.value = WeekDays.sunday;
              }}>
                Sunday
              </Txt>
            </Selector>
          </Box>
          </Label>
        </Show>
      </Row>
    </>
  );
}
