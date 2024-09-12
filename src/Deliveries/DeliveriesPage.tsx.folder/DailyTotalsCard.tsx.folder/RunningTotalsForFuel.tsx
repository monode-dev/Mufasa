import {
  Column,
  Row,
  Txt,
  formatNumWithCommas,
  useFormula,
  theme,
  pushPage,
} from "miwi";
import { SubDelivery } from "../../Delivery";
import {
  FuelInTruck,
  LoadUnloadFuelDialog,
} from "./RunningTotalsForFuel.tsx.folder/FuelInTruck";
import { FuelType } from "@/model/DataModel";
import { Show } from "solid-js";

export type FuelTotals = {
  fuelId: string;
  fuelName: string;
  upcoming: SubDelivery[];
  delivered: SubDelivery[];
};

export function compileAllFuelTotals(props: {
  upcomingSubDeliveries: SubDelivery[];
  completedSubDeliveriesSince3am: SubDelivery[];
}): FuelTotals[] {
  const subDeliveriesByFuelId = new Map<string, FuelTotals>();
  FuelType.sortedFuelTypes.forEach((fuelType) => {
    const fuelId = `id-${fuelType.docId}`;
    subDeliveriesByFuelId.set(fuelId, {
      fuelId,
      fuelName: fuelType.name ?? `Unknown Fuel`,
      upcoming: [],
      delivered: [],
    });
  });

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

  return Array.from(subDeliveriesByFuelId.values()).filter(
    (totals) => totals.upcoming.length > 0 || totals.delivered.length > 0,
  );

  function ensureFuelInMap(sub: SubDelivery): FuelTotals | undefined {
    // Calculate the fuel ID in this context
    const fuelId = FuelInTruck.getFuelId(sub);
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

export function RunningTotalsForFuel(props: {
  fuelTotals: FuelTotals;
  collapseUnlessImportant: boolean;
}) {
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
  const thereIsFuelToDeliverButNoLoadRecords = useFormula(
    () =>
      upcomingGallons.value > 0 &&
      FuelInTruck.getRecentLoadsForFuel(props.fuelTotals.fuelId).length === 0,
  );
  const fuelAddedToTruckSince3am = useFormula(() =>
    FuelInTruck.getRecentLoadsForFuel(props.fuelTotals.fuelId).reduce(
      (total, load) => total + load.loadAmount,
      0,
    ),
  );

  return (
    <Show
      when={
        !props.collapseUnlessImportant ||
        thereIsFuelToDeliverButNoLoadRecords.value
      }
    >
      <Column padBetween={0}>
        <Row>
          <Txt singleLine widthGrows>{`${props.fuelTotals.fuelName}:`}</Txt>
          {/* TODO: Add and remove fuel */}
          <Txt
            stroke={theme.palette.primary}
            onClick={() =>
              pushPage(LoadUnloadFuelDialog, {
                fuelId: props.fuelTotals.fuelId,
                gallonsLeftToDeliver: upcomingGallons.value,
                showUnloadOption: !thereIsFuelToDeliverButNoLoadRecords.value,
              })
            }
          >
            {thereIsFuelToDeliverButNoLoadRecords.value
              ? `Record Fuel in Truck`
              : `Load / Unload Fuel`}
          </Txt>
        </Row>
        <Show when={!thereIsFuelToDeliverButNoLoadRecords.value}>
          <Txt singleLine widthGrows>{`${formatNumWithCommas(
            deliveredGallons.value,
            0,
          )} gal. delivered`}</Txt>
          <Txt singleLine widthGrows>
            {`${formatNumWithCommas(
              Math.max(
                fuelAddedToTruckSince3am.value - deliveredGallons.value,
                0,
              ),
              0,
            )} gal. left in truck`}
          </Txt>
          <Txt singleLine widthGrows>
            {`${formatNumWithCommas(
              upcomingGallons.value,
              0,
            )} gal. left to deliver`}
          </Txt>
        </Show>
      </Column>
    </Show>
  );
}
