import {
  mdiAccount,
  mdiIdentifier,
  mdiMapMarker,
  mdiPhone,
  mdiPlus,
  mdiTextBox,
  mdiTrashCanOutline,
} from "@mdi/js";
import {
  Box,
  BoxProps,
  EnterKeyHint,
  Field, FieldCapitalization,
  FieldInputType,
  FormatFieldInput,
  Icon, KeyboardType,
  Prop,
  Row,
  Txt,
  useFormula,
  useProp
} from "miwi";

import { formatPhoneNumber, formatIdNumber } from "@/utils";
import { Client, ClientPhoneNumber } from "./Client";
import {Component, For, onCleanup, Show} from "solid-js";

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

  interface FieldProps {
    value?: Prop<string>;
    /* We use to use this to let people track the value before blur, but now that we
     * have "onlyWriteOnBlur" I don't think we need it. */
    // tempValue?: Prop<string>;
    onlyWriteOnBlur?: boolean;
    hasFocus?: Prop<boolean>;
    hintText?: string;
    hintColor?: string;
    maxLines?: number;
    multiline?: boolean;
    underlined?: boolean;
    scale?: number;
    iconPath?: string;
    keyboard?: KeyboardType;
    h1?: boolean;
    h2?: boolean;
    capitalize?: FieldCapitalization;
    inputType?: FieldInputType;
    onBlur?: () => void;
    validateNextInput?: (nextInput: string) => boolean;
    formatInput?: FormatFieldInput;
    enterKeyHint?: EnterKeyHint;
  }

  const firstFocus = props.firstFieldHasFocus ?? useProp(true);

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
    console.log("key: ", key);
    return key;
  }

  const focusOnID = useProp(false);
  const focusOnPhone = useProp(false);
  const focusOnAddress = useProp(false);
  const focusOnNotes = useProp(false);

  const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    const target = event.target as HTMLElement;
    const field = event.target as unknown as FieldProps;
    console.log("field: ", field);
    const enterKeyHint = field.enterKeyHint;
    console.log("enterKeyHint: ", enterKeyHint);

    if (enterKeyHint === 'done') return;

    // if (enterKeyHint === 'next') // currently broken
    {
      const form = document;
      if (form) {
        const focusableElements = Array.from(
          form.querySelectorAll<HTMLElement>(
            'input, select, textarea, button, [tabindex]:not([tabindex="-1"])'
          )
        ).filter(el => !el.hasAttribute('disabled'));

        const index = focusableElements.indexOf(target);
        if (index > -1 && index < focusableElements.length - 1) {
          const nextElement = focusableElements[index + 1];

          // workaround for broken enterKeyHint === 'next'
          const nextField = nextElement as unknown as FieldProps; // does not get the Field we think it should
          // thus this always succeeds to find no data in the next field
          if ((nextField.value?.value?.trim().length ?? 0) == 0) {
            // this section should be dropped into the parent if when the enterKeyHint === 'next' is fixed
            nextElement.focus();
            event.preventDefault(); // Prevent form submission
            ///
          }
        }
      }
    }
  }
};

  onCleanup(() => {
    document.removeEventListener("keydown", handleKeyDown);
  });

  document.addEventListener("keydown", handleKeyDown);

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
        enterKeyHint={ useFormula(() => enterKey(props.clientId )).value}
      />
      <Field
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
