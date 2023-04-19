
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
import TabView from "./miwi-md/TabView.vue";
import Text from "./miwi-md/Text.vue";
import AutoUpdateLoadingScreen from "./views/AutoUpdateLoadingScreen.vue";
import Home from "./views/Home.page.vue";
import Settings from "./views/Settings.page.vue";
import Client from "./views/clients/Client.page.vue";
import ClientEntry from "./views/clients/ClientEntry.vue";
import ClientsTab from "./views/clients/ClientsTab.vue";

declare module "@vue/runtime-core" {
  export interface GlobalComponents {
    App: typeof App;
AppBar: typeof AppBar;
B: typeof B;
B00: typeof B00;
Body: typeof Body;
Button: typeof Button;
Field: typeof Field;
Icon: typeof Icon;
Page: typeof Page;
TabButtons: typeof TabButtons;
TabView: typeof TabView;
Text: typeof Text;
AutoUpdateLoadingScreen: typeof AutoUpdateLoadingScreen;
Home: typeof Home;
Settings: typeof Settings;
Client: typeof Client;
ClientEntry: typeof ClientEntry;
ClientsTab: typeof ClientsTab;
  }
}