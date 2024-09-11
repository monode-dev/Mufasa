import { For } from "solid-js";
import { listTanks } from "@/AppData";
import {
  AppBar,
  Body,
  Box,
  Column,
  FloatSort,
  Icon,
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
  HiddenOptions,
  DeleteOption,
  theme,
  doWatch,
  DeleteDialog,
} from "miwi";
import { mdiCog, mdiDotsVertical, mdiPlus } from "@mdi/js";
import { ClientFields } from "./ClientFields";
import { SettingsPage } from "@/settings/SettingsPage";
import { TankCard } from "@/Tanks/TankCard";
import { CallAndMapButtons } from "./CallAndMapToButtons";
import { Delivery } from "@/Deliveries/Delivery";
import { Client } from "./Client";
import { openCreateTankDialog } from "@/Tanks/CreateTankDialog";
import { SimplePage } from "@/components/SimplePage";
import { InlineAppBar } from "@/components/InlineAppBar";
import { SimpleBody } from "@/components/SimpleBody";
import { DeliveryCard } from "@/Deliveries/DeliveriesPage.tsx.folder/DeliveryCard";

export function openDeleteClientDialog(client: Client) {
  pushPage(DeleteDialog, {
    message: `Are you sure you want to permanently delete "${
      client.clientId ?? ``
    }${client.clientId && client.name ? ` - ` : ``}${client.name ?? ``}"?`,
    onDelete: () => client.deleteDoc(),
  });
}

export default function EditClientPage(props: { client: Client }) {
  doWatch(() => {
    if (props.client.isDeleted) popPage();
  });
  const sortedTanks = useFormula(() => listTanks(props.client.tanks));

  return (
    <SimplePage>
      <InlineAppBar
        name="Edit Client"
        right={
          <HiddenOptions
            cancelOptions={{
              stroke: theme.palette.hint,
            }}
          >
            <DeleteOption
              onClick={() => openDeleteClientDialog(props.client)}
            />
          </HiddenOptions>
        }
        padBottom={0.5}
      />
      <SimpleBody
        padBetween={0.5}
        /* We need to pad the top to give room for the shadow. */
        padTop={0.5}
      >
        <Card>
          <ClientFields
            // client={useFormula(
            //   () => props.client ?? '',
            //   (val) => (props.client = val),
            // )}
            shouldScheduleDeliveriesForThisClient={useFormula(
              () => props.client.shouldScheduleDeliveriesForThisClient ?? false,
              (val) =>
                (props.client.shouldScheduleDeliveriesForThisClient = val),
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
            rateOffset={useFormula(
              () => props.client.rateOffset,
              (val) => (props.client.rateOffset = val),
            )}
            weeksBetweenScheduledDeliveries={useFormula(
              () => props.client.weeksBetweenScheduledDeliveries,
              (val) => (props.client.weeksBetweenScheduledDeliveries = val),
            )}
            weekday={useFormula(
              () => props.client.weekday,
              (val) => (props.client.weekday = val),
            )}
            scheduledDeliveryStartDate={useFormula(
              () => props.client.scheduledDeliveryStartDate,
              (val) => (props.client.scheduledDeliveryStartDate = val),
            )}
            assignedTo={useFormula(
              () => props.client.assignedTo,
              (val) => (props.client.assignedTo = val),
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
            each={Delivery.completedDeliveries.filter(
              (delivery) =>
                exists(delivery.selectedClientDoc?.docId) &&
                exists(props.client.docId) &&
                delivery.selectedClientDoc.docId === props.client.docId,
            )}
            fallback={<Txt hint>No deliveries to this Client.</Txt>}
          >
            {(delivery) => <DeliveryCard delivery={delivery} />}
          </For>
        </Column>
      </SimpleBody>
    </SimplePage>
  );
}
