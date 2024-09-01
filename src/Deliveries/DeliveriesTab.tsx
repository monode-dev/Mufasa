import { mdiPlus } from "@mdi/js";
import {
  Body,
  Box,
  Column,
  FloatSort,
  Icon,
  Row,
  SortableColumn,
  Txt,
  pushPage,
} from "miwi";
import { For } from "solid-js";
import { DeliveryPage } from "./DeliveryPage";
import { DeliveryCard } from "./DeliveryCard";
import { Delivery } from "./Delivery";
import { openCreateDeliveryDialog } from "./CreateDeliveryDialog";
import { DailyTotalsCard } from "./DailyTotalsCard";

export default function DeliveriesTab() {
  return (
    <Body padBetween={0.5}>
      {/* SECTION: Daily Totals */}
      <Txt h2>Today's Totals</Txt>
      <DailyTotalsCard />

      {/* SECTION: Upcoming Deliveries */}
      <Box height={1} />
      <Row widthGrows spaceBetween>
        <Box width={1.25} />
        <Txt h2>Upcoming Deliveries</Txt>
        <Icon
          iconPath={mdiPlus}
          scale={1.25}
          onClick={() =>
            openCreateDeliveryDialog({
              onCreate: (delivery) => {
                pushPage(DeliveryPage, { delivery });
              },
            })
          }
        />
      </Row>
      <Column padBetween={1}>
        <SortableColumn
          onSort={(props) =>
            FloatSort.moveItem({
              sortedList: Delivery.currentUsersUpcomingDeliveries,
              fromIndex: props.from,
              toIndex: props.to,
              getPos: (delivery) => delivery.sortPosition,
              setPos: (delivery, pos) => (delivery.sortPosition = pos),
            })
          }
        >
          <For
            each={Delivery.currentUsersUpcomingDeliveries}
            fallback={<Txt hint>Tap + to plan a new delivery.</Txt>}
          >
            {(delivery) => <DeliveryCard delivery={delivery} />}
          </For>
        </SortableColumn>
      </Column>
      {/* SECTION: Completed Deliveries */}
      <Box height={1} />
      <Txt h2>Completed Deliveries</Txt>
      <Column padBetween={1}>
        <For
          each={Delivery.currentUsersCompletedDeliveries.filter(
            (_, i) => i < 20,
          )}
          fallback={<Txt hint>No Completed Deliveries</Txt>}
        >
          {(delivery) => <DeliveryCard delivery={delivery} />}
        </For>
      </Column>
    </Body>
  );
}
