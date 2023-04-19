import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { CapacitorUpdater } from "@capgo/capacitor-updater";

export const useMufasa = defineStore("appDetails", () => {
  const appVersion = ref("0.0.0");
  updateVersionNumText();
  async function updateVersionNumText() {
    const currentVersionInfo = await CapacitorUpdater.current();
    appVersion.value = currentVersionInfo.bundle.version;
  }
  return {
    appVersion: computed(() => appVersion.value),
  };
});

export default useMufasa();
