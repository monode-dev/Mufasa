import { mdiDotsVertical, mdiPlus } from "@mdi/js";
import {
  AppBar,
  Body,
  Box,
  Card,
  Column,
  FloatSort,
  Icon,
  HiddenOptions,
  Row,
  SortableColumn,
  Txt,
  useFormula,
  mdColors,
  pushPage,
  exists,
  DeleteOption,
  theme,
} from "miwi";
import { For, Show, onMount } from "solid-js";
import SubDeliveryCard from "./SubDeliveryCard";
import DeleteDialog from "@/components/DeleteDialog";
import { Delivery } from "./Delivery";
import { DeliveryCard } from "./DeliveryCard";
import { DeliveryFields } from "./DeliveryFields";
import { SimplePage } from "@/components/SimplePage";

export function DeliveryPage(props: { delivery: Delivery }) {
  const relatedDeliveries = useFormula(() =>
    Delivery.completedDeliveries.filter(
      (delivery) =>
        exists(delivery.selectedClientDoc?.docId) &&
        exists(props.delivery.selectedClientDoc) &&
        delivery.selectedClientDoc.docId ===
          props.delivery.selectedClientDoc.docId,
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
    <SimplePage>
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
          <HiddenOptions
            scale={1.125}
            cancelOptions={{
              stroke: theme.palette.hint,
            }}
          >
            <DeleteOption onClick={handleDeleteRequest} />
          </HiddenOptions>
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
    </SimplePage>
  );
}
