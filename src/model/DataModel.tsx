import { prop, initializeMufasa, formula } from "mufasa";
import {
  useProp,
  doWatch,
  exists,
  doNow,
  useFormula,
  useRoot,
  FloatSort,
} from "miwi";
import { autoSavingProp, devLog } from "@/utils";
import { createRoot, untrack } from "solid-js";
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

const workspace = mfs.user?.workspace;
if (exists(workspace) && workspace.haveJoined) {
  workspace.id;
  workspace.otherMembers;
  workspace.workspaceEntitlements;
}

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
      android: "pro.monthly.07.16.2024",
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
    free: 5,
    premium: 50,
    getPremiumEnabled: () => premiumEnabled.value,
    getCount: () => FuelType.sortedFuelTypes.length,
  });
  name = prop([String, null], null);
  amountOfFuel = prop([String, null], null);
  rate = prop([Number, null], null);
  createdPosix = prop(Number);
  _sortPos = prop([Number, null]);
  sortPos = formula(
    () => {
      if (!exists(this._sortPos)) {
        this._sortPos = untrack(() => this.createdPosix);
      }
      return this._sortPos as number;
    },
    (newVal) => (this._sortPos = newVal),
  );

  static get sortedFuelTypes() {
    return FloatSort.toSorted({
      list: FuelType.getAllDocs(),
      getPos: (doc) => doc.sortPos,
      getUid: (doc) => doc.docId,
    });
  }

  static isValid(fuelType: Partial<FuelType> | null | undefined) {
    return (
      exists(fuelType) &&
      exists(fuelType.name) &&
      fuelType.name.trim() !== `` &&
      exists(fuelType.rate) &&
      fuelType.rate > 0
    );
  }
}
