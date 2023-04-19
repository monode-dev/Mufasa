import { createApp } from "vue";
import { createPinia } from "pinia";
import VueApp from "./App.vue";
import "./assets/main.css";
import {
  ScreenOrientation,
  OrientationType,
} from "@capawesome/capacitor-screen-orientation";
// import { Align } from './miwi-vue/B00.vue';
import { CapacitorUpdater } from "@capgo/capacitor-updater";
// Begin Generated Imports
import App from "./App.vue";
import AppBar from "./miwi-md/AppBar.vue";
import B from "./miwi-md/B.vue";
import B00 from "./miwi-md/B00.vue";
import Body from "./miwi-md/Body.vue";
import Button from "./miwi-md/Button.vue";
import Field from "./miwi-md/Field.vue";
import Icon from "./miwi-md/Icon.vue";
import Page from "./miwi-md/Page.vue";
import TabButtons from "./miwi-md/TabButtons.vue";
import Text from "./miwi-md/Text.vue";
import AutoUpdateLoadingScreen from "./views/AutoUpdateLoadingScreen.vue";
import Home from "./views/Home.page.vue";
import Settings from "./views/Settings.page.vue";
import Client from "./views/clients/Client.page.vue";
import ClientEntry from "./views/clients/ClientEntry.vue";
import ClientsTab from "./views/clients/ClientsTab.vue";
import TabView from "./miwi-md/TabView.vue";
// End Generated Imports
CapacitorUpdater.notifyAppReady();

const pinia = createPinia();
const vueApp = createApp(VueApp);

vueApp.use(pinia);
// Begin Generated Components
vueApp.component("App", App);
vueApp.component("AppBar", AppBar);
vueApp.component("B", B);
vueApp.component("B00", B00);
vueApp.component("Body", Body);
vueApp.component("Button", Button);
vueApp.component("Field", Field);
vueApp.component("Icon", Icon);
vueApp.component("Page", Page);
vueApp.component("TabButtons", TabButtons);
vueApp.component("Text", Text);
vueApp.component("AutoUpdateLoadingScreen", AutoUpdateLoadingScreen);
vueApp.component("Home", Home);
vueApp.component("Settings", Settings);
vueApp.component("Client", Client);
vueApp.component("ClientEntry", ClientEntry);
vueApp.component("ClientsTab", ClientsTab);
vueApp.component("TabView", TabView);
// End Generated Components
// vueApp.config.globalProperties.$align = Align;

(async () => {
  try {
    await ScreenOrientation.lock({ type: OrientationType.PORTRAIT });
  } catch (e) {}
})();

vueApp.mount("#app");
