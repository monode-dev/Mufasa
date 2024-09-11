import { Delivery } from "@/Deliveries/Delivery";
import { doNow, exists, Txt, formatNumWithCommas, Row } from "miwi";
import { For } from "solid-js";

export function TotalsForDelivery(props: { delivery: Delivery }) {
  return (
    <>
      <For
        each={doNow(() => {
          // TODO: Make this based off of fuel id not fuel name
          const totalPerFuelType = new Map<string, number>();
          props.delivery.sortedSubDeliveries.forEach((sub) => {
            const fuelName = sub.fuelSpecs?.name;
            if (!exists(fuelName)) return;
            totalPerFuelType.set(
              fuelName,
              Math.ceil(
                ((totalPerFuelType.get(fuelName) ?? 0) +
                  (sub.isCompleted ? sub.sales ?? 0 : 0)) *
                  100,
              ) / 100,
            );
          });
          return Array.from(totalPerFuelType.entries());
        })}
      >
        {([FuelName, totalSalesWorth]) => (
          <Txt singleLine widthGrows alignLeft>
            {FuelName}: ${formatNumWithCommas(totalSalesWorth, 2)}
          </Txt>
        )}
      </For>
      <Row>
        <Txt bold widthGrows singleLine alignLeft>
          Total: ${props.delivery.totalMoney}
        </Txt>
      </Row>
    </>
  );
}
