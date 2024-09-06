import { Button, Row, mdColors, popPage, Txt, Dialog } from "miwi";
import { SubDelivery } from "./Delivery";

export function ConfirmSubDeliveryUncompletion(props: {
  subDelivery: SubDelivery;
}) {
  return (
    <Dialog>
      {/* Message */}
      <Txt>Are you sure you want to un-complete this completed delivery.</Txt>

      {/* --Buttons-- */}
      <Row widthGrows align={$Align.spaceEvenly}>
        <Button outlined onclick={popPage}>
          Cancel
        </Button>
        <Button
          onclick={() => {
            props.subDelivery.unComplete();
            popPage();
          }}
          fill={mdColors.green}
        >
          Un-Complete
        </Button>
      </Row>
    </Dialog>
  );
}
