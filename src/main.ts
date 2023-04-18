import { createApp } from "vue";
import { createPinia } from "pinia";
import VueApp from "./App.vue";
import "./assets/main.css";
import {
  ScreenOrientation,
  OrientationType,
} from "@capawesome/capacitor-screen-orientation";
import B00, { Align } from "./views/miwi-vue/B00.vue";
// import { Align } from './miwi-vue/B00.vue';
import { CapacitorUpdater } from "@capgo/capacitor-updater";
CapacitorUpdater.notifyAppReady();

const pinia = createPinia();
const vueApp = createApp(VueApp);

vueApp.use(pinia);
vueApp.component("box", B00);
vueApp.config.globalProperties.$align = Align;

(async () => {
  try {
    await ScreenOrientation.lock({ type: OrientationType.PORTRAIT });
  } catch (e) {}
})();

vueApp.mount("#app");
