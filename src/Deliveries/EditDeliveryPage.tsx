import { mdiArrowUpRight, mdiPlus } from "@mdi/js";
import {
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
  pushPage,
  exists,
  DeleteOption,
  theme,
  Prop,
  useProp,
  EnterKeyHint,
  DeleteDialog,
} from "miwi";
import { For, Show } from "solid-js";
import SubDeliveryCard from "./SubDeliveryCard";
import { Delivery } from "./Delivery";
import { DeliveryFields } from "./DeliveryFields";
import { SimplePage } from "@/components/SimplePage";
import { SimpleBody } from "@/components/SimpleBody";
import { InlineAppBar } from "@/components/InlineAppBar";
import { DeliveryCard } from "./DeliveriesPage.tsx.folder/DeliveryCard";
import { TotalsForDelivery } from "./DeliveriesPage.tsx.folder/DeliveryCard.tsx.folder/TotalsForDelivery";
import { HorizontalDivider } from "@/components/HorizontalDivider";
import { autoSavingProp } from "@/utils";

export function openDeleteDeliveryDialog(delivery: Delivery) {
  pushPage(DeleteDialog, {
    onDelete: () => delivery.deleteDoc(),
    message: `Are you sure you want to permanently delete this delivery?`,
  });
}

export function EditDeliveryPage(props: { delivery: Delivery }) {
  const relatedDeliveries = useFormula(() =>
    Delivery.completedDeliveries.filter(
      (delivery) =>
        exists(delivery.selectedClientDoc?.docId) &&
        exists(props.delivery.selectedClientDoc) &&
        delivery.selectedClientDoc.docId ===
          props.delivery.selectedClientDoc.docId,
    ),
  );

  const fieldRefs: Prop<Map<number, HTMLDivElement>> = useProp(new Map());
  // filled in enterKey() function in SubDeliveryCard.tsx
  const enterHintRefs: Prop<Map<number, EnterKeyHint>> = useProp(new Map());
  // filled in LastEnterHint function
  const nextOverride: Prop<Map<number, Prop<number>>> = useProp(new Map());
  
  const haveSortedSubdeliveryCards = autoSavingProp<boolean>(
    `haveSortedSubdeliveryCards`,
    false
  );

  return (
    <SimplePage>
      <InlineAppBar
        name="Edit Delivery"
        right={
          <HiddenOptions
            scale={1.125}
            cancelOptions={{
              stroke: theme.palette.hint,
            }}
          >
            <DeleteOption
              onClick={() => openDeleteDeliveryDialog(props.delivery)}
            />
          </HiddenOptions>
        }
        padBottom={0.5}
      />
      <SimpleBody
        /* We need to pad the top to give room for the shadow. */
        padTop={0.5}
      >
        {/* Client Card */}
        <Card pad={1} widthGrows alignLeft>
          <DeliveryFields delivery={props.delivery} />
          <HorizontalDivider />
          <TotalsForDelivery delivery={props.delivery} />
        </Card>

        {/* SECTION Sub Deliveries */}
        <Box />
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
              onPickUp={() => haveSortedSubdeliveryCards.value = true}
              shouldLog
              onSort={(sortProps) => {
                FloatSort.moveItem({
                  sortedList: props.delivery.sortedSubDeliveries,
                  fromIndex: sortProps.from,
                  toIndex: sortProps.to,
                  getPos: (delivery) => delivery.sortPosition,
                  setPos: (delivery, pos) => (delivery.sortPosition = pos),
                })
              }

              }
            >
              <For each={props.delivery.sortedSubDeliveries}>
                {(subDelivery, index) => {
                  const dex = index();
                  const next = dex + 1;
                  const nextSubDelivery = useFormula(() =>
                    next < props.delivery.sortedSubDeliveries.length
                      ? props.delivery.sortedSubDeliveries[next]
                      : undefined,
                  );
                  return (
                    <SubDeliveryCard
                      subDelivery={subDelivery}
                      nextSubDelivery={nextSubDelivery}
                      enterHintRefs={enterHintRefs}
                      fieldRefs={fieldRefs}
                      subDeliveryIndex={useProp(dex)}
                      nextOverride={nextOverride}
                      noKeyHandler
                    />
                  );
                }}
              </For>
            </SortableColumn>
            {/* Hint text for sorting sub-delivery cards*/}
            <Show when={!haveSortedSubdeliveryCards.value}>
              <Row stroke={$theme.colors.hint} padBetween={0.25} overflowYSpills>
                <Txt>Tap and hold to sort</Txt>
                <Box scale={1.25} padBottom={0.5} width={1} height={1}>
                  <Icon iconPath={mdiArrowUpRight} />
                </Box>
              </Row>
            </Show>
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
      </SimpleBody>
    </SimplePage>
  );
}
