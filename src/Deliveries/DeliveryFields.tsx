import ClientSelector from "@/Clients/ClientSelector";
import { ONE_TIME, NONE_SELECTED, formatPhoneNumber } from "@/utils";
import {
  mdiAccount,
  mdiLabel,
  mdiMapMarker,
  mdiPencil,
  mdiPhone,
  mdiTextBox,
} from "@mdi/js";
import {
  Column,
  Row,
  Icon,
  exists,
  mdColors,
  Field,
  useFormula,
  Box,
  Txt,
  pushPage,
  EnterKeyHint,
  Prop,
} from "miwi";
import { onCleanup, Show } from "solid-js";
import { Delivery } from "./Delivery";
import { FieldKeyHandler, listClients } from "@/AppData";
import { Client } from "@/Clients/Client";
import Fuse from "fuse.js";
import ClientPage from "@/Clients/ClientPage";

export function DeliveryFields(props: {
  create?: boolean;
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
    return !(
      props.delivery.selectedClient != "oneTime" &&
      props.delivery.selectedClient?.isDeleted
    );
  }

  function isClientNameAlreadyUsed() {
    const allClients = listClients(Client.getAllDocs(), true);
    const allClientNames = allClients.map((client) =>
      client.name.toLowerCase(),
    );

    const options = {
      keys: [props.delivery.title.toLowerCase()],
      threshold: 0.2, //TODO - check if this is the best value
    };

    const fuse = new Fuse(allClientNames, options);
    const result = fuse.search(props.delivery.title.toLowerCase());

    return result.length > 0;
  }

  function showErrorMessages() {
    if (!clientIsValid()) return "Client was deleted.";

    if (props.delivery.selectedClient === ONE_TIME && isClientNameAlreadyUsed())
      return "There is already another client with a similar name.";

    return "";
  }

  function editIconShouldBeDisabled() {
    return (
      props.delivery.selectedClient === ONE_TIME ||
      !clientIsValid() ||
      props.delivery.selectedClient === NONE_SELECTED
    );
  }

  function enterKey(prop: Prop<string>): EnterKeyHint {
    const key = props.create && prop.value.trim().length == 0 ? `next` : `done`;
    console.log("key: ", key);
    return key;
  }

  const one_name = useFormula(
    () =>
      props.delivery.selectedClient === ONE_TIME ? props.delivery.title : ``,
    (v) => (props.delivery.title = v),
  );
  const one_phone = useFormula(
    () =>
      props.delivery.selectedClient === ONE_TIME
        ? props.delivery.phoneNumber
        : ``,
    (v) => (props.delivery.phoneNumber = v),
  );
  const one_address = useFormula(
    () =>
      props.delivery.selectedClient === ONE_TIME ? props.delivery.address : ``,
    (v) => (props.delivery.address = v),
  );
  const one_note = useFormula(
    () =>
      props.delivery.selectedClient === ONE_TIME ? props.delivery.notes : ``,
    (v) => (props.delivery.notes = v),
  );

  onCleanup(() => {
    document.removeEventListener("keydown", FieldKeyHandler);
  });
  document.addEventListener("keydown", FieldKeyHandler);
  return (
    <Column>
      <Row>
        <Icon
          iconPath={mdiAccount}
          stroke={
            !clientIsValid()
              ? mdColors.orange
              : exists(props.delivery.selectedClient !== NONE_SELECTED)
                ? mdColors.black
                : mdColors.grey
          }
        />
        <ClientSelector
          showNewOption
          showOneTimeOption
          value={useFormula(
            () => props.delivery.selectedClient,
            (v) => (props.delivery.selectedClient = v),
          )}
        />
        <Show when={props.delivery.selectedClient !== ONE_TIME}>
          <Icon
            stroke={editIconShouldBeDisabled() ? $theme.colors.hint : undefined}
            iconPath={mdiPencil}
            onClick={() => {
              if (
                props.delivery.selectedClient &&
                props.delivery.selectedClient !== ONE_TIME
              ) {
                pushPage(ClientPage, { client: props.delivery.selectedClient });
              }
            }}
          />
        </Show>
      </Row>
      <Show when={props.delivery.selectedClient === ONE_TIME}>
        <Field
          underlined
          hintText={`Client Name`}
          iconPath={mdiLabel}
          value={one_name}
          widthGrows
          capitalize={"words"}
          keyboard={"text"}
          enterKeyHint={useFormula(() => enterKey(one_phone)).value}
        />
        <Field
          underlined
          hintText={`Phone`}
          iconPath={mdiPhone}
          value={one_phone}
          widthGrows
          formatInput={formatPhoneNumber}
          keyboard="tel"
          enterKeyHint={useFormula(() => enterKey(one_address)).value}
        />
        <Field
          multiline
          underlined
          hintText={`Address`}
          iconPath={mdiMapMarker}
          value={one_address}
          widthGrows
          capitalize={`words`}
          keyboard={"text"}
          enterKeyHint={useFormula(() => enterKey(one_note)).value}
        />
      </Show>
      <Field
        multiline
        underlined
        hintText={`Delivery Notes`}
        iconPath={mdiTextBox}
        value={one_note}
        asWideAsParent
        capitalize={`sentences`}
        keyboard={"text"}
        overflowXWraps
        enterKeyHint={`done`}
      />
      <Show when={showErrorMessages() != ""}>
        <Box widthGrows alignCenter>
          <Txt alignLeft stroke={$theme.colors.warning}>
            {showErrorMessages()}
          </Txt>
        </Box>
      </Show>
    </Column>
  );
}
