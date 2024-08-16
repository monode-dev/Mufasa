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
import { For, Show } from "solid-js";

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
        enterKeyHint={ useFormula(() => enterKey(props.clientId)).value}
        onKeyPress={(e)=> e.key == enterKey() ? focusOnID.value = true : null}
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
        onSubmit={()=>focusOnPhone.value = true}
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
        onSubmit={()=>focusOnAddress.value = true}
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
        onSubmit={()=>focusOnNotes.value = true}
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
