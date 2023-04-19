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
import AutoUpdateLoadingScreen from "./views/AutoUpdateLoadingScreen.vue";
import Home from "./views/Home.page.vue";
import Settings from "./views/Settings.page.vue";
import Client from "./views/clients/Client.page.vue";
import ClientEntry from "./views/clients/ClientEntry.vue";
import ClientsTab from "./views/clients/ClientsTab.vue";
import AppBar from "./views/miwi-vue/AppBar.vue";
import B from "./views/miwi-vue/B.vue";
import B00 from "./views/miwi-vue/B00.vue";
import Body from "./views/miwi-vue/Body.vue";
import Button from "./views/miwi-vue/Button.vue";
import Field from "./views/miwi-vue/Field.vue";
import Icon from "./views/miwi-vue/Icon.vue";
import Page from "./views/miwi-vue/Page.vue";
import Text from "./views/miwi-vue/Text.vue";
import Text from "./miwi-md/Text.vue";
// End Generated Imports
CapacitorUpdater.notifyAppReady();

const pinia = createPinia();
const vueApp = createApp(VueApp);

vueApp.use(pinia);
// Begin Generated Components
vueApp.component("App", App);
vueApp.component("AutoUpdateLoadingScreen", AutoUpdateLoadingScreen);
vueApp.component("Home", Home);
vueApp.component("Settings", Settings);
vueApp.component("Client", Client);
vueApp.component("ClientEntry", ClientEntry);
vueApp.component("ClientsTab", ClientsTab);
vueApp.component("AppBar", AppBar);
vueApp.component("B", B);
vueApp.component("B00", B00);
vueApp.component("Body", Body);
vueApp.component("Button", Button);
vueApp.component("Field", Field);
vueApp.component("Icon", Icon);
vueApp.component("Page", Page);
vueApp.component("Text", Text);
vueApp.component("Text", Text);
// End Generated Components
// vueApp.config.globalProperties.$align = Align;

(async () => {
  try {
    await ScreenOrientation.lock({ type: OrientationType.PORTRAIT });
  } catch (e) {}
})();

vueApp.mount("#app");
