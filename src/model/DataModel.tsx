import { prop, initializeMufasa } from "mufasa";
import { useProp, doWatch, exists, doNow, useFormula, useRoot } from "miwi";
import { autoSavingProp, devLog } from "../Utils";
import { createRoot } from "solid-js";
import { capacitorPersister } from "mufasa/capacitor";
import { solidPersister } from "mufasa/solid-js";
import { cloudPersister } from "./CloudPersister";
import { createLimitTrackers } from "./LimitUtils";
import { miapStore } from "miap";
import { Capacitor } from "@capacitor/core";

// SECTION: Mufasa
export const mfs = initializeMufasa({
  stage: import.meta.env.PROD || true ? `Prod` : `Dev`,
  sessionPersister: solidPersister(),
  devicePersister: capacitorPersister(),
  cloudPersister: cloudPersister,
});

// SECTION: Purchases
export const premiumEnabled = createRoot(() =>
  useFormula(
    () => mfs.user.workspace?.workspaceEntitlements?.includes(`pro`) ?? false,
  ),
);
const _lastPurchaseAttempt = doNow(() => {
  const _lastPurchaseAttemptProp = useFormula(() =>
    exists(mfs.user.uid)
      ? autoSavingProp<number>(`lastPurchaseAttempt-${mfs.user.uid}`, 0)
      : undefined,
  );
  return useFormula(
    () => _lastPurchaseAttemptProp.value?.value ?? 0,
    (newVal) => {
      const prop = _lastPurchaseAttemptProp.value;
      if (!exists(prop)) return;
      prop.value = newVal;
    },
  );
});
const _isShowingSubscriptionPopup = useRoot(() => useProp(false));
export const isSubscribing = useRoot(() =>
  useFormula(() => {
    if (premiumEnabled.value) return false;
    if (_isShowingSubscriptionPopup.value) return true;
    if (Date.now() - _lastPurchaseAttempt.value > 10 * 60 * 1000) return false;
    return true;
  }),
);
export const store = miapStore({
  getDeviceType: () => Capacitor.getPlatform() as any,
  watchIapUserId: (watch) => {
    doWatch(
      () => {
        watch(mfs.user.workspace?.id);
      },
      { on: [useFormula(() => mfs.user.workspace?.id)] },
    );
  },
  apiKeys: {
    ios: `appl_IXiiZhzdEIiqfJMBClcOYUfeTHg`,
    android: `goog_qHEqPAbdsCMzFblmVncPsoiUcFy`,
  },
  products: {
    premium: {
      ios: "pro.monthly.07.16.2024",
      android: "",
    },
  },
  devLog: devLog,
  onPurchaseAttempt: () => (_lastPurchaseAttempt.value = Date.now()),
  onPurchasePromptToggle: (isShowing) =>
    (_isShowingSubscriptionPopup.value = isShowing),
});

// SECTION: Data Model
export class FuelType extends mfs.Doc(`FuelType`) {
  static readonly limit = createLimitTrackers({
    free: 10,
    premium: 100,
    getPremiumEnabled: () => premiumEnabled.value,
    getCount: () => FuelType.getAllDocs().length,
  });
  name = prop([String, null], null);
  rate = prop([Number, null], null);
  createdPosix = prop(Number);

  static get all() {
    return FuelType.getAllDocs().sort(
      (a, b) => a.createdPosix - b.createdPosix,
    );
  }

  static isValid(fuelType: Partial<FuelType> | null | undefined) {
    return (
      exists(fuelType) &&
      exists(fuelType?.name) &&
      exists(fuelType?.rate) &&
      fuelType?.rate > 0 &&
      fuelType.name.trim() !== ``
    );
  }
}
