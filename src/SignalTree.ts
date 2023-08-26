import { DeepPartial, exists } from "./utils";
import { Signal } from "./Implement";

export type SignalEvent = {
  listen: () => void;
  trigger: () => void;
};
export type GenericSignalTree = {
  [key: string]: GenericSignalTree | SignalEvent;
};
export function newSignalTree<T extends GenericSignalTree>(
  signal: (init: number) => Signal<number>,
  root: DeepPartial<T> = {} as any,
  subTreePath: string[] = [],
): T {
  // This lets us force create missing data on listens, and ignore missing data on triggers.
  return new Proxy(() => {}, {
    // Don't do anything unitl we know whether this is a trigger or a listen.
    get(_, propKey) {
      return newSignalTree<GenericSignalTree>(signal, root, [
        ...subTreePath,
        propKey.toString(),
      ]);
    },
    // Handle triggers and listens.
    apply() {
      if (subTreePath[subTreePath.length - 1] === `trigger`) {
        // Handle trigger
        const pathToSignal = subTreePath.slice(0, subTreePath.length - 1);
        let signalToTrigger: any | undefined = root;
        for (const key of pathToSignal) {
          signalToTrigger = signalToTrigger?.[key];
        }
        if (exists(signalToTrigger)) {
          signalToTrigger.value++;
        }
      } else {
        // Handle listen
        let signalToListenTo: any = root;

        // Ensure path exists
        const pathToSignal = subTreePath.slice(0, subTreePath.length - 2);
        for (const key of pathToSignal) {
          if (!exists(signalToListenTo?.[key])) {
            signalToListenTo[key] = {};
          }
          signalToListenTo = signalToListenTo[key];
        }

        // Ensure signal exists
        const signalKey = subTreePath[subTreePath.length - 2];
        if (!exists(signalToListenTo?.[signalKey])) {
          signalToListenTo[signalKey] = signal(0);
        }

        // Listen to signal
        signalToListenTo[signalKey].value;
      }
    },
  }) as any as T;
}
