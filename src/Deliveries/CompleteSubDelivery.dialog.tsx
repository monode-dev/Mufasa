import {
  Button,
  Card,
  Page,
  Row,
  useFormula,
  exists,
  mdColors,
  popPage,
  useProp,
} from "miwi";
import CompletedSubDeliveryFields from "./CompletedSubDeliveryFields";
import { SubDelivery } from "./Delivery";

// noinspection t
export default function CompleteSubDeliveryDialog(props: {
  subDelivery: SubDelivery;
}) {
  const fuelName = useProp<string>(props.subDelivery.fuelSpecs?.name ?? ``);
  const preOffsetRate = useProp<number | null>(
    props.subDelivery.fuelSpecs?.preOffsetRate ?? null,
  );
  const rateOffset = useProp<number | null>(
    props.subDelivery.fuelSpecs?.rateOffset ?? null,
  );
  const gallons = useProp<number | null>(props.subDelivery.gallons);

  const stickedInchesBeforeFilling = useProp<number | null>(
    props.subDelivery.stickedInchesBeforeFilling,
  );
  const stickedInchesAfterFilling = useProp<number | null>(
    props.subDelivery.stickedInchesAfterFilling,
  );

  const canComplete = useFormula(
    () =>
      fuelName.value.trim() !== `` &&
      exists(preOffsetRate.value) &&
      preOffsetRate.value >= 0 &&
      exists(gallons.value) &&
      gallons.value >= 0,
    // exists(stickedInchesBeforeFilling.value) &&
    // stickedInchesBeforeFilling.value >= 0 &&
    // exists(stickedInchesAfterFilling.value) &&
    // stickedInchesAfterFilling.value >= 0,
  );

  function completeDelivery() {
    if (!canComplete.value) return;
    props.subDelivery.complete({
      fuelName: fuelName.value,
      rate: preOffsetRate.value!,
      gallons: gallons.value!,
      // stickedInchesBeforeFilling: stickedInchesBeforeFilling.value!,
      // stickedInchesAfterFilling: stickedInchesAfterFilling.value!,
    });
  }

  function handleYes() {
    completeDelivery();
    popPage();
  }
  // Close the pop up when the user clicks outside of it
  const cardRef = useProp<HTMLDivElement | null>(null);
  function popOnClickOutside(e: MouseEvent) {
    if (!cardRef.value?.contains(e.target as Node)) {
      popPage();
      e.stopPropagation();
    }
  }

  // TODO: Add transitions
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
        {/* --Fields-- */}
        <CompletedSubDeliveryFields
          fuelNameSig={fuelName}
          rateSig={preOffsetRate}
          rateOffset={rateOffset}
          gallonsSig={gallons}
          stickedInchesBeforeFillingSig={stickedInchesBeforeFilling}
          stickedInchesAfterFillingSig={stickedInchesAfterFilling}
        />

        {/* --Buttons-- */}
        <Row widthGrows align={$Align.spaceEvenly}>
          <Button outlined onclick={popPage}>
            Cancel
          </Button>
          <Button
            onclick={handleYes}
            fill={canComplete.value ? mdColors.green : mdColors.grey}
          >
            Complete
          </Button>
        </Row>
      </Card>
    </Page>
  );
}
