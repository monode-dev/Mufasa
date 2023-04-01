import { createApp } from "vue";
import { createPinia } from 'pinia'
import VueApp from "./App.vue";
// import router from "./router";
import "./assets/main.css";
import { ScreenOrientation, OrientationType } from '@capawesome/capacitor-screen-orientation';
import { CapacitorUpdater } from '@capgo/capacitor-updater';
CapacitorUpdater.notifyAppReady();

const pinia = createPinia()
const vueApp = createApp(VueApp);

vueApp.use(pinia);
// vueApp.use(router);

(async () => {
  try {
    await ScreenOrientation.lock({ type: OrientationType.PORTRAIT });
  } catch (e) {
  }
})();

vueApp.mount("#app");
