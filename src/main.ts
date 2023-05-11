import { createApp } from "vue";
import { createPinia } from "pinia";
import VueApp from "./App.vue";
import "./assets/main.css";
import {
  ScreenOrientation,
  OrientationType,
} from "@capawesome/capacitor-screen-orientation";
import { CapacitorUpdater } from "@capgo/capacitor-updater";
import { registerGlobalProperties } from "@/miwi-md/BoxUtils";
import mdiVue from "mdi-vue/v3";
import * as mdijs from "@mdi/js";
// Vuetify Imports
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

// Begin Generated Imports
import App from "./App.vue";
import AppBar from "./miwi-md/AppBar.vue";
import B00 from "./miwi-md/B00.vue";
import Body from "./miwi-md/Body.vue";
import Box from "./miwi-md/Box.vue";
import Button from "./miwi-md/Button.vue";
import Card from "./miwi-md/Card.vue";
import Column from "./miwi-md/Column.vue";
import DropDown from "./miwi-md/DropDown.vue";
import Field from "./miwi-md/Field.vue";
import Icon from "./miwi-md/Icon.vue";
import Page from "./miwi-md/Page.vue";
import Row from "./miwi-md/Row.vue";
import Stack from "./miwi-md/Stack.vue";
import TabButtons from "./miwi-md/TabButtons.vue";
import TabView from "./miwi-md/TabView.vue";
import Text from "./miwi-md/Text.vue";
import Home from "./views/Home.page.vue";
import Client from "./views/clients/Client.page.vue";
import ClientEntry from "./views/clients/ClientEntry.vue";
import ClientSearchBar from "./views/clients/ClientSearchBar.vue";
import ClientsTab from "./views/clients/ClientsTab.vue";
import TankEntry from "./views/clients/TankEntry.vue";
import AutoUpdateLoadingScreen from "./views/components/AutoUpdateLoadingScreen.vue";
import ConfettiTab from "./views/components/ConfettiTab.vue";
import OfflineWarning from "./views/components/OfflineWarning.vue";
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
vueApp.component("B00", B00);
vueApp.component("Body", Body);
vueApp.component("Box", Box);
vueApp.component("Button", Button);
vueApp.component("Card", Card);
vueApp.component("Column", Column);
vueApp.component("DropDown", DropDown);
vueApp.component("Field", Field);
vueApp.component("Icon", Icon);
vueApp.component("Page", Page);
vueApp.component("Row", Row);
vueApp.component("Stack", Stack);
vueApp.component("TabButtons", TabButtons);
vueApp.component("TabView", TabView);
vueApp.component("Text", Text);
vueApp.component("Home", Home);
vueApp.component("Client", Client);
vueApp.component("ClientEntry", ClientEntry);
vueApp.component("ClientSearchBar", ClientSearchBar);
vueApp.component("ClientsTab", ClientsTab);
vueApp.component("TankEntry", TankEntry);
vueApp.component("AutoUpdateLoadingScreen", AutoUpdateLoadingScreen);
vueApp.component("ConfettiTab", ConfettiTab);
vueApp.component("OfflineWarning", OfflineWarning);
vueApp.component("Settings", Settings);
vueApp.component("SettingsButton", SettingsButton);
// End Generated Components
// vueApp.config.globalProperties.$align = Align;

const vuetify = createVuetify({
  components,
  directives,
});
vueApp.use(vuetify);

(async () => {
  try {
    await ScreenOrientation.lock({ type: OrientationType.PORTRAIT });
  } catch (e) {}
})();

vueApp.mount("#app");
