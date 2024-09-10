import {
  Button,
  Row,
  useFormula,
  exists,
  mdColors,
  popPage,
  useProp,
  Dialog,
} from "miwi";
import { CompletedSubDeliveryFields } from "./CompletedSubDeliveryFields";
import { SubDelivery } from "./Delivery";

export default function CompleteSubDeliveryDialog(props: {
  subDelivery: SubDelivery;
}) {
  const fuelName = useProp<string>(props.subDelivery.fuelSpecs?.name ?? ``);
  const preOffsetRate = useProp<number | null>(
    props.subDelivery.fuelSpecs?.baseRate ?? null,
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

  const mayComplete = useFormula(
    () =>
      fuelName.value.trim() !== `` &&
      exists(preOffsetRate.value) &&
      preOffsetRate.value >= 0 &&
      exists(gallons.value) &&
      gallons.value >= 0 &&
      exists(stickedInchesBeforeFilling.value) &&
      stickedInchesBeforeFilling.value >= 0,
    // Sticked inches after filling is optional
    // exists(stickedInchesAfterFilling.value) &&
    // stickedInchesAfterFilling.value >= 0,
  );

  function completeDelivery() {}

  // TODO: Add transitions
  return (
    <Dialog>
      {/* --Fields-- */}
      <CompletedSubDeliveryFields
        fuelName={fuelName}
        baseRate={preOffsetRate}
        rateOffset={rateOffset}
        gallons={gallons}
        gallonsHintText="Delivered gal."
        stickedInchesBeforeFilling={stickedInchesBeforeFilling}
        stickedInchesAfterFilling={stickedInchesAfterFilling}
        tankGeometry={props.subDelivery.tankGeometry}
      />

      {/* --Buttons-- */}
      <Row padBetween={1}>
        <Button widthGrows outlined onclick={popPage}>
          Cancel
        </Button>
        <Button
          widthGrows
          onclick={() => {
            if (!mayComplete.value) return;
            props.subDelivery.complete({
              fuelName: fuelName.value,
              rate: preOffsetRate.value!,
              gallons: gallons.value!,
              rateOffset: rateOffset.value!,
              stickedInchesBeforeFilling: stickedInchesBeforeFilling.value!,
              stickedInchesAfterFilling: stickedInchesAfterFilling.value,
            });
            popPage();
          }}
          fill={mayComplete.value ? mdColors.green : mdColors.grey}
        >
          Complete
        </Button>
      </Row>
    </Dialog>
  );
}
