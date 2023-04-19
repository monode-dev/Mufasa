
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

declare module "@vue/runtime-core" {
  export interface GlobalComponents {
    App: typeof App;
AutoUpdateLoadingScreen: typeof AutoUpdateLoadingScreen;
Home: typeof Home;
Settings: typeof Settings;
Client: typeof Client;
ClientEntry: typeof ClientEntry;
ClientsTab: typeof ClientsTab;
AppBar: typeof AppBar;
B: typeof B;
B00: typeof B00;
Body: typeof Body;
Button: typeof Button;
Field: typeof Field;
Icon: typeof Icon;
Page: typeof Page;
Text: typeof Text;
  }
}