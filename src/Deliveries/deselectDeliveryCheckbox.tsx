import { Button, Card, Page, Row, mdColors, popPage, useProp, Txt } from "miwi";
import { SubDelivery } from "./Delivery";

export function DeselectDeliveryCheckbox(props: {
  subDelivery: SubDelivery;
}) {
  function handleYes() {
    props.subDelivery.unComplete();
    popPage();
  }
  const cardRef = useProp<HTMLDivElement | null>(null);
  function popOnClickOutside(e: MouseEvent) {
    if (!cardRef.value?.contains(e.target as Node)) {
      popPage();
      e.stopPropagation();
    }
  }

  return (
    <Page onClick={popOnClickOutside} fill="#00000099">
      <Card
        ref={(el: HTMLDivElement) => {
          if (el) {
            cardRef.value = el;
          }
        }}
        width={"75%"}
        shadowSize={0}
      >
        {/* Message */}
        <Txt>Are you sure you want to un-complete this completed delivery.</Txt>

        {/* --Buttons-- */}
        <Row widthGrows align={$Align.spaceEvenly}>
          <Button outlined onclick={popPage}>
            Cancel
          </Button>
          <Button onclick={handleYes} fill={mdColors.green}>
            Un-Complete
          </Button>
        </Row>
      </Card>
    </Page>
  );
}
