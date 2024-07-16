import { Card, Txt, Column, useFormula, exists, Box } from "miwi";
import { Delivery } from "./Delivery";
import { formatNumWithCommas } from "@/utils";
import { For, Show } from "solid-js";

export function DailyTotalsCard() {
  const upcomingSubDeliveries = useFormula(() => {
    return Delivery.upcomingDeliveries.flatMap((delivery) =>
      delivery.floatSortedSubDeliveries.filter((sub) => !sub.isCompleted),
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
      delivery.floatSortedSubDeliveries.filter(
        (sub) =>
          sub.isCompleted && (sub.completedTimePosix ?? 0) > threeAm.getTime(),
      ),
    );
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
  const totalIncome = useFormula(() =>
    formatNumWithCommas(
      completedSubDeliveriesSince3am.value.reduce(
        (total, sub) => total + sub.income,
        0,
      ),
      0,
    ),
  );

  return (
    <Card widthGrows padBetween={0.75}>
      <Show when={Array.from(leftPerFuel.value.entries()).length > 0}>
        <For
          each={Array.from(leftPerFuel.value.entries())}
          fallback={<Txt hint>No upcoming sub-deliveries.</Txt>}
        >
          {([fuelName, gallons]) => (
            <Txt widthGrows alignLeft>
              {fuelName}: {gallons} gal. left
            </Txt>
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
