import {
  Box,
  Icon,
  Row,
  Txt,
  useFormula,
  doNow,
  mdColors,
  pushPage,
  useProp,
  Field,
} from "miwi";
import { mdiClose, mdiMagnify, mdiPlus } from "@mdi/js";
import { For, Show } from "solid-js";
import ClientEntry from "./ClientEntry";
import { openCreateClientDialog } from "./CreateClientDialog";
import ClientPage from "./ClientPage";
import { Client } from "./Client";
import { InlineAppBar } from "@/components/InlineAppBar";
import { SimpleBody } from "@/components/SimpleBody";
import { SimplePage } from "@/components/SimplePage";

export default function ClientsPage() {
  const filterString = useProp(``);
  const isSearching = doNow(() => {
    const isSearching = useProp(false);
    return useFormula(
      () => isSearching.value,
      (val) => {
        isSearching.value = val;
        filterString.value = ``;
      },
    );
  });

  // Filter clients based on the search string.
  const filteredClients = useFormula(() => {
    const asArray = [...(Client.getAllDocs() ?? [])];
    const filtered =
      filterString.value.length === 0
        ? asArray
        : asArray.filter((client) => {
            return (
              (client.name
                ?.toLowerCase()
                .includes(filterString.value.toLowerCase()) ??
                false) ||
              (client.clientId
                ?.toLowerCase()
                .includes(filterString.value.toLowerCase()) ??
                false)
            );
          });
    return filtered
      .sort((a, b) => (a.name ?? ``).localeCompare(b.name ?? ``))
      .slice(0, Math.min(75, filtered.length));
  });

  const createClient = () =>
    openCreateClientDialog({
      initName: Number.isNaN(Number(filterString.value))
        ? filterString.value
        : undefined,
      initClientId: Number.isNaN(Number(filterString.value))
        ? undefined
        : filterString.value,
      onCreate: (newObject) => {
        pushPage(ClientPage, { client: newObject });
        if (isSearching.value) {
          requestAnimationFrame(() => (isSearching.value = false));
        }
      },
    });

  return (
    <SimplePage>
      {/* SECTION: App Bar */}
      <InlineAppBar
        name={`Clients`}
        right={
          <Row padBetween={1.25} scale={1.25}>
            <Show when={!isSearching.value}>
              <Icon
                iconPath={mdiMagnify}
                onClick={() => (isSearching.value = !isSearching.value)}
              />
            </Show>
            <Icon iconPath={mdiPlus} onClick={() => createClient()} />
          </Row>
        }
      />

      <SimpleBody>
        {/* SECTION: Search */}
        <Show when={isSearching.value}>
          <Row>
            <Row
              widthGrows
              padAroundY={0.25}
              // padAroundX={0.25}
              cornerRadius={0.75}
              align={$Align.centerLeft}
              stroke={mdColors.grey}
            >
              <Field
                hintText={"Search by Name or ID"}
                scale={1}
                widthGrows
                hasFocus={useProp(true)} // Check if this is correct !!!
                value={filterString}
              />
            </Row>
            <Icon
              iconPath={mdiClose}
              scale={1.25}
              onClick={() => (isSearching.value = false)}
            />
          </Row>
        </Show>

        {/* SECTION: Actions */}
        {/* TODO */}
        {/* <OutlinedActionButton
            action={"Add from CSV"}
            iconPath={mdiPlus}
            onClick={()=>pushPage(LoadCSVDialog, undefined)}
          /> */}
        <Show when={filterString.value.length > 0}>
          <Row
            widthGrows
            height={1}
            padBetween={0.1}
            stroke={mdColors.green}
            alignLeft
            onClick={() => createClient()}
          >
            <Txt>New Client</Txt>
            <Icon iconPath={mdiPlus} />
          </Row>
          <Box widthGrows height={0.125} fill={mdColors.grey} />
        </Show>

        {/* SECTION: Clients */}
        <For
          fallback={<Txt hint>Click the + button to create a new client.</Txt>}
          each={filteredClients.value}
        >
          {(client) => <ClientEntry client={client} />}
        </For>
      </SimpleBody>
    </SimplePage>
  );
}
