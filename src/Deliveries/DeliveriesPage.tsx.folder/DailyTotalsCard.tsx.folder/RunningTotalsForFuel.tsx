import { mdiDotsVertical } from "@mdi/js";
import { Column, Row, Txt, Icon, formatNumWithCommas, useFormula } from "miwi";
import { SubDelivery } from "../../Delivery";
import { NONE_SELECTED, ONE_TIME } from "@/utils";

export type FuelTotals = {
  fuelId: string | undefined;
  fuelName: string;
  upcoming: SubDelivery[];
  delivered: SubDelivery[];
};

export function compileAllFuelTotals(props: {
  upcomingSubDeliveries: SubDelivery[];
  completedSubDeliveriesSince3am: SubDelivery[];
}): FuelTotals[] {
  const subDeliveriesByFuelId = new Map<string, FuelTotals>();

  // Add each upcoming sub-delivery to the correct fuel
  props.upcomingSubDeliveries.forEach((sub) => {
    const fuelEntry = ensureFuelInMap(sub);
    if (!fuelEntry) return;
    fuelEntry.upcoming.push(sub);
  });

  // Add each completed sub-delivery to the correct fuel
  props.completedSubDeliveriesSince3am.forEach((sub) => {
    const fuelEntry = ensureFuelInMap(sub);
    if (!fuelEntry) return;
    fuelEntry.delivered.push(sub);
  });

  return Array.from(subDeliveriesByFuelId.values());

  function ensureFuelInMap(sub: SubDelivery): FuelTotals | undefined {
    // Calculate the fuel ID in this context
    const fuelId =
      sub.actualFuelType !== NONE_SELECTED
        ? sub.actualFuelType === ONE_TIME
          ? sub.fuelSpecs.name
            ? `ot-${sub.fuelSpecs.name}`
            : undefined
          : `id-${sub.actualFuelType.docId}`
        : undefined;
    if (!fuelId) return;

    // Ensure the fuel is in the map
    if (!subDeliveriesByFuelId.has(fuelId)) {
      subDeliveriesByFuelId.set(fuelId, {
        fuelId,
        fuelName: sub.fuelSpecs?.name ?? "Unknown Fuel",
        upcoming: [],
        delivered: [],
      });
    }

    return subDeliveriesByFuelId.get(fuelId);
  }
}

export function RunningTotalsForFuel(props: { fuelTotals: FuelTotals }) {
  const upcomingGallons = useFormula(() =>
    props.fuelTotals.upcoming.reduce(
      (total, sub) => total + (sub.gallons ?? 0),
      0,
    ),
  );
  const deliveredGallons = useFormula(() =>
    props.fuelTotals.delivered.reduce(
      (total, sub) => total + (sub.gallons ?? 0),
      0,
    ),
  );
  // TODO: Store this in a saved prop
  const fuelAddedToTruckSince3am = useFormula(() => 0);

  return (
    <Column padBetween={0}>
      <Row>
        <Txt singleLine widthGrows>{`${props.fuelTotals.fuelName}:`}</Txt>
        {/* TODO: Add and remove fuel */}
        <Icon iconPath={mdiDotsVertical} />
      </Row>
      <Txt singleLine widthGrows>{`${formatNumWithCommas(
        deliveredGallons.value,
        0,
      )} gal. delivered`}</Txt>
      <Txt singleLine widthGrows>
        {`${formatNumWithCommas(
          Math.max(fuelAddedToTruckSince3am.value - deliveredGallons.value, 0),
          0,
        )} gal. left in truck`}
      </Txt>
      <Txt singleLine widthGrows>
        {`${formatNumWithCommas(
          upcomingGallons.value,
          0,
        )} gal. left to deliver`}
      </Txt>
    </Column>
  );
}
