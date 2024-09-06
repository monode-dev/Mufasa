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
  Column,
  DeleteDialog,
  DeleteOption,
  HiddenOption,
  HiddenOptions,
  theme,
} from "miwi";
import { mdiClose, mdiMagnify, mdiPlus, mdiTankerTruck } from "@mdi/js";
import { For, Show } from "solid-js";
import { openCreateClientDialog } from "./CreateClientDialog";
import EditClientPage, { openDeleteClientDialog } from "./EditClientPage";
import { Client } from "./Client";
import { InlineAppBar } from "@/components/InlineAppBar";
import { SimpleBody } from "@/components/SimpleBody";
import { SimplePage } from "@/components/SimplePage";
import { isClientValid, getClientLabel } from "@/AppData";
import { openCreateDeliveryDialog } from "@/Deliveries/CreateDeliveryDialog";
import { EditDeliveryPage } from "@/Deliveries/EditDeliveryPage";
import { HorizontalDivider } from "@/components/HorizontalDivider";

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
            <Icon
              iconPath={mdiPlus}
              onClick={() =>
                openCreateClientDialog({
                  initName: Number.isNaN(Number(filterString.value))
                    ? filterString.value
                    : undefined,
                  initClientId: Number.isNaN(Number(filterString.value))
                    ? undefined
                    : filterString.value,
                  onCreate: (newObject) => {
                    pushPage(EditClientPage, { client: newObject });
                    if (isSearching.value) {
                      requestAnimationFrame(() => (isSearching.value = false));
                    }
                  },
                })
              }
            />
          </Row>
        }
      />

      <SimpleBody>
        {/* SECTION: Search */}
        <Show when={isSearching.value}>
          <Column padBetween={0.5}>
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
                scale={1.125}
                onClick={() => (isSearching.value = false)}
              />
            </Row>
            <HorizontalDivider />
          </Column>
        </Show>

        {/* SECTION: Actions */}
        {/* TODO */}
        {/* <OutlinedActionButton
            action={"Add from CSV"}
            iconPath={mdiPlus}
            onClick={()=>pushPage(LoadCSVDialog, undefined)}
          /> */}
        {/* <Show when={filterString.value.length > 0}>
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
          <HorizontalDivider />
        </Show> */}

        {/* SECTION: Clients */}
        <For
          fallback={<Txt hint>Click the + button to create a new client.</Txt>}
          each={Client.getAllDocs()
            .filter((client) => {
              if (filterString.value.length === 0) return true;
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
            })
            .sort((a, b) => (a.name ?? ``).localeCompare(b.name ?? ``))
            .slice(0, 75)}
        >
          {(client) => (
            <Row
              onClick={() => pushPage(EditClientPage, { client })}
              widthGrows
              height={1}
              spaceBetween
              stroke={
                isClientValid(client)
                  ? theme.palette.text
                  : theme.palette.warning
              }
            >
              <Txt widthGrows singleLine>
                {getClientLabel(client)}
              </Txt>
              <HiddenOptions
                cancelOptions={{
                  stroke: theme.palette.hint,
                }}
              >
                <HiddenOption
                  text={`Delivery`}
                  icon={mdiTankerTruck}
                  onClick={() =>
                    openCreateDeliveryDialog({
                      onCreate: (delivery) => {
                        pushPage(EditDeliveryPage, { delivery });
                      },
                      initClient: client,
                    })
                  }
                />
                <DeleteOption onClick={() => openDeleteClientDialog(client)} />
              </HiddenOptions>
            </Row>
          )}
        </For>
      </SimpleBody>
    </SimplePage>
  );
}
