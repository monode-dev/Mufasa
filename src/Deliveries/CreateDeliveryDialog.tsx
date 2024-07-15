import { Button, Card, Page, Row, Txt, popPage, useProp, ONE_TIME } from "miwi";
import { Delivery, SelectedClient } from "./Delivery";
import { NONE_SELECTED } from "@/Utils";
import { DeliveryFields } from "./DeliveryFields";
import { Show } from "solid-js";

export function CreateDeliveryDialog(props: {
  onCreate: (delivery: Delivery) => void;
}) {
  const explicitPhoneNumber = useProp(``);
  const explicitAddress = useProp(``);
  const label = useProp(``);
  const selectedClient = useProp<SelectedClient>(NONE_SELECTED);
  const notes = useProp(``);
  const deliveryProps = {
    get selectedClient() {
      return selectedClient.value;
    },
    set selectedClient(v) {
      selectedClient.value = v;
    },
    get mayEditLabel() {
      return Delivery.getMayEditLabel(selectedClient.value);
    },
    get label() {
      return label.value;
    },
    set label(v) {
      label.value = v;
    },
    get mayEditAddressAndPhone() {
      return Delivery.getMayEditAddressAndPhone(selectedClient.value);
    },
    get explicitPhoneNumber() {
      return explicitPhoneNumber.value;
    },
    set explicitPhoneNumber(v) {
      explicitPhoneNumber.value = v;
    },
    get explicitAddress() {
      return explicitAddress.value;
    },
    set explicitAddress(v) {
      explicitAddress.value = v;
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
      clientLabel: label.value,
      clientPhoneNumber: explicitPhoneNumber.value,
      clientAddress: explicitAddress.value,
      notes: notes.value,
      sortPosition: Date.now(),
      creationTimePosix: Date.now(),
    });
    props.onCreate(newDelivery);
  }

  return (
    <Page onClick={popPage} fill="#00000099">
      <Card preventClickPropagation width={`75%`} shadowSize={2}>
        <Txt h1>Create Delivery</Txt>
        <DeliveryFields delivery={deliveryProps} />
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
