import { mdiDotsVertical, mdiPlus } from "@mdi/js";
import {
  AppBar,
  Body,
  Box,
  Card,
  Column,
  FloatSort,
  HiddenDelete,
  Icon,
  Page,
  Row,
  SortableColumn,
  Txt,
  useFormula,
  mdColors,
  pushPage,
  exists,
} from "miwi";
import { For, Show, onMount } from "solid-js";
import SubDeliveryCard from "./SubDeliveryCard";
import DeleteDialog from "@/components/DeleteDialog";
import { Delivery } from "./Delivery";
import { DeliveryCard } from "./DeliveryCard";
import { DeliveryFields } from "./DeliveryFields";

export function DeliveryPage(props: { delivery: Delivery }) {
  const relatedDeliveries = useFormula(() =>
    Delivery.completedDeliveriesForAllUsers.filter(
      (delivery) =>
        exists(delivery.selectedKnownClient?.docId) &&
        exists(props.delivery.selectedClient) &&
        delivery.selectedKnownClient.docId === props.delivery.selectedClient,
    ),
  );

  function handleDeleteRequest() {
    pushPage(DeleteDialog, {
      obj: props.delivery,
      message: `Are you sure you want to permanently delete this delivery?`,
    });
  }
  onMount(() => {
    // requestAnimationFrame(() => {
    // logTime("DeliveryPage onRender");
    // });
  });

  return (
    <Page>
      <AppBar>
        <Txt h2>Edit Delivery</Txt>
      </AppBar>
      <Body>
        {/* SECTION Client */}
        <Row widthGrows alignX={$Align.spaceBetween} alignY={$Align.start}>
          <Icon iconPath={mdiDotsVertical} stroke={mdColors.transparent} />
          <Txt h2 widthGrows alignCenter>
            Client
          </Txt>
          <HiddenDelete onDelete={handleDeleteRequest} scale={1.125} />
        </Row>
        {/* Client Card */}
        <Card pad={1} widthGrows>
          <DeliveryFields delivery={props.delivery} />
        </Card>
        <Box />

        {/* SECTION Sub Deliveries */}
        <Row widthGrows alignX={$Align.spaceBetween}>
          <Box width={1.75} />
          <Txt h2>Individual Deliveries</Txt>
          <Box width={1.75} alignCenterLeft>
            <Icon
              iconPath={mdiPlus}
              scale={1.25}
              onClick={() => {
                props.delivery.createSubDelivery();
              }}
            />
          </Box>
        </Row>

        <Column padBetween={1}>
          <Show
            when={props.delivery.sortedSubDeliveries.length > 0}
            fallback={<Txt hint>Tap + to add an individual delivery.</Txt>}
          >
            <SortableColumn
              shouldLog
              onSort={(sortProps) =>
                FloatSort.moveItem({
                  sortedList: props.delivery.sortedSubDeliveries,
                  fromIndex: sortProps.from,
                  toIndex: sortProps.to,
                  getPos: (delivery) => delivery.sortPosition!,
                  setPos: (delivery, pos) => (delivery.sortPosition = pos),
                })
              }
            >
              <For each={props.delivery.sortedSubDeliveries}>
                {(subDelivery) => <SubDeliveryCard subDelivery={subDelivery} />}
              </For>
            </SortableColumn>
          </Show>
        </Column>

        {/* SECTION Related Deliveries */}
        <Show when={relatedDeliveries.value.length > 0}>
          <Box />
          <Txt h2>Related Deliveries</Txt>
          <For each={relatedDeliveries.value}>
            {(delivery) => <DeliveryCard delivery={delivery} />}
          </For>
        </Show>
      </Body>
    </Page>
  );
}
