import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";
import { ScreenOrientation, OrientationType } from '@capawesome/capacitor-screen-orientation';
import { CapacitorUpdater } from '@capgo/capacitor-updater';
CapacitorUpdater.notifyAppReady();

const app = createApp(App);

app.use(router);

(async () => {
  try {
    await ScreenOrientation.lock({ type: OrientationType.PORTRAIT });
  } catch (e) {
  }
})();

app.mount("#app");
