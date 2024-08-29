import {
  mdiAccount,
  mdiIdentifier,
  mdiMapMarker,
  mdiPhone,
  mdiPlusMinusVariant,
  mdiTextBox,
} from "@mdi/js";
import { EnterKeyHint, Field, NumField, Prop, useFormula, useProp } from "miwi";

import { formatPhoneNumber, formatIdNumber } from "@/utils";
import { onCleanup } from "solid-js";
import { FieldKeyHandler } from "@/AppData";

export function ClientFields(props: {
  autoFocusFirstField?: boolean;
  //client?: Prop<Client>;
  address: Prop<string>;
  name: Prop<string>;
  clientId: Prop<string>;
  phoneNumber: Prop<string>;
  rateOffset: Prop<number | null>;
  create?: boolean;
  notes: Prop<string>;
}) {
  const autoFocusFirstField = useProp(props.autoFocusFirstField ?? false);

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
        hasFocus={autoFocusFirstField}
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
        negativesAreAllowed
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
    </>
  );
}
