import {
  mdiAccount,
  mdiAlphaX,
  mdiIdentifier,
  mdiMapMarker,
  mdiPhone,
  mdiPlus,
  mdiTextBox,
} from "@mdi/js";
import { Box, Field, Icon, Prop, Row, Txt, useFormula, useProp } from "miwi";
import { formatPhoneNumber, formatIdNumber } from "@/utils";
import { Client, ClientPhoneNumber } from "./Client";
import { createSignal, For, Show } from "solid-js";

export function ClientFields(props: {
  firstFieldHasFocus?: Prop<boolean>;
  client?: Prop<Client>;
  name: Prop<string>;
  clientId: Prop<string>;
  phoneNumber: Prop<string>;
  address: Prop<string>;
  notes: Prop<string>;
  create?: boolean;
}) {

  const addPhoneNumber = () => {
    props.client?.value.addPhoneNumber();
  };
  const deletePhoneNumber = (num: ClientPhoneNumber) => {
    props.client?.value.sortedAdditionalPhoneNumbers.find((phoneNumber) => phoneNumber === num)?.deleteDoc();
  };
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
      <For each={props.client?.value.sortedAdditionalPhoneNumbers}>
       {(phoneNumber) => ( 
        <Row>
          <Field
            hintText={"Name"}
            value={useFormula(
              () => phoneNumber.name ?? '',
              (v) => (phoneNumber.name = v),
            )}
            underlined
            capitalize={`words`}
            keyboard={"text"}
          />
          <Field
            hintText={"Phone Number"}
            value={useFormula(
              () => phoneNumber.number ?? '',
              (v) => (phoneNumber.number = v),
            )}
            underlined
            formatInput={formatPhoneNumber}
            keyboard="tel"
          />
          <Icon
            iconPath={mdiAlphaX}
            scale={1.5}
            onClick={() => deletePhoneNumber(phoneNumber)}
          />
        </Row>
      )}
      </For>
      
      <Show when={props.client}>
        <Box 
          onClick={addPhoneNumber}
        >
          <Row>
          <Icon
              iconPath={mdiPlus}
              scale={1.25}
            />
            <Txt>Add Phone Number</Txt>
          </Row>
        </Box>
      </Show>
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
