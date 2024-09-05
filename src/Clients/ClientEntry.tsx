import {
  Row,
  Txt,
  pushPage,
  HiddenOption,
  HiddenOptions,
  DeleteOption,
  theme,
} from "miwi";
import DeleteDialog from "../components/DeleteDialog";
import { isClientValid, getClientLabel } from "@/AppData";
import EditClientPage from "./EditClientPage";
import { Client } from "./Client";
import { mdiTankerTruck } from "@mdi/js";
import { openCreateDeliveryDialog } from "@/Deliveries/CreateDeliveryDialog";
import { EditDeliveryPage } from "@/Deliveries/EditDeliveryPage";

export default function ClientEntery(props: { client: Client }) {
  return (
    <Row
      onClick={() => pushPage(EditClientPage, { client: props.client })}
      widthGrows
      height={1}
      spaceBetween
      stroke={
        isClientValid(props.client) ? theme.palette.text : theme.palette.warning
      }
    >
      <Txt widthGrows singleLine>
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
                pushPage(EditDeliveryPage, { delivery });
              },
              initClient: props.client,
            })
          }
        />
        <DeleteOption
          onClick={() =>
            pushPage(DeleteDialog, {
              obj: props.client,
              message: `Are you sure you want to permanently delete "${
                props.client.clientId ?? ``
              }${props.client.clientId && props.client.name ? ` - ` : ``}${
                props.client.name ?? ``
              }"?`,
            })
          }
        />
      </HiddenOptions>
    </Row>
  );
}
