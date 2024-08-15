import { For, createEffect } from "solid-js";
import { listTanks } from "@/AppData";
import {
  AppBar,
  Body,
  Box,
  Column,
  FloatSort,
  Icon,
  Page,
  Row,
  SortableColumn,
  Txt,
  mdColors,
  popPage,
  useFormula,
  pushPage,
  useNav,
  exists,
  Card,
} from "miwi";
import { mdiCog, mdiDotsVertical, mdiPlus } from "@mdi/js";
import { ClientFields } from "./ClientFields";
import { SettingsPage } from "@/settings/SettingsPage";
import DeleteDialog from "@/components/DeleteDialog";
import { TankCard } from "@/Tanks/TankCard";
import { CallAndMapButtons } from "./CallAndMapToButtons";
import { Delivery } from "@/Deliveries/Delivery";
import { DeliveryCard } from "@/Deliveries/DeliveryCard";
import { Client } from "./Client";
import { openCreateTankDialog } from "@/Tanks/CreateTankDialog";
import { HiddenOptions } from "@/components/HiddenOptions";

export default function ClientPage(props: { client: Client }) {
  createEffect(() => {
    if (props.client.isDeleted) {
      popPage();
    }
  });

  const nav = useNav();

  const sortedTanks = useFormula(() => listTanks(props.client.tanks));
  const relatedDeliveries = useFormula(() =>
    Delivery.completedDeliveries.filter(
      (delivery) =>
        exists(delivery.selectedClientDoc?.docId) &&
        exists(props.client.docId) &&
        delivery.selectedClientDoc.docId === props.client.docId,
    ),
  );

  function deletePressed() {
    pushPage(DeleteDialog, {
      obj: props.client,
      message: `Are you sure you want to permanently delete "${
        props.client.clientId ?? ``
      } ${props.client.clientId && props.client.name ? ` - ` : ``} ${
        props.client.name ?? ``
      }"?`,
    });
  }


  return (
    <Page>
      <AppBar
        shadowSize={1.25}
        right={
          <Icon
            iconPath={mdiCog}
            onClick={() => {
              nav.pushPage(SettingsPage, {});
            }}
          />
        }
      >
        {/* Client Info */}
        <Txt h1>Edit Client</Txt>
      </AppBar>
      <Body padBetween={0.5}>
        <Row widthGrows alignX={$Align.spaceBetween} alignY={$Align.start}>
          <Icon iconPath={mdiDotsVertical} stroke={mdColors.transparent} />
          <Txt h2>Client Info</Txt>
          <HiddenOptions showIcons onDelete={deletePressed} />
        </Row>
        <Card>
          <ClientFields
            client={useFormula(
              () => props.client ?? '',
              (val) => (props.client = val),
            )}
            name={useFormula(
              () => props.client.name ?? ``,
              (val) => (props.client.name = val),
            )}
            clientId={useFormula(
              () => props.client.clientId ?? ``,
              (val) => (props.client.clientId = val),
            )}
            phoneNumber={useFormula(
              () => props.client.phoneNumber ?? ``,

              (val) => (props.client.phoneNumber = val),
            )}
            address={useFormula(
              () => props.client.address ?? ``,
              (val) => (props.client.address = val),
            )}
            notes={useFormula(
              () => props.client.notes ?? ``,
              (val) => (props.client.notes = val),
            )}
            offsetRate={useFormula(
              () => props.client.offsetRate ?? 0,
              (val) => (props.client.offsetRate = val),
            )}
          />
          <CallAndMapButtons
            phoneNumber={props.client.phoneNumber}
            address={props.client.address}
          />
        </Card>

        <Box height={1} />

        {/* Tanks */}
        <Row widthGrows alignX={$Align.spaceBetween}>
          <Box width={1.75} />
          <Txt h2>Tanks</Txt>
          <Box width={1.75} alignCenterLeft>
            <Icon
              iconPath={mdiPlus}
              scale={1.25}
              onClick={() => openCreateTankDialog({ client: props.client })}
            />
          </Box>
        </Row>
        <Column padBetween={1}>
          <SortableColumn
            onSort={(props) =>
              FloatSort.moveItem({
                sortedList: sortedTanks.value,
                fromIndex: props.from,
                toIndex: props.to,
                getPos: (tank) => tank.sortPos!,
                setPos: (tank, pos) => (tank.sortPos = pos),
              })
            }
          >
            <For
              each={sortedTanks.value}
              fallback={<Txt hint>Tap + to add tanks.</Txt>}
            >
              {(tank) => <TankCard tank={tank} client={props.client} />}
            </For>
          </SortableColumn>
        </Column>

        <Box height={1} />
        <Row widthGrows alignX={$Align.spaceBetween}>
          <Box width={1.75} />
          <Txt h2>Related Deliveries</Txt>
          <Box width={1.75} alignCenterLeft>
            <Box width={1.75} />
            {/* <Icon
            iconPath={mdiPlus}
            scale={1.25}
            onClick={() =>
              pushPage(CreateTankDialog, { client: props.client })
            }
          /> */}
          </Box>
        </Row>
        <Column padBetween={1}>
          <For
            each={relatedDeliveries.value}
            fallback={<Txt hint>No deliveries to this Client.</Txt>}
          >
            {(delivery) => <DeliveryCard delivery={delivery} />}
          </For>
        </Column>
      </Body>
    </Page>
  );
}
