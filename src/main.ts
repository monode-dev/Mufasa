import { createApp } from "vue";
import { createPinia } from "pinia";
import VueApp from "./App.vue";
import "./assets/main.css";
import {
  ScreenOrientation,
  OrientationType,
} from "@capawesome/capacitor-screen-orientation";
import { CapacitorUpdater } from "@capgo/capacitor-updater";
import { registerGlobalProperties } from "@/miwi-md/Box/Box";
import mdiVue from "mdi-vue/v3";
import * as mdijs from "@mdi/js";

// Begin Generated Imports
import App from "./App.vue";
import AppBar from "./miwi-md/AppBar.vue";
import Body from "./miwi-md/Body.vue";
import Button from "./miwi-md/Button.vue";
import Card from "./miwi-md/Card.vue";
import Column from "./miwi-md/Column.vue";
import DropDown from "./miwi-md/DropDown.vue";
import Field from "./miwi-md/Field.vue";
import Icon from "./miwi-md/Icon.vue";
import NumField from "./miwi-md/NumField.vue";
import Page from "./miwi-md/Page.vue";
import Row from "./miwi-md/Row.vue";
import Slider from "./miwi-md/Slider.vue";
import Stack from "./miwi-md/Stack.vue";
import TabButtons from "./miwi-md/TabButtons.vue";
import TabView from "./miwi-md/TabView.vue";
import Text from "./miwi-md/Text.vue";
import Home from "./views/Home.page.vue";
import Box from "./miwi-md/Box/Box.vue";
import CalculatorsTab from "./views/calculators/CalculatorsTab.vue";
import Client from "./views/clients/Client.page.vue";
import ClientActionBar from "./views/clients/ClientActionBar.vue";
import ClientEntry from "./views/clients/ClientEntry.vue";
import ClientFields from "./views/clients/ClientFields.vue";
import ClientSearchBar from "./views/clients/ClientSearchBar.vue";
import ClientsTab from "./views/clients/ClientsTab.vue";
import CreateClient from "./views/clients/CreateClient.dialog.vue";
import OutlinedActionButton from "./views/clients/OutlinedActionButton.vue";
import TankEntry from "./views/clients/TankEntry.vue";
import TankFields from "./views/clients/TankFields.vue";
import AutoUpdateLoadingScreen from "./views/components/AutoUpdateLoadingScreen.vue";
import DeleteDialog from "./views/components/DeleteDialog.vue";
import DeleteOptionsButton from "./views/components/DeleteOptionsButton.vue";
import Label from "./views/components/Label.vue";
import OfflineWarning from "./views/components/OfflineWarning.vue";
import CompletedDeliveryEntry from "./views/deliveries/CompletedDeliveryEntry.vue";
import CompleteDelivery from "./views/deliveries/CompleteDelivery.dialog.vue";
import CreateDelivery from "./views/deliveries/CreateDelivery.dialog.vue";
import DeliveriesTab from "./views/deliveries/DeliveriesTab.vue";
import UpcomingDeliveryEntry from "./views/deliveries/UpcomingDeliveryEntry.vue";
import FuelTypeEntry from "./views/settings/FuelTypeEntry.vue";
import Settings from "./views/settings/Settings.page.vue";
import SettingsButton from "./views/settings/SettingsButton.vue";
// End Generated Imports
CapacitorUpdater.notifyAppReady();

const pinia = createPinia();
const vueApp = createApp(VueApp);
registerGlobalProperties(vueApp);
vueApp.use(pinia);
vueApp.use(mdiVue, {
  icons: mdijs,
});
// Begin Generated Components
vueApp.component("App", App);
vueApp.component("AppBar", AppBar);
vueApp.component("Body", Body);
vueApp.component("Button", Button);
vueApp.component("Card", Card);
vueApp.component("Column", Column);
vueApp.component("DropDown", DropDown);
vueApp.component("Field", Field);
vueApp.component("Icon", Icon);
vueApp.component("NumField", NumField);
vueApp.component("Page", Page);
vueApp.component("Row", Row);
vueApp.component("Slider", Slider);
vueApp.component("Stack", Stack);
vueApp.component("TabButtons", TabButtons);
vueApp.component("TabView", TabView);
vueApp.component("Text", Text);
vueApp.component("Home", Home);
vueApp.component("Box", Box);
vueApp.component("CalculatorsTab", CalculatorsTab);
vueApp.component("Client", Client);
vueApp.component("ClientActionBar", ClientActionBar);
vueApp.component("ClientEntry", ClientEntry);
vueApp.component("ClientFields", ClientFields);
vueApp.component("ClientSearchBar", ClientSearchBar);
vueApp.component("ClientsTab", ClientsTab);
vueApp.component("CreateClient", CreateClient);
vueApp.component("OutlinedActionButton", OutlinedActionButton);
vueApp.component("TankEntry", TankEntry);
vueApp.component("TankFields", TankFields);
vueApp.component("AutoUpdateLoadingScreen", AutoUpdateLoadingScreen);
vueApp.component("DeleteDialog", DeleteDialog);
vueApp.component("DeleteOptionsButton", DeleteOptionsButton);
vueApp.component("Label", Label);
vueApp.component("OfflineWarning", OfflineWarning);
vueApp.component("CompletedDeliveryEntry", CompletedDeliveryEntry);
vueApp.component("CompleteDelivery", CompleteDelivery);
vueApp.component("CreateDelivery", CreateDelivery);
vueApp.component("DeliveriesTab", DeliveriesTab);
vueApp.component("UpcomingDeliveryEntry", UpcomingDeliveryEntry);
vueApp.component("FuelTypeEntry", FuelTypeEntry);
vueApp.component("Settings", Settings);
vueApp.component("SettingsButton", SettingsButton);
// End Generated Components
// vueApp.config.globalProperties.$align = Align;

(async () => {
  try {
    await ScreenOrientation.lock({ type: OrientationType.PORTRAIT });
  } catch (e) {}
})();

vueApp.mount("#app");
