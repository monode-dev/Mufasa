import { useFormula } from "miwi";
import { createRoot } from "solid-js";

export function createLimitTrackers(config: {
  free: number;
  premium: number;
  getPremiumEnabled: () => boolean;
  getCount: () => number;
  mayAdd?: () => boolean;
}) {
  const max = createRoot(() =>
    useFormula(() =>
      config.getPremiumEnabled() ? config.premium : config.free,
    ),
  );
  return {
    get freeLimit() {
      return config.free;
    },
    get proLimit() {
      return config.premium;
    },
    get max() {
      return max.value;
    },
    get count() {
      return config.getCount();
    },
    get countToLimit() {
      return this.max - config.getCount();
    },
    get mayAdd() {
      return this.countToLimit > 0 && (config.mayAdd?.() ?? true);
    },
  };
}
