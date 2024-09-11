import {
  Box,
  Column,
  FloatSort,
  Icon,
  pushPage,
  Row,
  SortableColumn,
  Txt,
} from "miwi";
import { mdiArrowUpLeft, mdiArrowUpRight, mdiMenu, mdiPlus } from "@mdi/js";
import { SettingsPage } from "../settings/SettingsPage";
import { mfs } from "../model/DataModel";
import { SimplePage } from "../components/SimplePage";
import { InlineAppBar } from "../components/InlineAppBar";
import { SimpleBody } from "../components/SimpleBody";
import { For, Show } from "solid-js";
import { openCreateDeliveryDialog } from "./CreateDeliveryDialog";
import { Delivery } from "./Delivery";
import { EditDeliveryPage } from "./EditDeliveryPage";
import { DailyTotalsCard } from "./DeliveriesPage.tsx.folder/DailyTotalsCard";
import { DeliveryCard } from "./DeliveriesPage.tsx.folder/DeliveryCard";
import { autoSavingProp } from "@/utils";

export function DeliveriesPage() {
  
  const haveSortedUpcomingDeliveryCards = autoSavingProp<boolean>(
    `haveSortedUpcomingDeliveryCards`,
    false
  );

  // Preload the other members
  if (mfs.user.workspace?.role === `owner`) {
    mfs.user.workspace.otherMembers;
  }
  return (
    <SimplePage>
      <InlineAppBar
        name="Ninety Percent"
        right={
          <Icon
            iconPath={mdiMenu}
            onClick={() => {
              pushPage(SettingsPage, {});
            }}
          />
        }
        padBottom={0.5}
      />

      <SimpleBody
        /* We need to pad the top to give room for the shadow. */
        padTop={0.5}
        padBetween={0.5}
      >
        {/* SECTION: Daily Totals */}
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
                  pushPage(EditDeliveryPage, { delivery });
                },
              })
            }
          />
        </Row>
        <Column padBetween={1}>
          <SortableColumn
            onSort={(props) =>
              {
                haveSortedUpcomingDeliveryCards.value = true
                
                FloatSort.moveItem({
                  sortedList: Delivery.currentUsersUpcomingDeliveries,
                  fromIndex: props.from,
                  toIndex: props.to,
                  getPos: (delivery) => delivery.sortPosition,
                  setPos: (delivery, pos) => (delivery.sortPosition = pos),
                })
              }
            }
          >
            <For
              each={Delivery.currentUsersUpcomingDeliveries}
              fallback={<Txt hint>Tap + to plan a new delivery.</Txt>}
            >
              {(delivery) => <DeliveryCard delivery={delivery} />}
            </For>
          </SortableColumn>

            {/* Hint text for sorting */}
            <Show when={haveSortedUpcomingDeliveryCards.value === false}>
            <Row stroke={$theme.colors.hint} padBetween={0.25} overflowYSpills>
              <Txt>Tap and hold to sort</Txt>
              <Box scale={1.25} padBottom={0.5} width={1} height={1}>
                <Icon iconPath={mdiArrowUpRight} />
              </Box>
            </Row>
          </Show>
        </Column>
        {/* SECTION: Completed Deliveries */}
        <Box height={1} />
        <Txt h2>Completed Deliveries</Txt>
        <Column padBetween={1}>
          <For
            each={Delivery.currentUsersCompletedDeliveries.filter(
              (_, i) => i < 30,
            )}
            fallback={<Txt hint>No Completed Deliveries</Txt>}
          >
            {(delivery) => <DeliveryCard delivery={delivery} />}
          </For>
        </Column>
      </SimpleBody>
    </SimplePage>
  );
}
