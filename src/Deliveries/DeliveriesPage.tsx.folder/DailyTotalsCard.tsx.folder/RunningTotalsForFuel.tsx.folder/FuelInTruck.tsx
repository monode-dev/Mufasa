import { Delivery, SubDelivery } from "@/Deliveries/Delivery";
import { autoSavingProp, NONE_SELECTED, ONE_TIME } from "@/utils";
import {
  Button,
  Dialog,
  doNow,
  exists,
  formatNumWithCommas,
  Label,
  NumField,
  popPage,
  Row,
  theme,
  Txt,
  useProp,
} from "miwi";
import { Show } from "solid-js";

export function LoadUnloadFuelDialog(props: {
  fuelId: string;
  gallonsLeftToDeliver: number;
  showUnloadOption: boolean;
}) {
  const amountToLoad = useProp<number | null>(null);
  return (
    <Dialog>
      <Label label="Gallons">
        <NumField
          underlined
          keyboard="decimal"
          hint={`Enter Gallons`}
          value={amountToLoad}
        />
      </Label>
      <Txt hint widthGrows>{`${formatNumWithCommas(
        props.gallonsLeftToDeliver,
        0,
      )} ga. left to deliver`}</Txt>
      <Row padBetween={1}>
        <Button outlined widthGrows onClick={() => popPage()}>
          Cancel
        </Button>
        <Show when={props.showUnloadOption}>
          <Button
            widthGrows
            fill={amountToLoad.value === null ? theme.palette.hint : undefined}
            onClick={() => {
              if (!exists(amountToLoad.value)) return;
              FuelInTruck.recordLoad(props.fuelId, -1 * amountToLoad.value);
              popPage();
            }}
          >
            Unload
          </Button>
        </Show>
        <Button
          widthGrows
          fill={amountToLoad.value === null ? theme.palette.hint : undefined}
          onClick={() => {
            if (!exists(amountToLoad.value)) return;
            FuelInTruck.recordLoad(props.fuelId, amountToLoad.value);
            popPage();
          }}
        >
          Load
        </Button>
      </Row>
    </Dialog>
  );
}

/** We record each time this driver loads fuel into their truck. Any loads that are days old are deleted. */
export const FuelInTruck = doNow(() => {
  const savedJsonString = autoSavingProp<string>(`fuelInTruck`, `[]`);
  const onSavedJsonLoad = doNow(async () => {
    while (savedJsonString.value === null) {
      await new Promise((r) => setTimeout(r, 50));
    }
  });

  type LoadRecord = {
    fuelId: string;
    loadAmount: number;
    loadTime: number;
  };

  return {
    async recordLoad(fuelId: string, loadAmount: number) {
      await onSavedJsonLoad;
      const oldLoadsList = JSON.parse(savedJsonString.value) as LoadRecord[];
      // Remove any loads that are more than 2 days old
      const updatedListOfLoads = oldLoadsList.filter(
        (load) => Date.now() - load.loadTime < 1000 * 60 * 60 * 24 * 2,
      );
      updatedListOfLoads.push({
        fuelId,
        loadAmount,
        loadTime: Date.now(),
      });
      savedJsonString.value = JSON.stringify(updatedListOfLoads);
    },
    getRecentLoadsForFuel(fuelId: string) {
      const loadsList = JSON.parse(savedJsonString.value) as LoadRecord[];
      return loadsList.filter(
        (load) =>
          load.fuelId === fuelId && load.loadTime > Delivery.threeAm.getTime(),
      );
    },
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
