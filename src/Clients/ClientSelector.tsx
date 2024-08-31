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
import ClientPage from "./ClientPage";

// import { Selector } from "@/Mock/_Selector";

type CLIENT_TYPE = Client | typeof ONE_TIME | null | undefined;

export default function ClientSelector(props: {
  value: Prop<CLIENT_TYPE>;
  showNewOption?: boolean;
  showOneTimeOption?: boolean;
}) {
  const dropDownIsOpen = useProp(false);
  function selectOption(newClient: CLIENT_TYPE) {
    props.value.value = newClient;
    dropDownIsOpen.value = false;
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

  return (
    <Selector
      value={props.value.value}
      noneLabel="Select Client"
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
                pushPage(ClientPage, { client: props.value.value });
              }
            }}
          />
        </Show>
      }
    >
      {!clientsAreFiltered.value && (
        <>
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
          {/* Divider */}
          <Show when={props.showNewOption || props.showOneTimeOption}>
            <Box
              widthGrows
              height={0.125}
              fill={theme.palette.hint}
              padBetween={0.125}
            />
          </Show>
        </>
      )}
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
