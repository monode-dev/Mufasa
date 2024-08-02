import ClientSelector from "@/Clients/ClientSelector";
import { ONE_TIME, NONE_SELECTED, formatPhoneNumber } from "@/utils";
import {
  mdiAccount,
  mdiLabel,
  mdiMapMarker,
  mdiPhone,
  mdiTextBox,
} from "@mdi/js";
import { Column, Row, Icon, exists, mdColors, Field, useFormula, Box, Txt } from "miwi";
import { Show } from "solid-js";
import { Delivery } from "./Delivery";

export function DeliveryFields(props: {
  delivery: Pick<
    Delivery,
    | "address"
    | "phoneNumber"
    | "mayEditTitle"
    | "title"
    | "mayEditAddressAndPhone"
    | "selectedClient"
    | "notes"
  >;
}) {
   function clientIsValid() { 
    if(props.delivery.selectedClient != "oneTime" && props.delivery.selectedClient?.isDeleted){
      return true;
    }
    return false;
   }
  return (
    <Column>
      <Row>
        <Icon
          iconPath={mdiAccount}
          stroke={
            clientIsValid() 
            ? mdColors.orange 
            : exists(props.delivery.selectedClient !== NONE_SELECTED)
              ? mdColors.black
              : mdColors.grey
          }
        />
        <ClientSelector
          showNewOption
          showCancelOption
          showOneTimeOption
          value={useFormula(
            () => props.delivery.selectedClient,
            (v) => (props.delivery.selectedClient = v),
          )}
        />
      </Row>
      <Show when={props.delivery.selectedClient === ONE_TIME}>
        <Field
          underlined
          hintText={`Client Name`}
          iconPath={mdiLabel}
          value={useFormula(
            () => props.delivery.title,
            (v) => (props.delivery.title = v),
          )}
          widthGrows
          capitalize={"words"}
          keyboard={"text"}
        />
        <Field
          underlined
          hintText={`Phone`}
          iconPath={mdiPhone}
          value={useFormula(
            () => props.delivery.phoneNumber,
            (v) => (props.delivery.phoneNumber = v),
          )}
          widthGrows
          formatInput={formatPhoneNumber}
          keyboard="tel"
        />
        <Field
          multiline
          underlined
          hintText={`Address`}
          iconPath={mdiMapMarker}
          value={useFormula(
            () => props.delivery.address,
            (v) => (props.delivery.address = v),
          )}
          widthGrows
          capitalize={`words`}
          keyboard={"text"}
        />
      </Show>
      <Field
        multiline
        underlined
        hintText={`Delivery Notes`}
        iconPath={mdiTextBox}
        value={useFormula(
          () => props.delivery.notes,
          (v) => (props.delivery.notes = v),
        )}
        asWideAsParent
        capitalize={`sentences`}
        keyboard={"text"}
        overflowXWraps
      />
      <Show when={clientIsValid()}>
        <Box widthGrows alignCenter>
          <Txt alignLeft stroke={$theme.colors.warning}>
            This client was deleted.
          </Txt>
        </Box>
      </Show>
    </Column>
  );
}
