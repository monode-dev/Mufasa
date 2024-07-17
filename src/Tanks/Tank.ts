import { mfs, premiumEnabled, FuelType } from "@/model/DataModel";
import { createLimitTrackers } from "@/model/LimitUtils";
import { prop } from "mufasa";
import { TankShapeId } from "@/Calculator/ShapeUtils";
import { Client } from "@/Clients/Client";

export class Tank extends mfs.Doc(`Tank`) {
  static readonly limit = createLimitTrackers({
    free: 30,
    premium: 2000,
    getPremiumEnabled: () => premiumEnabled.value,
    getCount: () => Tank.getAllDocs().length,
  });
  mx_parent = prop(Client);
  notes = prop(String, ``);
  fuelType = prop([FuelType, null], null);
  shape = prop([String, null], null) as
    | (ReturnType<typeof prop<StringConstructor, ``>> & TankShapeId)
    | null;
  length = prop([Number, null], null);
  depth = prop([Number, null], null);
  topDepth = prop([Number, null], null);
  fullDepth = prop([Number, null], null);
  height = prop([Number, null], null);
  squareHeight = prop([Number, null], null);
  wideHeight = prop([Number, null], null);
  fullHeight = prop([Number, null], null);
  diameter = prop([Number, null], null);
  creationTimePosix = prop(Number);
  sortPos = prop(Number);
}
