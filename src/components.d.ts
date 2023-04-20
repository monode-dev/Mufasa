
import App from "./App.vue";
import AppBar from "./miwi-md/AppBar.vue";
import B00 from "./miwi-md/B00.vue";
import Body from "./miwi-md/Body.vue";
import Box from "./miwi-md/Box.vue";
import Button from "./miwi-md/Button.vue";
import Column from "./miwi-md/Column.vue";
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
import AutoUpdateLoadingScreen from "./views/components/AutoUpdateLoadingScreen.vue";
import ConfettiTab from "./views/components/ConfettiTab.vue";
import OfflineWarning from "./views/components/OfflineWarning.vue";
import Settings from "./views/settings/Settings.page.vue";
import SettingsButton from "./views/settings/SettingsButton.vue";

declare module "@vue/runtime-core" {
  export interface GlobalComponents {
    App: typeof App;
AppBar: typeof AppBar;
B00: typeof B00;
Body: typeof Body;
Box: typeof Box;
Button: typeof Button;
Column: typeof Column;
Field: typeof Field;
Icon: typeof Icon;
Page: typeof Page;
Row: typeof Row;
Stack: typeof Stack;
TabButtons: typeof TabButtons;
TabView: typeof TabView;
Text: typeof Text;
Home: typeof Home;
Client: typeof Client;
ClientEntry: typeof ClientEntry;
ClientSearchBar: typeof ClientSearchBar;
ClientsTab: typeof ClientsTab;
AutoUpdateLoadingScreen: typeof AutoUpdateLoadingScreen;
ConfettiTab: typeof ConfettiTab;
OfflineWarning: typeof OfflineWarning;
Settings: typeof Settings;
SettingsButton: typeof SettingsButton;
  }
}