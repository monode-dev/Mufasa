import { HiddenDelete, Row, Txt, mdColors, pushPage, useProp } from "miwi";
import DeleteDialog from "../components/DeleteDialog";
import { isClientValid, getClientLabel } from "@/AppData";
import ClientPage from "./ClientPage";
import { Client } from "./Client";

export default function ClientEntery(props: { client: Client }) {
  function deletePressed() {
    pushPage(DeleteDialog, {
      obj: props.client,
      message: `Are you sure you want to permanently delete "${
        props.client.clientId ?? ``
      }${props.client.clientId && props.client.name ? ` - ` : ``}${
        props.client.name ?? ``
      }"?`,
    });
  }

  let myTextColor = useProp<string>(mdColors.black);

  function clicked() {
    myTextColor.value = mdColors.green;
    setTimeout(() => (myTextColor.value = mdColors.black), 250);
    setTimeout(() => pushPage(ClientPage, { client: props.client }), 17);
  }

  return (
    <Row
      onClick={clicked}
      widthGrows
      height={1}
      spaceBetween
      stroke={myTextColor.value}
    >
      <Txt
        singleLine
        stroke={isClientValid(props.client) ? myTextColor.value : mdColors.grey}
      >
        {getClientLabel(props.client)}
      </Txt>
      <HiddenDelete onDelete={deletePressed} />
    </Row>
  );
}
