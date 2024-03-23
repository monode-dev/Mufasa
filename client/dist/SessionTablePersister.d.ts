import { Session } from "./DocStore.js";
import type { MosaApi } from "@monode/mosa";
/** This is a virtual store, meaning if you ask for data that doesn't
 * exist we will create the data and return it. This allows the store
 * to work even when data is delayed. */
export declare function sessionTablePersister(mosaApi: MosaApi): Session.TablePersister;
