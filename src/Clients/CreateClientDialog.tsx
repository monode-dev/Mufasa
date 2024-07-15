import { isClientValid } from "@/AppData";
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
} from "miwi";
import { ClientFields } from "./ClientFields";
import { Show } from "solid-js";
import { Client } from "./Client";

export default function CreateClientDialog(props: {
  initName?: string;
  initClientId?: string;
  onCreate?: (client: Client) => string | undefined | void;
}) {
  const name = useProp(props.initName ?? ``);
  const clientId = useProp(props.initClientId ?? ``);
  const phoneNumber = useProp(``);
  const address = useProp(``);
  const notes = useProp(``);

  function closePopUp() {
    popPage();
  }

  const clientInitFromFields = useFormula(() => {
    return {
      name: name.value,
      clientId: clientId.value,
      phoneNumber: phoneNumber.value,
      address: address.value,
      notes: notes.value,
    };
  });
  const clientIsValid = useFormula(() => {
    return isClientValid(clientInitFromFields.value);
  });

  const show_errors = useProp(false);
  const live_error_msg = useFormula(
    () => !clientIsValid.value && show_errors.value,
  );

  function showErrors() {
    show_errors.value = true;
  }

  function handleYes() {
    if (!clientIsValid.value) {
      showErrors();
      return;
    }
    closePopUp();
    const newClient = Client.create({
      name: name.value,
      clientId: clientId.value,
      phoneNumber: phoneNumber.value,
      address: address.value,
      notes: notes.value,
    });
    props.onCreate?.(newClient);
  }

  return (
    <Page onClick={popPage} fill="#00000099">
      <Card preventClickPropagation width={`75%`} shadowSize={0}>
        <Txt h1>Create Client</Txt>
        <ClientFields
          name={name}
          clientId={clientId}
          phoneNumber={phoneNumber}
          address={address}
          notes={notes}
        />
        <Show when={live_error_msg.value}>
          <Txt stroke={$theme.colors.warning}>Name or Client ID is needed</Txt>
        </Show>
        <Row widthGrows align={$Align.spaceEvenly}>
          <Button outlined onClick={closePopUp}>
            Cancel
          </Button>
          <Button onClick={handleYes} fill={mdColors.green}>
            Create
          </Button>
        </Row>
      </Card>
    </Page>
  );
}
