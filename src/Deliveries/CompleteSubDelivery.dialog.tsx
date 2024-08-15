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
import { JUST_FUEL, ONE_TIME } from "@/utils";
import { FuelType } from "@/model/DataModel";

// noinspection t
export default function CompleteSubDeliveryDialog(props: {
  subDelivery: SubDelivery;
}) {
  const fuelName = useProp<string>(
    props.subDelivery.selectedTank === JUST_FUEL ||
      !props.subDelivery.shouldShowTankSelector
      ? props.subDelivery.selectedFuel === ONE_TIME
        ? props.subDelivery.explicitFuelName ?? ``
        : props.subDelivery.selectedFuel?.name ?? ``
      : props.subDelivery.selectedTank?.fuelType?.name ?? ``,
  );
  const rate = useProp<number | null>(
    props.subDelivery.selectedTank === JUST_FUEL ||
      !props.subDelivery.shouldShowTankSelector
      ? props.subDelivery.selectedFuel === ONE_TIME
        ? props.subDelivery.explicitRate ?? null
        : props.subDelivery.selectedFuel?.rate ?? null
      : props.subDelivery.selectedTank?.fuelType?.rate ?? null,
  );

  const gallons = useProp<number | null>(props.subDelivery.gallons);
  const canComplete = useFormula(
    () =>
      fuelName.value.trim() !== `` &&
      exists(rate.value) &&
      rate.value >= 0 &&
      exists(gallons.value) &&
      gallons.value >= 0,
  );

  function completeDelivery() {
    if (!canComplete.value) return;
    props.subDelivery.complete({
      fuelName: fuelName.value,
      rate: rate.value!,
      gallons: gallons.value!,
    });
  }

  function handleYes() {
    // const fuelType = FuelType.sortedFuelTypes.find((fuelType) => fuelType.name === fuelName.value);
    // if(fuelType) {
    //   fuelType.amountOfFuel! = (Number(fuelType.amountOfFuel!) - gallons.value!).toString();
    // }
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
          rateSig={rate}
          gallonsSig={gallons}
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
