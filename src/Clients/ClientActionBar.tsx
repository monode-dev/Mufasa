import { Show } from "solid-js";
import { Box, Row, Prop, pushPage, useNav, doWatch } from "miwi";
import OutlinedActionButton from "./OutlinedActionButton";
import { mdiMagnify, mdiPlus } from "@mdi/js";
import ClientSearchBar from "./ClientSearchBar";
import CreateClientDialog from "./CreateClientDialog";
import ClientPage from "./ClientPage";

export default function ClientActionBar(props: {
  filterString: Prop<string>;
  isSearching: Prop<boolean>;
}) {
  const nav = useNav();

  function toggleSearch() {
    props.isSearching.value = !props.isSearching.value;
  }
  doWatch(() => {
    if (!props.isSearching.value) {
      props.filterString.value = ``;
    }
  });

  return (
    <>
      <Row
        fill={$theme.colors.primary}
        widthGrows
        align={$Align.spaceEvenly}
        padAroundY={0.75}
        padAroundX={0}
        shadowSize={1.25}
        shadowDirection={$Align.bottomCenter}
      >
        <Show when={!props.isSearching.value}>
          <OutlinedActionButton
            action={"Search"}
            iconPath={mdiMagnify}
            onClick={toggleSearch} // TODO prove that this works
          ></OutlinedActionButton>

          <OutlinedActionButton
            action={"New"}
            iconPath={mdiPlus}
            onClick={() => {
              nav.pushPage(CreateClientDialog, {
                onCreate: (newClient) =>
                  pushPage(ClientPage, { client: newClient }),
              });
            }}
          />
        </Show>

        <Show when={props.isSearching.value}>
          <Box padAroundX={2}>
            <ClientSearchBar
              filterString={props.filterString}
              isSearching={props.isSearching}
            />
          </Box>
        </Show>
      </Row>
    </>
  );
}
