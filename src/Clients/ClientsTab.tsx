import {
  Body,
  Box,
  Column,
  Icon,
  Row,
  Txt,
  useFormula,
  doNow,
  mdColors,
  pushPage,
  useProp,
} from "miwi";
import ClientActionBar from "./ClientActionBar";
import { mdiPlus } from "@mdi/js";
import { For, Show } from "solid-js";
import ClientEntry from "./ClientEntry";
import CreateClientDialog from "./CreateClientDialog";
import ClientPage from "./ClientPage";
import { Client } from "./Client";

export default function ClientsTab() {
  const filterString = useProp(``);
  const isSearching = useProp(false);

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

  return (
    <Column heightGrows>
      <ClientActionBar filterString={filterString} isSearching={isSearching} />

      <Body heightGrows>
        <Show when={filterString.value.length > 0}>
          <Row
            widthGrows
            height={1}
            padBetween={0.1}
            stroke={mdColors.green}
            alignLeft
            onClick={() => {
              pushPage(CreateClientDialog, {
                initName: Number.isNaN(Number(filterString.value))
                  ? filterString.value
                  : undefined,
                initClientId: Number.isNaN(Number(filterString.value))
                  ? undefined
                  : filterString.value,
                onCreate: (newObject) => {
                  pushPage(ClientPage, { client: newObject });
                  // We delay this to prevent UI flicker.
                  doNow(async () => {
                    await new Promise((resolve) => setTimeout(resolve, 300));
                    isSearching.value = false;
                  });
                },
              });
            }}
          >
            <Txt>New Client</Txt>
            <Icon iconPath={mdiPlus} />
          </Row>
          <Box widthGrows height={0.125} fill={mdColors.grey} />
        </Show>
        <For fallback={<Txt hint>No Clients</Txt>} each={filteredClients.value}>
          {(client) => <ClientEntry client={client} />}
        </For>
      </Body>
    </Column>
  );
}
