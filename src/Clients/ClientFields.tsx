import {
  mdiAccount,
  mdiIdentifier,
  mdiMapMarker,
  mdiPhone,
  mdiPlus,
  mdiTextBox,
  mdiTrashCanOutline,
} from "@mdi/js";
import {Box, EnterKeyHint, Field, Icon, Prop, Row, Txt, useFormula, useProp} from "miwi";

import { formatPhoneNumber, formatIdNumber } from "@/utils";
import { Client, ClientPhoneNumber } from "./Client";
import {For, onCleanup, Show} from "solid-js";

export function ClientFields(props: {
  firstFieldHasFocus?: Prop<boolean>;
  //client?: Prop<Client>;
  address: Prop<string>;
  name: Prop<string>;
  clientId: Prop<string>;
  phoneNumber: Prop<string>;
  create?: boolean;
  notes: Prop<string>;
}) {
  const firstFocus = props.firstFieldHasFocus ?? useProp(true);
  const fieldRefs = useProp<Array<HTMLDivElement | null>>([]);
  let currentIndex = 0;

  function assignRef(el: HTMLDivElement | null) {
    if (el) {
      const index = ++currentIndex;
      (el as any).index = index;
      el.classList.add('field-component');
      fieldRefs.value[index] = el;
    }
    return el;
  }

  // const addPhoneNumber = () => {
  //   props.client?.value.addPhoneNumber();
  // };
  // const deletePhoneNumber = (num: ClientPhoneNumber) => {
  //   props.client?.value.sortedAdditionalPhoneNumbers
  //     .find((phoneNumber) => phoneNumber === num)
  //     ?.deleteDoc();
  // };

  function enterKey(prop: Prop<string>): EnterKeyHint {
     const key = props.create && prop.value.trim().length == 0 ? `next` : `done`;
    // console.log("key: ", key);
    return key;
  }

  const focusOnID = useProp(false);
  const focusOnPhone = useProp(false);
  const focusOnAddress = useProp(false);
  const focusOnNotes = useProp(false);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      let target = event.target as HTMLElement;
      while (target && !target.classList.contains('field-component')) {
        target = target.parentElement as HTMLElement;
      }
      if (target) {
        const index = (target as any).index;
        console.log("change focus to next field: ", index);
        if (index !== undefined && index < fieldRefs.value.length - 1) {
          const nextField = fieldRefs.value[index + 1];
          if (nextField) {
            requestAnimationFrame(() => {
              nextField.focus();
              console.log("focus on: ", nextField);
            });
            event.preventDefault(); // Prevent form submission
          }
        }
      }
    }
    console.log("key event: ", event.key);
  };

  onCleanup(() => {
    document.removeEventListener("keydown", handleKeyDown);
  });

  document.addEventListener("keydown", handleKeyDown);

  return (
    <>
      <Field
        ref={assignRef}
        hasFocus={firstFocus}
        hintText={`Name`}
        iconPath={mdiAccount} //mdiDomain
        value={props.name}
        underlined
        capitalize={`words`}
        keyboard={"text"}
        enterKeyHint={ useFormula(() => enterKey(props.clientId)).value}
      />
      <Field
        ref={assignRef}
        hasFocus={focusOnID}
        hintText={`Client ID`}
        iconPath={mdiIdentifier}
        value={props.clientId}
        underlined
        formatInput={formatIdNumber}
        keyboard={"numeric"}
        enterKeyHint={ useFormula(() => enterKey(props.phoneNumber)).value }
      />
      <Field
        ref={assignRef}
        hasFocus={focusOnPhone}
        hintText={`Phone`}
        iconPath={mdiPhone}
        value={props.phoneNumber}
        underlined
        formatInput={formatPhoneNumber}
        keyboard="tel"
        enterKeyHint={ useFormula(() => enterKey(props.address)).value }
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
        ref={assignRef}
        hasFocus={focusOnAddress}
        hintText={`Address`}
        multiline
        iconPath={mdiMapMarker}
        value={props.address}
        underlined
        capitalize={`words`}
        keyboard={"text"}
        enterKeyHint={ useFormula(() => enterKey(props.notes)).value }
      />
      <Field
        ref={assignRef}
        hasFocus={focusOnNotes}
        hintText={`Notes`}
        multiline
        iconPath={mdiTextBox}
        value={props.notes}
        underlined
        capitalize={`sentences`}
        keyboard={"text"}
        enterKeyHint={`enter`}
      />
    </>
  );
}
