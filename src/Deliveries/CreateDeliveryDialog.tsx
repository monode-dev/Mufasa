import {
  Button,
  Card,
  Page,
  Row,
  Txt,
  popPage,
  useProp,
  ONE_TIME,
  pushPage,
  exists,
} from "miwi";
import { Delivery, SelectedClient } from "./Delivery";
import { NONE_SELECTED } from "@/utils";
import { DeliveryFields } from "./DeliveryFields";
import { Show } from "solid-js";
import { withLimitConfirmation } from "@/model/LimitUi";
import { Client } from "@/Clients/Client";
import { mfs } from "@/model/DataModel";

export const openCreateClientDialog = (props: {
  onCreate: (delivery: Delivery) => void;
  setClient?: Client;
}) =>
  withLimitConfirmation({
    count: Delivery.limit.count,
    limit: Delivery.limit.max,
    labelSingular: `Delivery`,
    labelPlural: `Deliveries`,
    action: () => pushPage(CreateDeliveryDialog, props),
  });

function CreateDeliveryDialog(props: {
  onCreate: (delivery: Delivery) => void;
  setClient?: Client;
}) {
  const phoneNumber = useProp(``);
  const explicitAddress = useProp(``);
  const explicitRateOffset = useProp(0 || null);
  const title = useProp(``);
  const selectedClient = useProp<SelectedClient>(
    exists(props.setClient) ? props.setClient : NONE_SELECTED,
  );
  const notes = useProp(``);
  const deliveryProps = {
    get selectedClient() {
      return selectedClient.value;
    },
    set selectedClient(v) {
      selectedClient.value = v;
    },
    get mayEditTitle() {
      return Delivery.getMayEditTitle(selectedClient.value);
    },
    get title() {
      return title.value;
    },
    set title(v) {
      title.value = v;
    },
    get mayEditAddressAndPhone() {
      return Delivery.getMayEditAddressAndPhone(selectedClient.value);
    },
    get phoneNumber() {
      return phoneNumber.value;
    },
    set phoneNumber(v) {
      phoneNumber.value = v;
    },
    get address() {
      return explicitAddress.value;
    },
    set address(v) {
      explicitAddress.value = v;
    },
    get _manualRateOffset() {
      return explicitRateOffset.value;
    },
    set _manualRateOffset(v) {
      explicitRateOffset.value = v;
    },
    get notes() {
      return notes.value;
    },
    set notes(v) {
      notes.value = v;
    },
  };

  const warningMessage = useProp(``);

  function handleYes() {
    if (!selectedClient.value) {
      warningMessage.value = `Please select a client.`;
      return;
    }
    popPage();
    const newDelivery = Delivery.create({
      _isOneTimeClient: selectedClient.value === ONE_TIME,
      _client:
        selectedClient.value === ONE_TIME ||
        selectedClient.value === NONE_SELECTED
          ? null
          : selectedClient.value,
      _manualTitle: title.value,
      _manualPhoneNumber: phoneNumber.value,
      _manualClientAddress: explicitAddress.value,
      _manualRateOffset: explicitRateOffset.value,
      notes: notes.value,
      sortPosition: Date.now(),
      creationTimePosix: Date.now(),
      createdBy: mfs.user.uid,
    });
    props.onCreate(newDelivery);
  }

  return (
    <Page onClick={popPage} fill="#00000099">
      <Card preventClickPropagation width={`75%`} shadowSize={2}>
        <Txt h1>Create Delivery</Txt>
        <DeliveryFields delivery={deliveryProps} create />
        <Show when={warningMessage.value}>
          <Txt widthGrows alignLeft stroke={$theme.colors.warning}>
            {warningMessage.value}
          </Txt>
        </Show>
        <Row widthGrows align={$Align.spaceEvenly}>
          <Button outlined onClick={popPage}>
            Cancel
          </Button>
          <Button onClick={handleYes} fill={$theme.colors.primary}>
            Create
          </Button>
        </Row>
      </Card>
    </Page>
  );
}
