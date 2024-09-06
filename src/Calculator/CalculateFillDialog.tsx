import CompleteSubDeliveryDialog from "@/Deliveries/CompleteSubDeliveryDialog";
import { Delivery, SubDelivery } from "@/Deliveries/Delivery";
import { Button, Dialog, popPage, pushPage, Row, Txt } from "miwi";
import { CalculateFillFields } from "./CalculateFillFields";

export function CalculateFillDialog(props: { delivery: Delivery }) {
  return (
    <Dialog>
      <Txt h2>Calculate Fill</Txt>
      <CalculateFillFields delivery={props.delivery} />
      <Button widthGrows outlined onClick={() => popPage()}>
        Done
      </Button>
    </Dialog>
  );
}
