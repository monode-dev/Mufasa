import { isClientValid, listClients } from "@/AppData";
import {
  Button,
  Card,
  Page,
  Row,
  Txt,
  useFormula,
  mdColors,
  popPage,
  useProp,
  pushPage,
  Dialog,
} from "miwi";
import { ClientFields } from "./ClientFields";
import { Show } from "solid-js";
import { Client, WeekDay } from "./Client";
import { withLimitConfirmation } from "@/model/LimitUi";
import Fuse from "fuse.js";
import { LoadCSVDialog } from "./LoadCSVDialog";
import { assign } from "solid-js/web";

export const openCreateClientDialog = (props: {
  initName?: string;
  initClientId?: string;
  onCreate?: (client: Client) => string | undefined | void;
}) =>
  withLimitConfirmation({
    count: Client.limit.count,
    limit: Client.limit.max,
    labelSingular: `Client`,
    labelPlural: `Clients`,
    action: () => pushPage(CreateClientDialog, props),
  });

function CreateClientDialog(props: {
  initName?: string;
  initClientId?: string;
  onCreate?: (client: Client) => string | undefined | void;
}) {
  const name = useProp(props.initName ?? ``);
  const clientId = useProp(props.initClientId ?? ``);
  const phoneNumber = useProp(``);
  const address = useProp(``);
  const notes = useProp(``);
  const weeksBetweenScheduledDeliveries = useProp<number | null>(null);
  const weekday = useProp(WeekDay.none);
  const scheduledDeliveryStartDate = useProp<number | null>(null);
  const rateOffset = useProp<number | null>(null);
  const shouldScheduleDeliveriesForThisClient = useProp<boolean>(false);
  const assignedTo = useProp(``);
  // const tempClient = Client.create({
  //   name: "",
  //   clientId: "",
  // });

  function closePopUp() {
    // tempClient.additionalPhoneNumbers.forEach((num) => num.deleteDoc());
    // tempClient.deleteDoc();
    popPage();
  }

  function isClientNameAlreadyUsed() {
    const allClients = listClients(Client.getAllDocs(), true);
    const allClientNames = allClients.map((client) =>
      client.name.toLowerCase(),
    );

    const options = {
      keys: [name.value.toLowerCase()],
      threshold: 0.2, //TODO - check if this is the best value
    };

    const fuse = new Fuse(allClientNames, options);
    const result = fuse.search(name.value.toLowerCase());

    return result.length > 0 ? true : false;
  }

  function isClientIdAlreadyUsed() {
    const allClients = listClients(Client.getAllDocs(), true);
    const allClientIds = allClients.map((client) => client.clientId);
    let result = false;

    allClientIds.forEach((id) => {
      if (id === clientId.value && clientId.value !== "") {
        result = true;
      }
    });

    return result;
  }

  const clientInitFromFields = useFormula(() => {
    return {
      name: name.value,
      clientId: clientId.value,
      phoneNumber: phoneNumber.value,
      address: address.value,
      notes: notes.value,
      rateOffset: rateOffset.value,
      _shouldScheduleDeliveriesForThisClient:
        shouldScheduleDeliveriesForThisClient.value,
      weeksBetweenScheduledDeliveries: weeksBetweenScheduledDeliveries.value,
      weekday: weekday.value,
      scheduledDeliveryStartDate: scheduledDeliveryStartDate.value,
      assignedTo: assignedTo.value,
    };
  });
  const clientIsValid = useFormula(() => {
    return isClientValid(clientInitFromFields.value);
  });

  const show_errors = useProp(false);
  const live_error_msg = useFormula(
    () => !clientIsValid.value && show_errors.value,
  );

  function showErrorMessages() {
    if (live_error_msg.value) return "Name or Client ID is needed";

    if (isClientNameAlreadyUsed())
      return "There is already another client with a similar name.";

    if (isClientIdAlreadyUsed()) return "Client ID is already in use.";

    return "";
  }

  function showErrors() {
    show_errors.value = true;
  }

  function handleYes() {
    if (!clientIsValid.value) {
      showErrors();
      return;
    }
    popPage(); //Using popPage here because closePopUp() will delete the tempClient.
    const newClient = Client.create({
      name: name.value,
      clientId: clientId.value,
      phoneNumber: phoneNumber.value,
      address: address.value,
      notes: notes.value,
      rateOffset: rateOffset.value,
      _shouldScheduleDeliveriesForThisClient: shouldScheduleDeliveriesForThisClient.value,
      weeksBetweenScheduledDeliveries: weeksBetweenScheduledDeliveries.value,
      weekday: weekday.value,
      scheduledDeliveryStartDate: scheduledDeliveryStartDate.value,
      assignedTo: assignedTo.value,
    });
    props.onCreate?.(newClient);
    // tempClient.sortedAdditionalPhoneNumbers.forEach((num) => {
    //   newClient.addPhoneNumber();
    //   newClient.sortedAdditionalPhoneNumbers[newClient.sortedAdditionalPhoneNumbers.length - 1].name = num.name;
    //   newClient.sortedAdditionalPhoneNumbers[newClient.sortedAdditionalPhoneNumbers.length - 1].number = num.number;
    // });
    // tempClient.additionalPhoneNumbers.forEach((num) => num.deleteDoc());
    // tempClient.deleteDoc();
  }

  return (
    <Dialog>
      <Txt h1>Create Client</Txt>
      <ClientFields
        //client={useProp(tempClient)}
        autoFocusFirstField
        name={name}
        clientId={clientId}
        phoneNumber={phoneNumber}
        address={address}
        notes={notes}
        create={true}
        rateOffset={rateOffset}
        shouldScheduleDeliveriesForThisClient={
          shouldScheduleDeliveriesForThisClient
        }
        weeksBetweenScheduledDeliveries={weeksBetweenScheduledDeliveries}
        weekday={weekday}
        scheduledDeliveryStartDate={scheduledDeliveryStartDate}
        assignedTo={assignedTo}
      />
      <Show when={showErrorMessages() != ""}>
        <Txt stroke={$theme.colors.warning}>{showErrorMessages()}</Txt>
      </Show>
      <Row padBetween={1}>
        <Button outlined widthGrows onClick={closePopUp}>
          Cancel
        </Button>
        <Button widthGrows onClick={handleYes} fill={mdColors.green}>
          Create
        </Button>
      </Row>
    </Dialog>
  );
}
