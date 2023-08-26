import { DeepPartial } from "./utils";
import { Signal } from "./Implement";
export type SignalEvent = {
    listen: () => void;
    trigger: () => void;
};
export type GenericSignalTree = {
    [key: string]: GenericSignalTree | SignalEvent;
};
export declare function newSignalTree<T extends GenericSignalTree>(signal: (init: number) => Signal<number>, root?: DeepPartial<T>, subTreePath?: string[]): T;
