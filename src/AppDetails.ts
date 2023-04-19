import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { CapacitorUpdater } from "@capgo/capacitor-updater";

export const useAppDetails = defineStore("appDetails", () => {
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

export const appVersion = computed(() => useAppDetails().appVersion);
