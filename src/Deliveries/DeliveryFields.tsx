import ClientSelector from "@/Clients/ClientSelector";
import {ONE_TIME, NONE_SELECTED, formatPhoneNumber } from "@/utils";
import {
  mdiAccount,
  mdiLabel,
  mdiMapMarker,
  mdiPhone,
  mdiTextBox,
} from "@mdi/js";
import { Column, Row, Icon, exists, mdColors, Field, useFormula } from "miwi";
import { Show } from "solid-js";
import { Delivery } from "./Delivery";

export function DeliveryFields(props: {
  delivery: Pick<
    Delivery,
    | "explicitAddress"
    | "explicitPhoneNumber"
    | "mayEditLabel"
    | "label"
    | "mayEditAddressAndPhone"
    | "selectedClient"
    | "notes"
  >;
}) {
  return (
    <Column>
      <Row>
        <Icon
          iconPath={mdiAccount}
          stroke={
            exists(props.delivery.selectedClient !== NONE_SELECTED)
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
            () => props.delivery.label,
            (v) => (props.delivery.label = v),
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
            () => props.delivery.explicitPhoneNumber,
            (v) => (props.delivery.explicitPhoneNumber = v),
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
            () => props.delivery.explicitAddress,
            (v) => (props.delivery.explicitAddress = v),
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
        widthGrows
        capitalize={`sentences`}
        keyboard={"text"}
      />
    </Column>
  );
}
