import {
  mdiAccount,
  mdiAlphaX,
  mdiIdentifier,
  mdiMapMarker,
  mdiPhone,
  mdiPlus,
  mdiTextBox,
} from "@mdi/js";
import { Box, Field, Icon, Prop, Row, Txt, useProp } from "miwi";
import { formatPhoneNumber, formatIdNumber } from "@/utils";
import { Client, ClientPhoneNumber } from "./Client";
import { createSignal, Show } from "solid-js";

export function ClientFields(props: {
  firstFieldHasFocus?: Prop<boolean>;
  client: Prop<Client>;
  additionalPhoneNumberName?: Prop<string>;
  additionalPhoneNumber?: Prop<string>;
  additionalPhoneNumberName1?: Prop<string>;
  additionalPhoneNumber1?: Prop<string>;
  additionalPhoneNumberName2?: Prop<string>;
  additionalPhoneNumber2?: Prop<string>;
  additionalPhoneNumberName3?: Prop<string>;
  additionalPhoneNumber3?: Prop<string>;
  additionalPhoneNumberName4?: Prop<string>;
  additionalPhoneNumber4?: Prop<string>;
  name: Prop<string>;
  clientId: Prop<string>;
  phoneNumber: Prop<string>;
  address: Prop<string>;
  notes: Prop<string>;
}) {

  const addPhoneNumber = () => {
    props.client.value.addPhoneNumber();
    console.log("Add phone number", props.client.value.sortedAdditionalPhoneNumbers);
  };
  const deletePhoneNumber = (num: ClientPhoneNumber) => {
    props.client.value.sortedAdditionalPhoneNumbers.find((phoneNumber) => phoneNumber === num)?.deleteDoc();
    console.log("Delete phone number", props.client.value.sortedAdditionalPhoneNumbers);
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
      />
      <Field
        hintText={`Client ID`}
        iconPath={mdiIdentifier}
        value={props.clientId}
        underlined
        formatInput={formatIdNumber}
        keyboard={"numeric"}
      />
      <Field
        hintText={`Phone`}
        iconPath={mdiPhone}
        value={props.phoneNumber}
        underlined
        formatInput={formatPhoneNumber}
        keyboard="tel"
      />
      <Show when={props.client.value.sortedAdditionalPhoneNumbers[0]}>
        <Row>
          <Field
            hintText={"Name"}
            value={props.additionalPhoneNumberName}
            underlined
            capitalize={`words`}
            keyboard={"text"}
          />
          <Field
            hintText={"Phone Number"}
            value={props.additionalPhoneNumber}
            underlined
            formatInput={formatPhoneNumber}
            keyboard="tel"
          />
          <Icon
          iconPath={mdiAlphaX}
          scale={1.5}
          onClick={() => deletePhoneNumber(props.client.value.sortedAdditionalPhoneNumbers[0])}
          />
        </Row>
      </Show>
      <Show when={props.client.value.sortedAdditionalPhoneNumbers[1]}>
        <Row>
          <Field
            hintText={"Name"}
            value={props.additionalPhoneNumberName1}
            underlined
            capitalize={`words`}
            keyboard={"text"}
          />
          <Field
            hintText={"Phone Number"}
            value={props.additionalPhoneNumber1}
            underlined
            formatInput={formatPhoneNumber}
            keyboard="tel"
          />
          <Icon
          iconPath={mdiAlphaX}
          scale={1.25}
          onClick={() => deletePhoneNumber(props.client.value.sortedAdditionalPhoneNumbers[1])}
          />
        </Row>
      </Show>
      <Show when={props.client.value.sortedAdditionalPhoneNumbers[2]}>
        <Row>
          <Field
            hintText={"Name"}
            value={props.additionalPhoneNumberName2}
            underlined
            capitalize={`words`}
            keyboard={"text"}
          />
          <Field
            hintText={"Phone Number"}
            value={props.additionalPhoneNumber2}
            underlined
            formatInput={formatPhoneNumber}
            keyboard="tel"
          />
          <Icon
          iconPath={mdiAlphaX}
          scale={1.25}
          onClick={() => deletePhoneNumber(props.client.value.sortedAdditionalPhoneNumbers[2])}
          />
        </Row>
      </Show>
      <Show when={props.client.value.sortedAdditionalPhoneNumbers[3]}>
        <Row>
          <Field
            hintText={"Name"}
            value={props.additionalPhoneNumberName3}
            underlined
            capitalize={`words`}
            keyboard={"text"}
          />
          <Field
            hintText={"Phone Number"}
            value={props.additionalPhoneNumber3}
            underlined
            formatInput={formatPhoneNumber}
            keyboard="tel"
          />
          <Icon
          iconPath={mdiAlphaX}
          scale={1.25}
          onClick={() => deletePhoneNumber(props.client.value.sortedAdditionalPhoneNumbers[3])}
          />
        </Row>
      </Show>
      <Show when={props.client.value.sortedAdditionalPhoneNumbers[4]}>
        <Row>
          <Field
            hintText={"Name"}
            value={props.additionalPhoneNumberName4}
            underlined
            capitalize={`words`}
            keyboard={"text"}
          />
          <Field
            hintText={"Phone Number"}
            value={props.additionalPhoneNumber4}
            underlined
            formatInput={formatPhoneNumber}
            keyboard="tel"
          />
          <Icon
          iconPath={mdiAlphaX}
          scale={1.25}
          onClick={() => deletePhoneNumber(props.client.value.sortedAdditionalPhoneNumbers[5])}
          />
        </Row>
      </Show>
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
      <Field
        hintText={`Address`}
        multiline
        iconPath={mdiMapMarker}
        value={props.address}
        underlined
        capitalize={`words`}
        keyboard={"text"}
      />
      <Field
        hintText={`Notes`}
        multiline
        iconPath={mdiTextBox}
        value={props.notes}
        underlined
        capitalize={`sentences`}
        keyboard={"text"}
      />
    </>
  );
}
