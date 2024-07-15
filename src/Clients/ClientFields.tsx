import {
  mdiAccount,
  mdiIdentifier,
  mdiMapMarker,
  mdiPhone,
  mdiTextBox,
} from "@mdi/js";
import { Field, Prop } from "miwi";
import { formatAddress, formatPhoneNumber } from "@/Utils";

export function ClientFields(props: {
  name: Prop<string>;
  clientId: Prop<string>;
  phoneNumber: Prop<string>;
  address: Prop<string>;
  notes: Prop<string>;
}) {
  return (
    <>
      <Field
        hintText={`Name`}
        iconPath={mdiAccount} //mdiDomain
        value={props.name}
        capitalize={`words`}
        underlined
      />
      <Field
        hintText={`Client ID`}
        iconPath={mdiIdentifier}
        value={props.clientId}
        underlined
      />
      <Field
        hintText={`Phone`}
        iconPath={mdiPhone}
        value={props.phoneNumber}
        formatInput={formatPhoneNumber}
        underlined
        keyboard="tel"
      />
      <Field
        hintText={`Address`}
        multiline
        iconPath={mdiMapMarker}
        value={props.address}
        formatInput={formatAddress}
        capitalize={`words`}
        underlined
      />
      <Field
        hintText={`Notes`}
        multiline
        iconPath={mdiTextBox}
        value={props.notes}
        capitalize={`sentences`}
        underlined
      />
    </>
  );
}
