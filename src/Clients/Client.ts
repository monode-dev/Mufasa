import { mfs, premiumEnabled } from "@/model/DataModel";
import { createLimitTrackers } from "@/model/LimitUtils";
import { Tank } from "@/Tanks/Tank";
import { prop, list } from "mufasa";

export class Client extends mfs.Doc(`Client`) {
  static readonly limit = createLimitTrackers({
    free: 10,
    premium: 10000,
    getPremiumEnabled: () => premiumEnabled.value,
    getCount: () => Client.getAllDocs().length,
  });
  name = prop(String);
  clientId = prop(String);
  phoneNumber = prop(String, ``);
  address = prop(String, ``);
  notes = prop(String, ``);
  readonly tanks = list(Tank, `mx_parent`);
  onDelete() {
    this.tanks.forEach((tank) => tank.deleteDoc());
  }
}
