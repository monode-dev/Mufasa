import { mfs, premiumEnabled, FuelType } from "@/model/DataModel";
import { createLimitTrackers } from "@/model/LimitUtils";
import { prop } from "@/mufasa/client/src/Mufasa";
import {
  getDimensionLabel,
  getTankShape,
  TankShapeId,
} from "@/Calculator/ShapeUtils";
import { Client } from "@/Clients/Client";
import { spaceChar } from "@/AppData";
import { exists, doNow } from "miwi";
import { MathJs } from "@/utils";

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
    | (ReturnType<typeof prop<typeof String, ``>> & TankShapeId)
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
    options?: {
      excludeParts?: (`fuel` | `dimensions` | `shape` | `volume` | `notes`)[];
    },
  ) {
    // Utils
    const shapeUtils = getTankShape(tank?.shape);
    const excludeParts = options?.excludeParts ?? [];

    // Calculate Label Parts
    const labelParts: {
      [Key in (typeof excludeParts)[number]]: string;
    } = {
      fuel: tank?.fuelType?.name?.trim() ?? "Unspecified Fuel",
      dimensions: (shapeUtils?.dimensions ?? [])
        .reduce((text, dimensionId) => {
          const acronym = getDimensionLabel(dimensionId)
            .split(` `)
            .map((x) => x[0].toUpperCase())
            .join(``);
          const value = exists(tank[dimensionId])
            ? MathJs.round(tank[dimensionId]).toString()
            : `?`;
          return `${text} ${acronym}:${value}`;
        }, ``)
        .trim(),
      shape: shapeUtils?.nameShort ?? "Unknown Shape",
      volume: doNow(() => {
        const volume = shapeUtils?.calcTotalVolume(tank);
        return exists(volume)
          ? `${MathJs.round(volume ?? 0)}${spaceChar}Gal.`
          : `Unknown Volume`;
      }),
      notes:
        exists(tank?.notes) && tank?.notes?.trim() !== ``
          ? `"${tank?.notes?.replaceAll(/\s+/g, ` `).trim()}"`
          : ``,
    } as const;

    // Join Label Parts
    return Object.entries(labelParts)
      .filter(
        ([key, partText]) =>
          !excludeParts.includes(key as any) && partText.trim() !== ``,
      )
      .map(([_, partText]) => partText)
      .join(` - `);
  }
}
