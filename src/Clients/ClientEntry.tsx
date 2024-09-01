import {
  Row,
  Txt,
  pushPage,
  useProp,
  mdColors,
  HiddenOption,
  HiddenOptions,
  DeleteOption,
  theme,
} from "miwi";
import DeleteDialog from "../components/DeleteDialog";
import { isClientValid, getClientLabel } from "@/AppData";
import ClientPage from "./ClientPage";
import { Client } from "./Client";
import { mdiTankerTruck } from "@mdi/js";
import { openCreateDeliveryDialog } from "@/Deliveries/CreateDeliveryDialog";
import { DeliveryPage } from "@/Deliveries/DeliveryPage";

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
        widthGrows
        singleLine
        stroke={isClientValid(props.client) ? myTextColor.value : mdColors.grey}
      >
        {getClientLabel(props.client)}
      </Txt>
      <HiddenOptions
        cancelOptions={{
          stroke: theme.palette.hint,
        }}
      >
        <HiddenOption
          text={`Delivery`}
          icon={mdiTankerTruck}
          onClick={() =>
            openCreateDeliveryDialog({
              onCreate: (delivery) => {
                pushPage(DeliveryPage, { delivery });
              },
              initClient: props.client,
            })
          }
        />
        <DeleteOption onClick={deletePressed} />
      </HiddenOptions>
    </Row>
  );
}
