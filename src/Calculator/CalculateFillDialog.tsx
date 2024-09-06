import CompleteSubDeliveryDialog from "@/Deliveries/CompleteSubDeliveryDialog";
import { SubDelivery } from "@/Deliveries/Delivery";
import { Button, Dialog, popPage, pushPage, Row, Txt } from "miwi";
import { CalculateFillFields } from "./CalculateFillFields";

export function CalculateFillDialog(props: { subDelivery: SubDelivery }) {
  return (
    <Dialog widthGrows>
      <Txt h2>Calculate Fill</Txt>
      <CalculateFillFields subDelivery={props.subDelivery} />
      <Row>
        <Button widthGrows outlined onClick={() => popPage()}>
          Cancel
        </Button>
        <Button
          widthGrows
          onClick={() => {
            popPage();
            requestAnimationFrame(() =>
              pushPage(CompleteSubDeliveryDialog, {
                subDelivery: props.subDelivery,
              }),
            );
          }}
        >
          Next
        </Button>
      </Row>
    </Dialog>
  );
}
