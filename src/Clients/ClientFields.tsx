import {
  mdiAccount,
  mdiIdentifier,
  mdiMapMarker,
  mdiPhone,
  mdiTextBox,
} from "@mdi/js";
import { Field, Prop } from "miwi";
import { formatPhoneNumber, formatIdNumber } from "@/utils";

export function ClientFields(props: {
  firstFieldHasFocus?: Prop<boolean>;
  name: Prop<string>;
  clientId: Prop<string>;
  phoneNumber: Prop<string>;
  address: Prop<string>;
  notes: Prop<string>;
  create?: boolean;
}) {
  return (
    <>
      <Field
        hasFocus={props.firstFieldHasFocus}
        hintText={`Name`}
        iconPath={mdiAccount} //mdiDomain
        value={props.name}
        underlined
        capitalize={`words`}
        keyboard={"text"}
        enterKeyHint={props.create && props.clientId.value.trim().length > 0 ? `next` : `done`}
      />
      <Field
        hintText={`Client ID`}
        iconPath={mdiIdentifier}
        value={props.clientId}
        underlined
        formatInput={formatIdNumber}
        keyboard={"numeric"}
        enterKeyHint={props.create && props.phoneNumber.value.trim().length > 0 ? `next` : `done`}
      />
      <Field
        hintText={`Phone`}
        iconPath={mdiPhone}
        value={props.phoneNumber}
        underlined
        formatInput={formatPhoneNumber}
        keyboard="tel"
        enterKeyHint={props.create && props.address.value.trim().length > 0 ? `next` : `done`}
      />
      <Field
        hintText={`Address`}
        multiline
        iconPath={mdiMapMarker}
        value={props.address}
        underlined
        capitalize={`words`}
        keyboard={"text"}
        enterKeyHint={props.create && props.notes.value.trim().length > 0 ? `next` : `done`}
      />
      <Field
        hintText={`Notes`}
        multiline
        iconPath={mdiTextBox}
        value={props.notes}
        underlined
        capitalize={`sentences`}
        keyboard={"text"}
        enterKeyHint={`done`}
      />
    </>
  );
}
