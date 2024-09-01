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
  theme,
  useFormula,
} from "miwi";
import { For, Show } from "solid-js";
import { DeliveryPage } from "./DeliveryPage";
import { DeliveryCard } from "./DeliveryCard";
import { Delivery } from "./Delivery";
import { openCreateDeliveryDialog } from "./CreateDeliveryDialog";
import { DailyTotalsCard } from "./DailyTotalsCard";
import { Client } from "@/Clients/Client";
import { mfs } from "@/model/DataModel";
import { withLimitConfirmation } from "@/model/LimitUi";

export default function DeliveriesTab() {
  const scheduledClients = useFormula(() => {
    return Client.getAllDocs().filter(
      (client) =>
        client.shouldScheduleDeliveriesForThisClient &&
        client.assignedTo === mfs.user.uid &&
        client.scheduledDeliveryStartDate &&
        // TODO: Flesh this out
        Date.now() >= client.scheduledDeliveryStartDate,
    );
  });
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
        <For each={scheduledClients.value}>
          {(client) => (
            <Row alignCenterLeft stroke={theme.palette.hint}>
              {/* TODO: Handle tomorrow */}
              <Txt bold widthGrows>
                {client.name} is due for a delivery.
              </Txt>
              <Icon
                iconPath={mdiPlus}
                scale={1.25}
                stroke={theme.palette.primary}
                onClick={() =>
                  withLimitConfirmation({
                    count: Delivery.limit.count,
                    limit: Delivery.limit.max,
                    labelSingular: `Delivery`,
                    labelPlural: `Deliveries`,
                    action: () => {
                      const delivery = Delivery.create({
                        _isOneTimeClient: false,
                        _client: client,
                        sortPosition: Date.now(),
                        creationTimePosix: Date.now(),
                        createdBy: mfs.user.uid ?? null,
                      });
                      pushPage(DeliveryPage, { delivery });
                    },
                  })
                }
              />
            </Row>
          )}
        </For>
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
            fallback={
              <Show when={scheduledClients.value.length === 0}>
                <Txt hint>Tap + to plan a new delivery.</Txt>
              </Show>
            }
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
