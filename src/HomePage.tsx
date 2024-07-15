import { useProp, useNav, Page, AppBar, Icon, TabButtons, TabView } from "miwi";
import { mdiCog } from "@mdi/js";
import { SettingsPage } from "./settings/SettingsPage";
import CalculatorsTab from "@/Calculator/CalculatorsTab";
import ClientsTab from "./Clients/ClientsTab";
import DeliveriesTab from "./Deliveries/DeliveriesTab";
import { mfs } from "./model/DataModel";

export function HomePage() {
  // Preload the other members
  if (mfs.user.workspace?.role === `owner`) {
    mfs.user.workspace.otherMembers;
  }
  const nav = useNav();
  const selectedTab = useProp(1);
  return (
    <Page>
      <AppBar
        shadowSize={selectedTab.value === 0 ? 0 : 1.25}
        right={
          <Icon
            iconPath={mdiCog}
            onClick={() => {
              nav.pushPage(SettingsPage, {});
            }}
          />
        }
        bottom={
          <TabButtons
            selectedTab={selectedTab}
            labels={["Clients", "Deliveries", "Calculators"]}
          />
        }
      >
        Ninety Percent
      </AppBar>
      <TabView
        selectedTabSig={selectedTab}
        // Clientes Tab
        tab0={<ClientsTab />}
        // Deliveries Tab
        tab1={<DeliveriesTab />}
        // Calculators Tab
        tab2={<CalculatorsTab />}
      />
    </Page>
  );
}
