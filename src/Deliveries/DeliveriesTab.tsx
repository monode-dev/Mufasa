import { mdiCheck, mdiCircleSmall, mdiPlus } from "@mdi/js";
import {
  Body,
  Box,
  Card,
  Column,
  FloatSort,
  Icon,
  Row,
  SortableColumn,
  Txt,
  pushPage,
} from "miwi";
import { For, Show } from "solid-js";
import { DeliveryPage } from "./DeliveryPage";
import { DeliveryCard } from "./DeliveryCard";
import { Delivery } from "./Delivery";
import { openCreateClientDialog } from "./CreateDeliveryDialog";
import { DailyTotalsCard } from "./DailyTotalsCard";
import { Client } from "@/Clients/Client";
import { mfs } from "@/model/DataModel";

export default function DeliveriesTab() {
  return (
    <Body padBetween={0.5}>
      {/* SECTION: Daily Totals */}
      <Txt h2>Today's Totals</Txt>
      <DailyTotalsCard />

      {/* SECTION: Scheduled Clients */}
      <Show
        when={
          [...(Client.getAllDocs() ?? [])].filter(
            (client) =>
              client.shouldScheduleDeliveriesForThisClient &&
              client.assignedTo === mfs.user.uid &&
              client.scheduledDeliveryStartDate &&
              Date.now() >= client.scheduledDeliveryStartDate,
          ).length >= 1
        }
      >
        <Txt h2 singleLine>
          Scheduled Clients:
        </Txt>
        <Column padBetween={1} overflowXCrops>
          <For each={[...(Client.getAllDocs() ?? [])]}>
            {(client) => (
              <Show
                when={
                  client.shouldScheduleDeliveriesForThisClient &&
                  client.assignedTo === mfs.user.uid &&
                  client.scheduledDeliveryStartDate &&
                  Date.now() >= client.scheduledDeliveryStartDate
                }
              >
                <Row padBetween={0.3} padRight={0.6}>
                  <Icon iconPath={mdiCircleSmall} scale={2} />
                  <Txt bold widthGrows>
                    {client.name} is due for a delivery.
                  </Txt>
                  <Icon
                    iconPath={mdiCheck}
                    scale={1.4}
                    stroke={$theme.colors.primary}
                    onClick={() => {
                      client.scheduledDeliveryStartDate =
                        client.scheduledDeliveryStartDate! +
                        client.weeksBetweenScheduledDeliveries! * 604800000;
                    }}
                  />
                </Row>
              </Show>
            )}
          </For>
        </Column>
      </Show>

      {/* SECTION: Upcoming Deliveries */}
      <Box height={1} />
      <Row widthGrows align={$Align.spaceBetween}>
        <Box width={1.75} />
        <Txt h2>Upcoming Deliveries</Txt>
        <Box width={1.75} align={$Align.centerLeft}>
          <Icon
            iconPath={mdiPlus}
            scale={1.25}
            onClick={() =>
              openCreateClientDialog({
                onCreate: (delivery) => {
                  pushPage(DeliveryPage, { delivery });
                },
              })
            }
          />
        </Box>
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
