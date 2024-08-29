import {
  mdiAccount,
  mdiIdentifier,
  mdiMapMarker,
  mdiPhone,
  mdiPlusMinusVariant,
  mdiTextBox,
} from "@mdi/js";
import {
  EnterKeyHint,
  Field, NumField,
  Prop,
  useFormula,
  useProp
} from "miwi";

import { formatPhoneNumber, formatIdNumber } from "@/utils";
import { onCleanup, } from "solid-js";
import {IndexedField, IndexedFieldKeyHandler} from "@/components/IndexedField";

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
          onlyWriteOnBlur
        />
      </IndexedField>
      <IndexedField refs={fieldRefs} index={rateOffsetIndex}>
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
          onlyWriteOnBlur
        />
      </IndexedField>
    </>
  );
}
