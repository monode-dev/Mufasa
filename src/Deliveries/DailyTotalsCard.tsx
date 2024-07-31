import { Card, Txt, Column, useFormula, exists, Box, Row } from "miwi";
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
  const leftPerFuel = useFormula(() => {
    const leftPerFuel = new Map<string, number>();
    upcomingSubDeliveries.value.forEach((sub) => {
      const fuelName = sub.fuelSpecs?.name;
      if (!exists(fuelName)) return;
      if (!leftPerFuel.has(fuelName)) leftPerFuel.set(fuelName, 0);
      leftPerFuel.set(
        fuelName,
        leftPerFuel.get(fuelName)! + (sub.gallons ?? 0),
      );
    });
    return leftPerFuel;
  });
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
  const deliveredPerFuel = useFormula(() => {
    const deliveredPerFuel = new Map<string, number>();
    completedSubDeliveriesSince3am.value.forEach((sub) => {
      const fuelName = sub.fuelSpecs?.name;
      if (!exists(fuelName)) return;
      if (!deliveredPerFuel.has(fuelName)) deliveredPerFuel.set(fuelName, 0);
      deliveredPerFuel.set(
        fuelName,
        deliveredPerFuel.get(fuelName)! + (sub.gallons ?? 0),
      );
    });
    return deliveredPerFuel;
  });
  // const fuelTotals = useFormula(() => {
  //   const fuelTotals = new Map<
  //     FuelType,
  //     {
  //       left: number;
  //       dailyTotal: number;
  //     }
  //   >();
  //   upcomingSubDeliveries.value.forEach((sub) => {
  //     const fuelName = sub.fuelSpecs?.name;
  //     if (!exists(fuelName)) return;
  //     if (!fuelTotals.has(fuelName))
  //       fuelTotals.set(fuelName, { left: 0, dailyTotal: 0 });
  //     fuelTotals.get(fuelName)!.left += sub.gallons ?? 0;
  //   });
  // });
  const totalGallons = useFormula(() =>
    formatNumWithCommas(
      completedSubDeliveriesSince3am.value.reduce(
        (total, sub) => total + (sub.gallons ?? 0),
        0,
      ),
      0,
    ),
  );
  const totalIncome = useFormula(() =>
    formatNumWithCommas(
      completedSubDeliveriesSince3am.value.reduce(
        (total, sub) => total + sub.income,
        0,
      ),
      0,
    ),
  );

  const uniqueSubDeliveries = completedSubDeliveriesSince3am.value;

  return (
    <Card widthGrows padBetween={0.75}>
      <Show when={Array.from(deliveredPerFuel.value.entries()).length > 0}>
        <Txt bold alignCenter>
          Delivered
        </Txt>
        <For
          each={Array.from(deliveredPerFuel.value.entries())}
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
      </Show>
      <Show when={Array.from(leftPerFuel.value.entries()).length > 0}>
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
      </Show>
      <Column>
        <Txt widthGrows={4} alignLeft>
          Fuel Delivered: {totalGallons.value} gal.
        </Txt>
        <Txt widthGrows={3} alignLeft>
          Today's Income: ${totalIncome.value}
        </Txt>
      </Column>
    </Card>
  );
}
