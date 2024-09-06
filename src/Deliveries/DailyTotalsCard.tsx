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
import { HorizontalDivider } from "@/components/HorizontalDivider";

export function DailyTotalsCard() {
  const upcomingSubDeliveries = useFormula(() => {
    return Delivery.upcomingDeliveries.flatMap((delivery) =>
      delivery.sortedSubDeliveries.filter((sub) => !sub.isCompleted),
    );
  });

  const completedSubDeliveriesSince3am = useFormula(() =>
    Delivery.usersDeliveriesSince3am.flatMap((delivery) =>
      delivery.sortedSubDeliveries.filter((sub) => sub.isCompleted),
    ),
  );

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

    return Array.from(upcomingAndDeliveredFuel.entries());
  });

  function findFuelType(fuelName: string) {
    return FuelType.sortedFuelTypes.find((fuel) => fuel.name === fuelName);
  }

  return (
    <Card widthGrows padBetween={0.75}>
      <Show when={upcomingAndDeliveredFuel.value.length > 0}>
        <For
          each={upcomingAndDeliveredFuel.value}
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
        <HorizontalDivider />
      </Show>

      <Column>
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
      </Column>
    </Card>
  );
}
