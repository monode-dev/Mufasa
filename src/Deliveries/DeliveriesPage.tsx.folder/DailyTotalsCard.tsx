import { Card, Txt, useFormula, Row, Icon, useProp } from "miwi";
import { Delivery } from "../Delivery";
import { formatNumWithCommas } from "@/utils";
import { For, Show } from "solid-js";
import { HorizontalDivider } from "@/components/HorizontalDivider";
import { mdiChevronDown, mdiChevronLeft } from "@mdi/js";
import {
  compileAllFuelTotals,
  RunningTotalsForFuel,
} from "./DailyTotalsCard.tsx.folder/RunningTotalsForFuel";

export function DailyTotalsCard() {
  const isExpanded = useProp(false);

  const upcomingSubDeliveries = useFormula(() => {
    return Delivery.currentUsersUpcomingDeliveries.flatMap((delivery) =>
      delivery.sortedSubDeliveries.filter((sub) => !sub.isCompleted),
    );
  });

  const completedSubDeliveriesSince3am = useFormula(() =>
    Delivery.usersDeliveriesSince3am.flatMap((delivery) =>
      delivery.sortedSubDeliveries.filter((sub) => sub.isCompleted),
    ),
  );

  const allFuelTotals = useFormula(() =>
    compileAllFuelTotals({
      upcomingSubDeliveries: upcomingSubDeliveries.value,
      completedSubDeliveriesSince3am: completedSubDeliveriesSince3am.value,
    }),
  );

  return (
    <Card widthGrows padBetween={1}>
      {/* Title */}
      <Row onClick={() => (isExpanded.value = !isExpanded.value)}>
        <Txt widthGrows bold>
          Running Totals
        </Txt>
        <Icon
          scale={1.25}
          iconPath={isExpanded.value ? mdiChevronDown : mdiChevronLeft}
        />
      </Row>

      {/* Body */}
      <Show when={isExpanded.value}>
        {/* Running Fuel Totals */}
        <Show when={allFuelTotals.value.length > 0}>
          <For
            each={allFuelTotals.value}
            fallback={<Txt hint>No upcoming sub-deliveries.</Txt>}
          >
            {(thisFuelsTotals) => (
              <RunningTotalsForFuel fuelTotals={thisFuelsTotals} />
            )}
          </For>
          <HorizontalDivider />
        </Show>

        {/* Total Fuel Delivered */}
        <Txt widthGrows={4} alignLeft>
          Fuel Delivered:{" "}
          {formatNumWithCommas(
            completedSubDeliveriesSince3am.value.reduce(
              (total, sub) => total + (sub.gallons ?? 0),
              0,
            ),
            0,
          )}{" "}
          gal.
        </Txt>

        {/* Total Sales */}
        <Txt widthGrows={3} alignLeft>
          Today's Sales: $
          {formatNumWithCommas(
            completedSubDeliveriesSince3am.value.reduce(
              (total, sub) => total + sub.sales,
              0,
            ),
            0,
          )}
        </Txt>
      </Show>
    </Card>
  );
}
