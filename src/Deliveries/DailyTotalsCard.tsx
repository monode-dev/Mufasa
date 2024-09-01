import {
  Card,
  Txt,
  Column,
  useFormula,
  exists,
  Box,
  NumField,
  Row,
} from "miwi";
import { Delivery } from "./Delivery";
import { formatNumWithCommas } from "@/utils";
import { For, Show } from "solid-js";
import { FuelType } from "@/model/DataModel";

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

  const completedSubDeliveriesSince3am = useFormula(() =>
    Delivery.usersDeliveriesSince3am.flatMap((delivery) =>
      delivery.sortedSubDeliveries.filter((sub) => sub.isCompleted),
    ),
  );

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
        upcomingAndDeliveredFuel.get(fuelName)!,
      );
    });

    return upcomingAndDeliveredFuel;
  });

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

  return (
    <Card widthGrows padBetween={0.75}>
      <Show when={true /* shouldShowTotals() */}>
        <For
          each={Array.from(upcomingAndDeliveredFuel.value.entries())}
          fallback={<Txt hint>No upcoming sub-deliveries.</Txt>}
        >
          {([fuelName, deliveredGallons]) => (
            <Row padBetween={1 / 4} alignTopLeft>
              <Txt singleLine maxWidth={5}>{`${fuelName}:`}</Txt>
              <Txt widthGrows alignTopLeft overflowXWraps>
                <span>
                  <div
                    style={{
                      display: `inline-block`,
                      "vertical-align": `top`,
                    }}
                  >
                    <NumField
                      hint={`Enter`}
                      widthGrows
                      minWidth={3}
                      value={useFormula(
                        () => findFuelType(fuelName)?.fuelInTruck,
                        (v) => {
                          const fuelType = findFuelType(fuelName);
                          if (!exists(fuelType)) return;
                          fuelType.fuelInTruck = v ?? null;
                        },
                      )}
                    />
                  </div>{" "}
                  gal. in truck at start. Delivered{" "}
                  {formatNumWithCommas(deliveredGallons, 0)} gal. About{" "}
                  {formatNumWithCommas(
                    Math.max(
                      (findFuelType(fuelName)?.fuelInTruck ?? 0) -
                        deliveredGallons,
                      0,
                    ),
                    0,
                  )}{" "}
                  gal. left in truck and{" "}
                  {formatNumWithCommas(
                    upcomingSubDeliveries.value
                      .filter(
                        (sub) =>
                          sub.fuelSpecs?.name === findFuelType(fuelName)?.name,
                      )
                      .reduce((total, sub) => total + (sub.gallons ?? 0), 0),
                    0,
                  )}{" "}
                  gal. to deliver.
                </span>
              </Txt>
            </Row>
          )}
        </For>
      </Show>

      <Box widthGrows height={0.125} fill={$theme.colors.text} />
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
