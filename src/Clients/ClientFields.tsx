import {
  mdiAccount,
  mdiIdentifier,
  mdiMapMarker,
  mdiPhone,
  mdiTextBox,
} from "@mdi/js";
import {
  EnterKeyHint,
  Field,
  Prop,
  useFormula,
  useProp
} from "miwi";

import { formatPhoneNumber, formatIdNumber } from "@/utils";
import { onCleanup, } from "solid-js";
import {IndexedField, IndexedFieldKeyHandler} from "@/components/IndexedField";

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

  function enterKey(nextprop: Prop<string>): EnterKeyHint {
    const key = props.create && nextprop.value.trim().length == 0 ? `next` : `done`;
    console.log("key: ", key);
    return key;
  }

  const focusOnID = useProp(false);
  const focusOnPhone = useProp(false);
  const focusOnAddress = useProp(false);
  const focusOnNotes = useProp(false);

  onCleanup(() => {
    document.removeEventListener("keydown", IndexedFieldKeyHandler);
  });
  document.addEventListener("keydown", IndexedFieldKeyHandler);

  let fieldCounter = useProp(0);
  let fieldRefs: Prop<Map<number,HTMLDivElement>> = useProp(new Map());

  return (
    <>
      <IndexedField static_counter={fieldCounter} fieldRefs={fieldRefs}>
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
      </IndexedField>
      <IndexedField static_counter={fieldCounter} fieldRefs={fieldRefs}>
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
      </IndexedField>
      <IndexedField static_counter={fieldCounter} fieldRefs={fieldRefs}>
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
      </IndexedField>
      <IndexedField static_counter={fieldCounter} fieldRefs={fieldRefs}>
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
      </IndexedField>
      <IndexedField static_counter={fieldCounter} fieldRefs={fieldRefs}>
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
      </IndexedField>
    </>
  );
}
