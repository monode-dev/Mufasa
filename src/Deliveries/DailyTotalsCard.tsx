import {
  Card,
  Txt,
  Column,
  useFormula,
  exists,
  Box,
  Row,
  Field,
  Icon,
} from "miwi";
import { Delivery } from "./Delivery";
import { formatIdNumber, formatNumWithCommas } from "@/utils";
import { createSignal, For, Show } from "solid-js";
import { FuelType } from "@/model/DataModel";
import {
  mdiArrowDownCircleOutline,
  mdiArrowLeftTop,
  mdiArrowUpCircleOutline,
  mdiGasStation,
} from "@mdi/js";

export function DailyTotalsCard() {
  const upcomingSubDeliveries = useFormula(() => {
    return Delivery.upcomingDeliveries.flatMap((delivery) =>
      delivery.sortedSubDeliveries.filter((sub) => !sub.isCompleted),
    );
  });

  // const leftPerFuel = useFormula(() => {
  //   const leftPerFuel = new Map<string, number>();
  //   upcomingSubDeliveries.value.forEach((sub) => {
  //     const fuelName = sub.fuelSpecs?.name;
  //     if (!exists(fuelName)) return;
  //     if (!leftPerFuel.has(fuelName)) leftPerFuel.set(fuelName, 0);
  //     leftPerFuel.set(
  //       fuelName,
  //       leftPerFuel.get(fuelName)! + (sub.gallons ?? 0),
  //     );
  //   });
  //   return leftPerFuel;
  // });

  const completedSubDeliveriesSince3am = useFormula(() => {
    const threeAm = new Date();
    if (threeAm.getHours() < 3) threeAm.setDate(threeAm.getDate() - 1);
    else threeAm.setHours(3);
    return [
      ...Delivery.upcomingDeliveries,
      ...Delivery.completedDeliveries.filter(
        (delivery) => (delivery.completedTimePosix ?? 0) > threeAm.getTime(),
      ),
    ].flatMap((delivery) =>
      delivery.sortedSubDeliveries.filter(
        (sub) =>
          sub.isCompleted && (sub.completedTimePosix ?? 0) > threeAm.getTime(),
      ),
    );
  });

  // const deliveredPerFuel = useFormula(() => {
  //   const deliveredPerFuel = new Map<string, number>();
  //   completedSubDeliveriesSince3am.value.forEach((sub) => {
  //     const fuelName = sub.fuelSpecs?.name;
  //     if (!exists(fuelName)) return;
  //     if (!deliveredPerFuel.has(fuelName)) deliveredPerFuel.set(fuelName, 0);
  //     deliveredPerFuel.set(
  //       fuelName,
  //       deliveredPerFuel.get(fuelName)! + (sub.gallons ?? 0),
  //     );
  //   });
  //   return deliveredPerFuel;
  // });

  const upcomingAndDeliveredFuel = useFormula(() => {
    const upcomingAndDeliveredFuel = new Map<string, number>();
    completedSubDeliveriesSince3am.value.forEach((sub) => {
      const fuelName = sub.fuelSpecs?.name;
      if (!exists(fuelName)) return;
      if (!upcomingAndDeliveredFuel.has(fuelName))
        upcomingAndDeliveredFuel.set(fuelName, 0);
      upcomingAndDeliveredFuel.set(
        fuelName,
        upcomingAndDeliveredFuel.get(fuelName)! + (sub.gallons ?? 0),
      );
    });

    upcomingSubDeliveries.value.forEach((sub) => {
      const fuelName = sub.fuelSpecs?.name;
      if (!exists(fuelName)) return;
      if (!upcomingAndDeliveredFuel.has(fuelName))
        upcomingAndDeliveredFuel.set(fuelName, 0);
      upcomingAndDeliveredFuel.set(
        fuelName,
        upcomingAndDeliveredFuel.get(fuelName)! + 0,
      );
    });

    return upcomingAndDeliveredFuel;
  });

  function totalToDeliverForGivenFuelType(fueltype: FuelType) {
    return upcomingSubDeliveries.value.reduce((total, sub) => {
      if (sub.fuelSpecs?.name === fueltype.name) {
        total += sub.gallons ?? 0;
      }
      return total;
    }, 0);
  }

  const totalGallons = useFormula(() =>
    formatNumWithCommas(
      completedSubDeliveriesSince3am.value.reduce(
        (total, sub) => total + (sub.gallons ?? 0),
        0,
      ),
      0,
    ),
  );
  const totalSales = useFormula(() =>
    formatNumWithCommas(
      completedSubDeliveriesSince3am.value.reduce(
        (total, sub) => total + sub.sales,
        0,
      ),
      0,
    ),
  );

  function findFuelType(fuelName: string) {
    return FuelType.sortedFuelTypes.find((fuel) => fuel.name === fuelName);
  }

  const [shouldShowTotals, setShouldShowTotals] = createSignal(true);

  function ToggleTotals() {
    shouldShowTotals() === false
      ? setShouldShowTotals(true)
      : setShouldShowTotals(false);
  }

  return (
    <Card widthGrows padBetween={0.75}>
      <Show when={shouldShowTotals()}>
        <For
          each={Array.from(upcomingAndDeliveredFuel.value.entries())}
          fallback={<Txt hint>No upcoming sub-deliveries.</Txt>}
        >
          {([fuelName, deliveredGallons]) => (
            <Txt widthGrows alignTopLeft overflowXWraps>
              <span>
                {fuelName}:{" "}
                <div
                  style={{
                    display: `inline-block`,
                    "vertical-align": `top`,
                  }}
                >
                  <Field
                    underlined
                    widthGrows
                    minWidth={3}
                    value={useFormula(
                      () => findFuelType(fuelName)?.amountOfFuel!,
                      (v) => {
                        const fuelType = findFuelType(fuelName);
                        if (fuelType) {
                          fuelType.amountOfFuel = v;
                        }
                      },
                    )}
                    formatInput={formatIdNumber}
                  />
                </div>{" "}
                gal. in truck at start. Delivered{" "}{deliveredGallons}{" "}gal. About
                {" "}{totalToDeliverForGivenFuelType(findFuelType(fuelName)!)}{" "}gal.
                left to deliver.
              </span>
            </Txt>
          )}
        </For>
      </Show>
      <Icon
        stroke={$theme.colors.primary}
        iconPath={
          shouldShowTotals()
            ? mdiArrowUpCircleOutline
            : mdiArrowDownCircleOutline
        }
        scale={2}
        onClick={() => {
          ToggleTotals();
        }}
      />

      <Box widthGrows height={0.125} fill={$theme.colors.text} />
      {/* <Show when={Array.from(leftPerFuel.value.entries()).length > 0}>
        <Txt bold alignCenter>
          Upcoming
        </Txt>
        <For
          each={Array.from(leftPerFuel.value.entries())}
          fallback={<Txt hint>No upcoming sub-deliveries.</Txt>}
        >
          {([fuelName, gallons]) => (
            <Row>
              <Txt widthGrows alignLeft singleLine>
                {fuelName}
              </Txt>
              <Txt width={6} alignLeft singleLine>
                gal: {gallons}
              </Txt>
            </Row>
          )}
        </For>
        <Box widthGrows height={0.125} fill={$theme.colors.text} />
      </Show> */}
      <Column>
        <Txt widthGrows={4} alignLeft>
          Fuel Delivered: {totalGallons.value} gal.
        </Txt>
        <Txt widthGrows={3} alignLeft>
          Today's Sales: ${totalSales.value}
        </Txt>
      </Column>
    </Card>
  );
}
