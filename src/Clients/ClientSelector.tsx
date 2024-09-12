import { getClientLabel, listClients } from "@/AppData";
import { ONE_TIME } from "@/utils";
import {
  Box,
  Icon,
  Row,
  Selector,
  Prop,
  Txt,
  useFormula,
  exists,
  useProp,
  theme,
  pushPage,
} from "miwi";
import { For, Show } from "solid-js";
import { mdiPencil, mdiPlus } from "@mdi/js";
import { Client } from "./Client";
import { openCreateClientDialog } from "./CreateClientDialog";
import EditClientPage from "./EditClientPage";
import { Delivery } from "@/Deliveries/Delivery";
import { HorizontalDivider } from "@/components/HorizontalDivider";

// import { Selector } from "@/Mock/_Selector";

type CLIENT_TYPE = Client | typeof ONE_TIME | null | undefined;

export default function ClientSelector(props: {
  value: Prop<CLIENT_TYPE>;
  onSelect?: (client: CLIENT_TYPE) => void;
  showNewOption?: boolean;
  showOneTimeOption?: boolean;
  showScheduledClients?: boolean;
}) {
  const dropDownIsOpen = useProp(false);
  function selectOption(newClient: CLIENT_TYPE) {
    props.value.value = newClient;
    dropDownIsOpen.value = false;
    props.onSelect?.(newClient);
  }
  const filterString = useProp(``);
  const filteredClients = useFormula(() => {
    const allClients = listClients(Client.getAllDocs(), true);
    if (filterString.value.length === 0) return allClients;
    const lowerCaseFilterString = filterString.value.toLowerCase();
    return allClients.filter(
      (client) =>
        (client.name?.toLowerCase().includes(lowerCaseFilterString) ?? false) ||
        (client.clientId?.toLowerCase().includes(lowerCaseFilterString) ??
          false),
    );
  });

  const clientsAreFiltered = useFormula(() => filterString.value !== ``);
  const { todaysClients: _todaysClients, tomorrowsClients: _tomorrowsClients } =
    Client.getScheduledClients();
  console.log(_todaysClients, _tomorrowsClients);
  const upcomingClients = useFormula(
    () =>
      new Set(
        Delivery.currentUsersUpcomingDeliveries
          .map((delivery) => delivery.selectedClientDoc)
          .filter(exists),
      ),
  );
  const todaysClients = useFormula(() => {
    const clientsDeliveredToSince3Am = new Set(
      Delivery.usersDeliveriesSince3am
        .map((delivery) => delivery.selectedClientDoc)
        .filter(exists),
    );
    return _todaysClients.filter(
      (client) =>
        !upcomingClients.value.has(client) &&
        !clientsDeliveredToSince3Am.has(client),
    );
  });
  const tomorrowsClients = useFormula(() => {
    return _tomorrowsClients.filter(
      (client) => !upcomingClients.value.has(client),
    );
  });

  return (
    <Selector
      value={props.value.value}
      hintText="Select Client"
      isOpen={dropDownIsOpen}
      //modalIsOpenSig={dropDownIsOpen}
      getLabelForData={(data: CLIENT_TYPE) => {
        if (!exists(data)) return null;
        if (data === ONE_TIME) return `One Time`;
        if (!exists(data.docId)) return null;
        return getClientLabel(data) ?? `Unnamed Client`;
      }}
      filterString={filterString}
      // isWide
      noOptionsText={`No Clients`}
      cancelOptions={{
        stroke: theme.palette.hint,
      }}
      actionButtons={
        <Show
          when={exists(props.value.value) && props.value.value !== ONE_TIME}
        >
          <Icon
            iconPath={mdiPencil}
            onClick={() => {
              if (exists(props.value.value) && props.value.value !== ONE_TIME) {
                pushPage(EditClientPage, { client: props.value.value });
              }
            }}
          />
        </Show>
      }
    >
      <Show when={!clientsAreFiltered.value}>
        <Show when={props.showNewOption}>
          {/* New Client */}
          <Row
            onClick={() =>
              openCreateClientDialog({
                onCreate: (newObject) => selectOption(newObject),
              })
            }
            widthGrows
            padBetween={0.125}
            align={$Align.centerLeft}
            stroke={$theme.colors.primary}
          >
            <Txt>New</Txt>
            <Icon iconPath={mdiPlus} />
          </Row>
        </Show>
        <Show when={props.showOneTimeOption}>
          {/* One Time */}
          <Txt
            widthGrows
            onClick={() => {
              selectOption(ONE_TIME);
            }}
            padBetween={0.125}
            stroke={theme.palette.primary}
          >
            One Time
          </Txt>
        </Show>
        <Show
          when={props.showScheduledClients && todaysClients.value.length > 0}
        >
          <HorizontalDivider />
          {/* Scheduled Clients */}
          <Txt widthGrows alignCenterLeft bold>
            Scheduled Today:
          </Txt>
          <For each={todaysClients.value}>
            {(client) => (
              <Txt
                onClick={() => selectOption(client)}
                widthGrows
                heightShrinks
                overflowX={$Overflow.wrap}
                stroke={$theme.colors.text}
              >
                {getClientLabel(client)}
              </Txt>
            )}
          </For>
        </Show>
        <Show
          when={props.showScheduledClients && tomorrowsClients.value.length > 0}
        >
          <HorizontalDivider />
          {/* Scheduled Clients */}
          <Txt widthGrows alignCenterLeft bold>
            Scheduled Tomorrow:
          </Txt>
          <For each={tomorrowsClients.value}>
            {(client) => (
              <Txt
                onClick={() => selectOption(client)}
                widthGrows
                heightShrinks
                overflowX={$Overflow.wrap}
                stroke={$theme.colors.text}
              >
                {getClientLabel(client)}
              </Txt>
            )}
          </For>
        </Show>
        {/* Divider */}
        <Show when={props.showNewOption || props.showOneTimeOption}>
          <HorizontalDivider />
        </Show>
      </Show>
      {/* Clients */}
      <Show when={filteredClients.value.length === 0}>
        <Txt
          onClick={() => {
            dropDownIsOpen.value = false;
          }}
          hint
          widthGrows
        >
          No Clients
        </Txt>
      </Show>
      <For each={filteredClients.value}>
        {(client) => (
          <Txt
            onClick={() => {
              selectOption(client);
            }}
            widthGrows
            heightShrinks
            overflowX={$Overflow.wrap}
            stroke={$theme.colors.text}
          >
            {getClientLabel(client)}
          </Txt>
        )}
      </For>
    </Selector>
  );
}
