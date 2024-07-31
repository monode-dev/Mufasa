import { mfs, premiumEnabled, FuelType } from "@/model/DataModel";
import { createLimitTrackers } from "@/model/LimitUtils";
import { prop } from "mufasa";
import {
  getDimensionLabel,
  getTankShape,
  TankShapeId,
} from "@/Calculator/ShapeUtils";
import { Client } from "@/Clients/Client";
import { cropAndTrimString, spaceChar } from "@/AppData";
import { exists, roundToString, doNow } from "miwi";

export class Tank extends mfs.Doc(`Tank`) {
  static readonly limit = createLimitTrackers({
    free: 30,
    premium: 25000,
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
  getLabel(options?: Parameters<typeof Tank.getLabel>[1]) {
    return Tank.getLabel(this, options);
  }

  static getLabel(
    tank: Tank,
    options?: { limitNotesCharacters?: number; shouldShowVolume?: boolean },
  ) {
    // if (!isTankValid(tank)) return `Incomplete Tank`;
    const shapeUtils = getTankShape(tank?.shape);
    const fuelName = tank?.fuelType?.name;
    const volume = shapeUtils?.calcTotalVolume(tank);
    const shapeName = shapeUtils?.nameShort;
    const notesPart =
      exists(tank?.notes) && tank?.notes?.trim() !== ``
        ? `"${tank?.notes?.replaceAll(/\s+/g, ` `).trim()}"`
        : ``;
    const dimensionsPart = doNow(() => {
      let result = ``;
      for (const dimension of shapeUtils?.dimensions ?? []) {
        const dimAcronym = getDimensionLabel(dimension)
          ?.split(` `)
          .map((x) => x[0].toUpperCase())
          .join(``);
        const dimValue = tank?.[dimension];
        if (exists(dimValue) && exists(dimAcronym)) {
          result += `${dimAcronym}:${roundToString(dimValue)} `;
        }
      }
      result = result.slice(0, -1);
      return result;
    });
    const limitNotesCharacters =
      options?.limitNotesCharacters ?? Number.POSITIVE_INFINITY;
    let note = cropAndTrimString(notesPart, limitNotesCharacters);
    if (limitNotesCharacters === 0) {
      note = ``;
    }
    const fuel = cropAndTrimString(
      fuelName ?? "New Fuel",
      limitNotesCharacters,
    );
    const shouldShowVolume = options?.shouldShowVolume ?? true;
    const volumePart = shouldShowVolume
      ? ` - ${roundToString(volume ?? 0, 0)}${spaceChar}Gal.`
      : ``;
    return (
      (0 == note.length ? "" : note + " - ") +
      fuel +
      " - " +
      (dimensionsPart.trim() === "" ? "No Dimensions" : dimensionsPart) +
      " - " +
      (shapeName ?? "Unknown Shape") +
      volumePart
    );
  }
}
