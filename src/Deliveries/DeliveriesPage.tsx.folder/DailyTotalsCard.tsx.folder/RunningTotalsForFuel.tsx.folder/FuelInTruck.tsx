import { SubDelivery } from "@/Deliveries/Delivery";
import { autoSavingProp, NONE_SELECTED, ONE_TIME } from "@/utils";
import { doNow } from "miwi";

/** We record each time this driver loads fuel into their truck. Any loads that are days old are deleted. */
export const FuelInTruck = doNow(() => {
  const savedJsonString = autoSavingProp(`fuelInTruck`, `[]`);
  return {
    getFuelId(sub: SubDelivery) {
      return sub.actualFuelType !== NONE_SELECTED
        ? sub.actualFuelType === ONE_TIME
          ? sub.fuelSpecs.name
            ? `ot-${sub.fuelSpecs.name}`
            : undefined
          : `id-${sub.actualFuelType.docId}`
        : undefined;
    },
  };
});
